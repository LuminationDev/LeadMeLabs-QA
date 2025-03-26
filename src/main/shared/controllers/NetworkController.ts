import {IpcMain, BrowserWindow, app} from "electron";
import { GetIPAddress } from "../network/Network";
import {
    checkWebsiteAvailability,
    downloadAndCalculateSpeed,
    checkInternetConnection, pingIpAddress
} from "../network/Network";
import { DetermineReportType } from "../report/Report";
import { join } from "path";
import fs from "fs";
import * as CONSTANTS from "../constants";
const { exec } = require('child_process')
const network = require('network')
var net = require('net');

export default class NetworkController {
    ipcMain: IpcMain;
    mainWindow: BrowserWindow;
    constructor(ipcMain: IpcMain, mainWindow: BrowserWindow) {
        this.ipcMain = ipcMain;
        this.mainWindow = mainWindow;
    }

    /**
     * Initiate the config tool listener, each function uses a different channel handle to respond to
     * different events that the frontend requires.
     */
    startup(): void {
        this.networkToolListenerDelegate();
    }

    /**
     * Create a listener that will delegate actions between the network tool functions depending on what channel type has
     * been sent. This allows just one listener to be active rather than individual function ones.
     */
    networkToolListenerDelegate(): void {
        this.ipcMain.on('network_function', async (_event, info) => {
            switch (info.channelType) {

                case "internet_online":
                    this.isInternetAvailable(info);
                    break;

                case "steam_api":
                    void this.checkSteamApi(info);
                    break;

                case "website_ping":
                    this.checkWebsiteAccess(info);
                    break;

                case "speed_test":
                    this.speedTest(info);
                    break;

                case "attempt_device_connection":
                    this.attemptToConnectDevice(info);
                    break;

                case "generate_report":
                    const details = await DetermineReportType(info, this.mainWindow);

                    if (details !== undefined && details !== null) {
                        this.mainWindow.webContents.send('backend_message', {
                            channelType: details['message'],
                            data: details['data'],
                        });
                    }
                    break;

                case "port_check":
                    void this.portTest(info);
                    break;
                
                case "is_port_check_initialised":
                    void this.checkPortCheck();
                    break;
                
                case "build_port_check":
                    void this.buildPortCheck();
                    break;
                
                case "teardown_port_check":
                    void this.teardownPortCheck();
                    break;

                default:
                    console.log(`Unknown network tool call: ${JSON.stringify(info)}`)
                    break;
            }
        });
    }

    isInternetAvailable(info: any) {
        checkInternetConnection().then(([passedStatus, message]) => {
            this.mainWindow.webContents.send('backend_message', {
                channelType: "internet_result",
                section: "Network",
                id: info.id,
                passedStatus,
                message
            });
        })
    }

    checkWebsiteAccess(info: any): void {
        checkWebsiteAvailability(info).then(([passedStatus, message]) => {
            this.mainWindow.webContents.send('backend_message', {
                channelType: "website_result",
                section: "Firewall",
                id: info.id,
                passedStatus,
                message
            });
        });
    }

    async speedTest(info: any): Promise<void> {
        downloadAndCalculateSpeed(this.mainWindow).then(([passedStatus, message]) => {
            this.mainWindow.webContents.send('backend_message', {
                channelType: "speed_test_result",
                section: "Speed Test",
                id: info.id,
                passedStatus,
                message: message
            });
        });
    }

    attemptToConnectDevice(info: any) {
        pingIpAddress(info).then(([passedStatus, message]) => {
            this.mainWindow.webContents.send('backend_message', {
                channelType: "attempt_device_connection",
                section: "Ping",
                id: info.id,
                passedStatus,
                message
            });
        });
    }

    async runRouteCommand(addOrDelete: boolean) {
        network.get_gateway_ip((error, gateway) => {
            const ipAddress = GetIPAddress()
            return new Promise(async (resolve, reject) => {
                if (error) {
                    reject(new Error("Could not create rule"))
                }
                exec(`Start-Process cmd -Verb RunAs -ArgumentList '@cmd /c route ${addOrDelete ? 'add' : 'delete'} ${ipAddress} MASK 255.255.255.255 ${gateway}'`, {'shell':'powershell.exe'}, (err, stdout)=> {
                    if (err) {
                        reject(new Error("Could not create rule"))
                    }
                    resolve('success')
                });
            })
        })
    }

    async checkRouteExists() {
        network.get_gateway_ip((error, gateway) => {
            const ipAddress = GetIPAddress()
            return new Promise(async (resolve, reject) => {
                if (error) {
                    reject(new Error("Could not create rule"))
                }
                exec(`route print ${ipAddress} MASK 255.255.255.255 ${gateway} | grep ${ipAddress}`, (err, stdout)=> {
                    console.log('err', err, 'gateway', gateway)
                    if (err) {
                        reject(new Error("Could not run command"))
                    }
                    console.log('stdout', stdout)
                    if (stdout.length > 0) {
                        resolve('success')
                    } else {
                        reject(new Error("Could not find rule"))
                    }
                });
            })
        })
    }

    async checkPortCheck() {
        await this.checkRouteExists().catch((error) => {
            this.mainWindow.webContents.send('backend_message', {
                channelType: "is_port_check_initialised",
                result: false
            });
        })
        this.mainWindow.webContents.send('backend_message', {
            channelType: "is_port_check_initialised",
            result: true
        });
    }

    async buildPortCheck() {
        if (!process.platform.includes("win")) {
            this.mainWindow.webContents.send('backend_message', {
                channelType: "build_port_check",
                result: false
            });
            return;
        }
        await this.runRouteCommand(true).catch((error) => {
            this.mainWindow.webContents.send('backend_message', {
                channelType: "build_port_check",
                result: false
            });
        })
        this.mainWindow.webContents.send('backend_message', {
            channelType: "build_port_check",
            result: true
        });
    }

    async teardownPortCheck() {
        if (!process.platform.includes("win")) {
            this.mainWindow.webContents.send('backend_message', {
                channelType: "teardown_port_check",
                result: false
            });
            return;
        }
        await this.runRouteCommand(false).catch((error) => {
            this.mainWindow.webContents.send('backend_message', {
                channelType: "teardown_port_check",
                result: false
            });
        })
        this.mainWindow.webContents.send('backend_message', {
            channelType: "teardown_port_check",
            result: true
        });
    }

    async portTest(info: any): Promise<void> {
        var caught = false
        await this.checkRouteExists().catch(() => {
            caught = true;
            this.mainWindow.webContents.send('backend_message', {
                channelType: "port_result",
                section: "Ports",
                id: info.id,
                passedStatus: "warning",
                message: "Loopback not created"
            });
        })
        if (caught) {
            return;
        }

        if (!process.platform.includes("win")) {
            this.mainWindow.webContents.send('backend_message', {
                channelType: "port_result",
                section: "Ports",
                id: info.id,
                passedStatus: "warning",
                message: "Port check requires Windows"
            });
            return;
        }

        const port = info.value

        var server = net.createServer();
        var resolved = false;

        server.on('connection', async (result) => {
            resolved = true
            this.mainWindow.webContents.send('backend_message', {
                channelType: "port_result",
                section: "Ports",
                id: info.id,
                passedStatus: "passed",
                message: "Success"
            });
            server.close()
        });

        server.listen(port, function() {
            var client = new net.Socket();
            const ipAddress = GetIPAddress()
            client.connect(port, ipAddress, function() {});
        });

        setTimeout(() => {
            if (!resolved) {
                server.close()
                this.mainWindow.webContents.send('backend_message', {
                    channelType: "port_result",
                    section: "Ports",
                    id: info.id,
                    passedStatus: "failed",
                    message: "Could not connect over port"
                });
            }
        }, 5000)
    }

    /**
     * Use the LeadMePython executable to check if the api.steampowered.com endpoint can be reached.
     * @param info
     */
    checkSteamApi(info: any): void {
        let passed = false;
        void this.extractAndRunExecutable(CONSTANTS.TOOL.LEADME_PYTHON, ['network_check'], (error: any, stdout: string, stderr: string) => {
            if (error) {
                this.mainWindow.webContents.send('backend_message', {
                    error: error.message
                });
                console.error(`Error: ${error.message}`);
                passed = false;
            }

            if (stderr) {
                this.mainWindow.webContents.send('backend_message', {
                    error: stderr
                });
                console.error(`Stderr: ${stderr}`);
                passed = false;
            }

            if (stdout) {
                console.log(`Stdout: ${stdout}`);
                passed = stdout.trim() === "Connection available";
            }

            this.mainWindow.webContents.send('backend_message', {
                channelType: "steam_api",
                section: "Steam",
                id: info.id,
                passedStatus: passed ? "passed" : "failed",
                message: passed ? "Can access" : "Access blocked"
            });
        });
    }

    /**
     * Extracts and runs the specified executable file.
     * If in development mode, executes the executable directly.
     * If in production mode, extracts the executable if not already extracted, then executes it.
     * @param {string} executableName - The name of the executable file.
     * @param {string[]} args - An array of arguments to pass to the executable.
     * @param {Function} callback - Optional callback function to handle the result of execution.
     */
    async extractAndRunExecutable(executableName: string, args: string[], callback: Function) {
        try {
            let command: string;

            if (process.env.NODE_ENV === 'development') {
                const executablePath = join(app.getAppPath(), '../', 'static', executableName);
                command = `"${executablePath}" ${args.join(' ')}`;

            } else {
                const executablePath = join(app.getAppPath(), 'static', executableName);
                const tempDir = join(app.getAppPath(), '../');
                const tempExecutablePath = join(tempDir, executableName);

                if (!fs.existsSync(tempExecutablePath)) {
                    this.copyFile(executablePath, tempExecutablePath);
                    this.makeExecutable(tempExecutablePath);
                }

                command = `"${tempExecutablePath}" ${args.join(' ')}`;
            }

            const { stdout, stderr } = await this.executeCommand(command);
            if (callback) callback(null, stdout, stderr);
        } catch (error: any) {
            if (callback) callback(error);
        }
    }

    /**
     * Copies a file from the source path to the destination path.
     * @param {string} source - The path of the source file.
     * @param {string} destination - The path of the destination file.
     */
    copyFile(source: string, destination: string) {
        const data = fs.readFileSync(source);
        fs.writeFileSync(destination, data);
    }

    /**
     * Makes a file executable by changing its permissions.
     * @param {string} filePath - The path of the file to make executable.
     */
    makeExecutable(filePath: string) {
        fs.chmodSync(filePath, 0o755);
    }

    /**
     * Executes a shell command and returns a Promise that resolves with the stdout and stderr of the command.
     * @param {string} command - The shell command to execute.
     * @returns {Promise<{stdout: string, stderr: string}>} - A Promise that resolves with the stdout and stderr of the command.
     */
    executeCommand(command: string): Promise<any> {
        return new Promise((resolve, reject) => {
            exec(command, (error: any, stdout: string, stderr: string) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({ stdout, stderr });
                }
            });
        });
    }
}
