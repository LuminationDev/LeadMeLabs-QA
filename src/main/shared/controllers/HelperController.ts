import {IpcMain, BrowserWindow, app, dialog} from "electron";
import Encryption from "../encryption/Encryption";
import os from "os";
import {GetIPAddress} from "../network/Network";
import fs from 'fs'

export default class HelperController {
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
        this.helperListeners();
    }

    /**
     * Create a listener that will delegate actions between the network tool functions depending on what channel type has
     * been sent. This allows just one listener to be active rather than individual function ones.
     */
    helperListeners(): void {
        this.ipcMain.handle('get-appdata-path', () => {
            return app.getPath('appData');
        });

        this.ipcMain.handle('save-simple-qa', async (event, { data }) => {
            const { filePath } = await dialog.showSaveDialog({
                title: 'Save File',
                filters: [{ name: 'Json Files', extensions: ['json'] }],
            });
            if (!filePath) {
                return;
            }
            fs.writeFileSync(filePath, data);
            return;
        });

        this.ipcMain.handle('get-station-or-nuc-config', async () => {
            const appDataPath = app.getPath('appData')

            const stationConfig = await Encryption.detectFileEncryption(appDataPath + '\\leadme_apps\\Station\\_config\\config.env')
            if (stationConfig) return stationConfig
            let nucConfig = await Encryption.detectFileEncryption(appDataPath + '\\leadme_apps\\NUC\\_config\\config.env')
            if (nucConfig) {
                nucConfig += ('NucAddress=' + GetIPAddress())
                return nucConfig
            }
            return null
        });
    }
}
