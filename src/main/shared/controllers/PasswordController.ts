import { BrowserWindow, IpcMain } from "electron";

export default class PasswordController {
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
        this.passwordToolListenerDelegate();
    }

    /**
     * Create a listener that will delegate actions between the password tool functions depending on what channel type has
     * been sent. This allows just one listener to be active rather than individual function ones.
     */
    passwordToolListenerDelegate(): void {
        this.ipcMain.on('network_function', async (_event, info) => {
            switch (info.channelType) {

                default:
                    console.log(info);
                    break;
            }
        });
    }
};
