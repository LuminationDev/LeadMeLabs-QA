import { app, BrowserWindow, ipcMain, session, shell } from "electron";
import { join } from "path";
import { autoUpdater, UpdateCheckResult } from "electron-updater";
import { GetIPAddress } from "../network/Network";
import { optimizer } from "@electron-toolkit/utils";
import * as CONSTANT from "../constants";
import ConfigController from "../controllers/ConfigController";
import QAController from "../controllers/QAController";
import NetworkController from "../controllers/NetworkController";
import PasswordController from "../controllers/PasswordController";

let applicationType: string;
let downloadWindow: BrowserWindow;
export let mainWindow: BrowserWindow;

/**
 * Check the lock instance for another open app and attached the auto updater processes.
 * @param application A string of the tool being initialised.
 */
export function InitialiseApplication(application: string): void {
    applicationType = application;

    checkLock();
    attachUpdater();

    whenReady();
}

/**
 * Request the application be a single instance. If there is another attempt to open it the original instance will be
 * focused instead.
 */
function checkLock(): void {
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
        // If another instance of the app is already running, quit the current instance.
        app.quit();
    }
    else {
        // Create the main window of your application
        app.on('second-instance', () => {
            // When a second instance is detected, bring the existing instance to the front
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore();
                mainWindow.show(); //Open from icon tray
                mainWindow.focus(); //Bring to front of programs
            }
        });
    }
}

// TODO need a new hosting site for the separate tools
/**
 * Based on the tool that is being used return the corresponding feed url for updating.
 */
function determineApplicationFeed(): string {
    switch (applicationType) {
        case CONSTANT.TOOL.FULL_TOOL:
            return 'http://leadme-qa-tool-85e3c7ba88eb.herokuapp.com/static/';

        case CONSTANT.TOOL.QA_TOOL:
            return 'http://leadme-qa-tool-85e3c7ba88eb.herokuapp.com/static/';

        case CONSTANT.TOOL.NETWORK_TOOL:
            return 'https://leadme-network-tool-f81e92d61350.herokuapp.com/static/';

        case CONSTANT.TOOL.PASSWORD_TOOL:
            return '';

        case CONSTANT.TOOL.EXPERIENCE_TOOL:
            return '';

        case CONSTANT.TOOL.SETUP_TOOL:
            return 'https://leadme-qa-tool.herokuapp.com/static/';

        default:
            return '';
    }
}

/**
 * Attach the auto updater to the program depending on what application type is being used.
 */
function attachUpdater(): void {
    let url = determineApplicationFeed();
    if (url === "") return;

    autoUpdater.autoDownload = true;
    autoUpdater.setFeedURL({
        provider: 'generic',
        url
    });

    // Listen for update download progress events
    autoUpdater.on('update-downloaded', () => {
        if(mainWindow) {
            mainWindow.webContents.send('backend_message', {
                channelType: "update_ready",
                name: "UPDATE DOWNLOADED, close any open applications"
            });
        }

        if(downloadWindow) {
            //Setting progress above 1 turns the bar into an indeterminate loading bar while waiting for restart
            downloadWindow.setProgressBar(2);
        }

        //Wait for any open applications to close
        setTimeout(() => {
            const isSilent = true
            const isForceRunAfter = true
            autoUpdater.quitAndInstall(isSilent, isForceRunAfter)
        }, 4000);
    });

    autoUpdater.on('download-progress', (progressObj) => {
        if(!downloadWindow) {
            createDownloadWindow();
        }

        // Calculate download progress percentage
        const progress = Math.floor(progressObj.percent)/100;

        if(downloadWindow) {
            downloadWindow.webContents.executeJavaScript(`
                try {
                    const dynamicTextElement = document.getElementById('update-message');
                    dynamicTextElement.innerText = 'Downloading update, ${(progressObj.percent).toFixed(2)} %';
                } catch (error) {
                    console.error('Error in executeJavaScript:', error);
                }
            `);
            downloadWindow.setProgressBar(progress);
        }

        if(mainWindow) {
            mainWindow.webContents.send('backend_message', {
                channelType: "update_downloading",
                progress
            });
        }
    });
}

/**
 * Create a basic browser window to show the user that the application is updating.
 */
function createDownloadWindow(): void {
    downloadWindow = new BrowserWindow({
        width: 400,
        height: 150,
        show: false,
        resizable: false,
        webPreferences: {
            preload: join(__dirname, '..', 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    downloadWindow.setMenu(null);

    downloadWindow.on('ready-to-show', () => {
        downloadWindow.show();
    });

    downloadWindow.webContents.setWindowOpenHandler((details) => {
        console.log('inside set window open handler')
        void shell.openExternal(details.url)
        return { action: 'deny' }
    });

    downloadWindow.loadFile(join(app.getAppPath(), 'static', 'download.html'));
}

/**
 * Create the main window for the application.
 */
export function createWindow(): void {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        show: true,
        webPreferences: {
            preload: join(__dirname, '../..', 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        }
    });

    // Show the main window and check for application updates
    mainWindow.on('ready-to-show', () => {
        if (process.env.NODE_ENV === 'development') {
            mainWindow.webContents.openDevTools();
        }

        // Send through the current version number
        void sendApplicationDetails();

        if (process.env.NODE_ENV !== 'development') {
            autoUpdater.checkForUpdates().then((result) => {
                updateCheck(result);
            }).catch(handleUpdateCheckError);
        }
    });

    mainWindow.webContents.setWindowOpenHandler((details) => {
        console.log('inside set window open handler')
        void shell.openExternal(details.url)
        return { action: 'deny' }
    });

    if (process.env.NODE_ENV === 'development') {
        const rendererPort = process.argv[2];
        mainWindow.loadURL(`http://localhost:${rendererPort}`);
    }
    else {
        mainWindow.loadFile(join(app.getAppPath(), 'renderer', 'index.html'));
    }

    mainWindow.setMenu(null);
}

/**
 * If retrieving the Live update does not work attempt to contact the offline installer
 * server.
 * @param error An object that details what has gone wrong in the connection process.
 */
async function handleUpdateCheckError(error): Promise<void> {
    mainWindow.webContents.send('backend_message', {
        channelType: "update_check",
        data: error
    });
}

/**
 * Check the result of the autoUpdate feed and fall back to the offline one if the
 * original FeedUrl does not work.
 * @param result
 */
function updateCheck(result: UpdateCheckResult|null): void {
    if (result === null) {
        mainWindow.webContents.send('backend_message', {
            channelType: "update_check",
            data: "RESULT NULL"
        });

        return;
    }

    mainWindow.webContents.send('backend_message', {
        channelType: "update_check",
        data: result,
        hosting: "Hosting version: " + result.updateInfo.version,
        version: "Current version: " + app.getVersion()
    });
}

/**
 * Collect details about the launcher to display on the frontend.
 */
async function sendApplicationDetails(): Promise<void> {
    // Send through the current version number
    mainWindow.webContents.send('backend_message', {
        channelType: "application_settings",
        version: app.getVersion(),
        ipAddress: GetIPAddress()
    });
}

/**
 * Loads controllers based on the application type.
 */
function loadControllers(): void {
    switch (applicationType) {
        case "FullTool":
            new QAController(ipcMain, mainWindow).startup();
            new NetworkController(ipcMain, mainWindow).startup();
            new ConfigController(ipcMain, mainWindow).startup();
            new PasswordController(ipcMain, mainWindow).startup();
            break;

        case "QaTool":
            new QAController(ipcMain, mainWindow).startup();
            break;

        case "NetworkTool":
            new NetworkController(ipcMain, mainWindow).startup();
            break;

        case "PasswordTool":
            new PasswordController(ipcMain, mainWindow).startup();
            break;

        case "ExperienceTool":
            new ConfigController(ipcMain, mainWindow).startup();
            break;

        case "SetupTool":
            new QAController(ipcMain, mainWindow).startup();
            break;

        default:
            // No specific action for other application types
            break;
    }
}

/**
 * Performs necessary setup tasks when the Electron application is ready.
 * - Ignores certificate errors.
 * - Installs developer tools in development mode.
 * - Listens for shortcut key presses to toggle developer tools.
 * - Creates the main application window.
 * - Loads required controllers for the application.
 * - Sets Content Security Policy (CSP) headers to allow scripts from specific sources.
 * - Handles window activation event by recreating the window if necessary.
 * - Handles window-all-closed event to quit the application when all windows are closed (except on macOS).
 */
function whenReady(): void {
    /**
     * Ignore certificate errors.
     */
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    app.whenReady().then(async () => {
        if (process.env.NODE_ENV && process.env.NODE_ENV === 'development') {
            const installDevtools = await import('../../installDevtools')
            await installDevtools.install()
        }

        //Allow dev tools to toggle on F12
        app.on('browser-window-created', (_, window) => {
            optimizer.watchWindowShortcuts(window)
        });

        createWindow();

        console.log("Starting electron application");

        //Load in the required controllers
        loadControllers();

        session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
            callback({
                responseHeaders: {
                    ...details.responseHeaders,
                    'Content-Security-Policy': ['script-src \'self\' https://cdn.tailwindcss.com']
                }
            })
        })

        app.on('activate', function () {
            // On macOS, it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    });

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') app.quit()
    });
}
