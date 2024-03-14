import { BrowserWindow, IpcMain } from "electron";
import { spawn } from "child_process";
import { item, login } from "../../main-password/templates/_index";

const kill = require('tree-kill');

//The common prompts returned from the Bitwarden CLI
const twoStep: string = 'Two-step login code';
const incorrectTwoStep: string = 'Two-step token is invalid';
const invalidDetails: string = 'Username or password is incorrect';
const invalidPassword: string = 'Invalid master password';
const loggedIn: string = 'You are logged in';
const loggedOut: string = 'You have logged out';
const alreadyLoggedIn: string = 'You are already logged in';
const vaultUnlocked: string = 'Your vault is now unlocked';

export default class PasswordController {
    ipcMain: IpcMain;
    mainWindow: BrowserWindow;
    sessionKey: string|undefined|null;
    defaultCollectionId: string|undefined|null;
    organizationId: string|undefined|null;

    constructor(ipcMain: IpcMain, mainWindow: BrowserWindow) {
        this.ipcMain = ipcMain;
        this.mainWindow = mainWindow;
        this.sessionKey = undefined;
        this.defaultCollectionId = undefined;
        this.organizationId = undefined;
    }

    /**
     * Initiate the config tool listener, each function uses a different channel handle to respond to
     * different events that the frontend requires.
     */
    startup(): void {
        this.passwordToolListenerDelegate();
    }

    /**
     * Create a listener that will delegate actions between the password tool functions depending on what channel type has
     * been sent. This allows just one listener to be active rather than individual function ones.
     */
    passwordToolListenerDelegate(): void {
        this.ipcMain.on('password_function', async (_event, info) => {
            switch (info.channelType) {

                case "login":
                    await this.attemptLogin(info);
                    break;

                case "generate":
                    await this.generatePassword(info);
                    break;

                case "add":
                    await this.addEntry(info);
                    break;

                case "search":
                    await this.searchVault(info);
                    break;

                case "read":
                    await this.readVault();
                    break;

                case "logout":
                    await this.attemptLogout();
                    break;

                default:
                    console.log(info);
                    break;
            }
        });
    }

    /**
     * Attempt to log in using the supplied details, collect the session key if the login is successful
     * @param info
     */
    async attemptLogin(info: any): Promise<void> {
        //bw login [email] [password] --method <method> --code <code>
        const loginCommand = `bw login ${info.email} ${info.password} 1`;
        const codeCommand = info.code !== undefined && info.code?.length !== 0 ? ` --code ${info.code}` : '';

        this.runBitwardenCommand(loginCommand + codeCommand).then((output: string) => {
            if (output.includes(loggedIn)) {
                // Use a regular expression to capture the text between quotes
                const match = /export BW_SESSION="([^"]+)"/.exec(output);

                // Collect the BW_SESSION key from the captured output text
                this.sessionKey = match ? match[1] : null;

                this.mainWindow.webContents.send('backend_message', {
                    channelType: 'password_valid_session'
                });

                // Collect the default collection ID
                this.collectDefaultCollectionId()
            } else {
                //console.log('Bitwarden CLI Output:', output);
            }
        })
        .catch(async (error: string) => {
            if (error.includes(twoStep)) {
                this.mainWindow.webContents.send('backend_message', {
                    channelType: 'password_two_step'
                });

            } else if (error.includes(invalidDetails)) {
                this.mainWindow.webContents.send('backend_message', {
                    channelType: 'password_error_message',
                    error: invalidDetails
                });

            } else if (error.includes(incorrectTwoStep)) {
                this.mainWindow.webContents.send('backend_message', {
                    channelType: 'password_error_message',
                    error: incorrectTwoStep
                });
            } else if (error.includes(alreadyLoggedIn)) {
                const regex = /You are already logged in as (.+)\./;
                const match = error.match(regex);

                let errorMessage: string;
                if (match && match[1]) {
                    errorMessage = `You are already logged in as ${match[1]}`;
                } else {
                    errorMessage = `${alreadyLoggedIn}.`;
                }

                this.mainWindow.webContents.send('backend_message', {
                    channelType: 'password_error_message',
                    error: errorMessage + " Unlocking vault now."
                });

                //Unlock the vault and start a valid session
                await this.attemptUnlock(info.password);
            } else {
                console.error('Error:', error);
            }
        });
    }

    /**
     * A user already has a valid session but requires that their vault be unlocked again. Unlock the vault and save
     * the new session key.
     * @param password A string of the Users master password.
     */
    async attemptUnlock(password: string): Promise<void> {
        this.runBitwardenCommand(`bw unlock ${password}`).then((output) => {
            if (output.includes(vaultUnlocked)) {
                // Use a regular expression to capture the text between quotes
                const match = /export BW_SESSION="([^"]+)"/.exec(output);

                // Collect the BW_SESSION key from the captured output text
                this.sessionKey = match ? match[1] : null;

                this.mainWindow.webContents.send('backend_message', {
                    channelType: 'password_unlock'
                });

                // Collect the default collection ID
                this.collectDefaultCollectionId()
            } else {
                //console.log('Bitwarden CLI Output:', output);
            }
        })
        .catch((error) => {
            if (error.includes(invalidPassword)) {
                this.mainWindow.webContents.send('backend_message', {
                    channelType: 'password_error_message',
                    error: `${invalidDetails}`
                });
            } else {
                this.mainWindow.webContents.send('backend_message', {
                    channelType: 'password_error_message',
                    error: error
                });
            }
            console.error('Error:', error);
        });
    }

    /**
     * Use the bitwarden CLI to automatically generate a password and return it to the front end. The stationIndex
     * matches an entry in the passwordStore.
     * @param info An object containing the station index the password is to be associated with.
     */
    async generatePassword(info: any): Promise<void> {
        this.runBitwardenCommand(`bw generate -uln --length 14 --session ${this.sessionKey}`).then((output) => {
            //console.log('Bitwarden CLI Output:', output);

            this.mainWindow.webContents.send('backend_message', {
                channelType: 'password_generated',
                stationIndex: info.stationIndex,
                password: output
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    /**
     * Add an entry into bitwarden using the generic templates.
     * @param info An object containing the entryName, username and password for the new entry.
     */
    async addEntry(info: any): Promise<void> {
        // Create a new item template
        const newItem = {
            ...item,
            name: info.entryName,
            organizationId: this.organizationId,
            collectionIds: this.defaultCollectionId ? [this.defaultCollectionId] : [],
            login: {
                ...login,
                username: info.username,
                password: info.password,
                uris: [{ match: null, uri: "store.steampowered.com" }],
            },
        };

        // Convert the object to JSON
        const json = JSON.stringify(newItem);

        // Encode the JSON
        const encodedJson = this.base64Encode(json);

        // The bitwarden create command with the session key for validation
        const command = `bw create item ${encodedJson} ${this.organizationId} --session ${this.sessionKey}`;

        this.runBitwardenCommand(`${command}`).then((output) => {
            //console.log('Bitwarden CLI Output:', output);

            this.mainWindow.webContents.send('backend_message', {
                channelType: 'saving_success'
            });
        })
        .catch((error) => {
            console.error('Error:', error);

            this.mainWindow.webContents.send('backend_message', {
                channelType: 'saving_error_message',
                error: error
            });
        });
    }

    base64Encode(value: string): string {
        return Buffer.from(value).toString('base64');
    }

    /**
     * Collect the default collection ID for the passwords, saving it for future use.
     */
    async collectDefaultCollectionId(): Promise<void> {
        this.runBitwardenCommand(`bw list collections --search Dev/LeadMe/Web --session ${this.sessionKey}`).then((output) => {
            //console.log('Bitwarden CLI Output:', output);

            // Parse the JSON string into an array of objects
            const dataArray = JSON.parse(output);

            // Check if the array has at least one element (it should never have more than 1)
            if (dataArray.length > 0) {
                // Access the ID of the first element
                this.defaultCollectionId = dataArray[0]['id'];
                this.organizationId = dataArray[0]['organizationId'];
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    /**
     * Search the vault for an entry that contains the entered location
     * @param info
     */
    async searchVault(info: any): Promise<void> {
        this.runBitwardenCommand(`bw list items --search ${info.location} --session ${this.sessionKey}`).then((output) => {
            //console.log('Bitwarden CLI Output:', output);

            this.mainWindow.webContents.send('backend_message', {
                channelType: 'search_results',
                data: output
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    /**
     * Read the default collection within bitwarden.
     */
    async readVault(): Promise<void> {
        this.runBitwardenCommand(`bw list items --collectionid ${this.defaultCollectionId} --session ${this.sessionKey}`).then((output) => {
            //console.log('Bitwarden CLI Output:', output);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }


    /**
     * Logout and lock the current sessions vault, invalidating the session key that was generated from the previous login.
     */
    async attemptLogout(): Promise<void> {
        this.runBitwardenCommand(`bw logout`).then((output) => {
            if (output.includes(loggedOut)) {
                this.mainWindow.webContents.send('backend_message', {
                    channelType: 'password_log_out'
                });
            } else {
                //console.log('Bitwarden CLI Output:', output);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    /**
     * A generic exec command wrapped in a promised designed to execute a command line code and then return the results.
     * Either the returned message or an error.
     * @param command
     */
    async runBitwardenCommand(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const childProcess = spawn(command, {
                shell: true,
                stdio: ['pipe', 'pipe', 'pipe'], // This enables capturing stdout, stderr, and stdin
            });

            let stdoutData = '';
            let stderrData = '';

            // Listen for data events
            childProcess.stdout.on('data', (data) => {
                stdoutData += data.toString();
                console.log(data.toString());
                // If it includes 'Two-step login code:' exit the process as it requires a prompt
                if (data.toString().includes(twoStep)) {
                    // Terminate the process if the exit string is found
                    kill(childProcess.pid);
                }
            });

            childProcess.stderr.on('data', (data) => {
                stderrData += data.toString();
                console.log(data.toString());
                // If it includes 'Two-step login code:' exit the process as it requires a prompt
                if (data.toString().includes(twoStep)) {
                    // Terminate the process if the exit string is found
                    kill(childProcess.pid);
                }
            });

            // Listen for the close event when the process ends
            childProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(stderrData);
                } else {
                    resolve(stdoutData);
                }
            });

            // Listen for the error event in case the process fails to start
            childProcess.on('error', (error) => {
                reject(error.message);
            });
        });
    }
};
