import TcpServer from '../tcp/TcpServer';
import TcpClient from '../tcp/TcpClient';
import { GetIPAddress } from "../network/Network";
import { app } from "electron";
import { DetermineReportType } from "../report/Report";
import admin from 'firebase-admin';
import { join } from "path";
import fs from "fs";
import * as Sentry from '@sentry/electron'

/**
 * A class that initiates electron IPC controls that handle application downloads, extractions, configurations
 * and launching.
 */
export default class QAController {
    ipcMain: Electron.IpcMain;
    mainWindow: Electron.BrowserWindow;
    tcpServer: TcpServer;

    constructor(ipcMain: Electron.IpcMain, mainWindow: Electron.BrowserWindow) {
        this.ipcMain = ipcMain;
        this.mainWindow = mainWindow;
        this.tcpServer = new TcpServer(ipcMain, this.mainWindow);

        let serviceAccount: string;// | admin.ServiceAccount;
        if (process.env.NODE_ENV === 'development') {
            serviceAccount = fs.readFileSync(join(app.getAppPath(), '..', 'static', 'serviceAccount.json')).toString();
        } else {
            serviceAccount = fs.readFileSync(join(app.getAppPath(), 'static', 'serviceAccount.json')).toString();
        }

        try {
            serviceAccount = JSON.parse(serviceAccount);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                databaseURL: "https://leadme-labs-default-rtdb.asia-southeast1.firebasedatabase.app"
            });
        }
        catch (error) {
            Sentry.captureException(error)
        }
    }

    /**
     * Initiate the helper listener, each function uses a different channel handle to respond to
     * different events that the frontend requires.
     */
    startup(): void {
        this.helperListenerDelegate();
    }

    /**
     * Create a listener that will delegate actions between the helper functions depending on what channel type has
     * been sent. This allows just one listener to be active rather than individual function ones.
     */
    helperListenerDelegate(): void {
        this.ipcMain.on('helper_function', async (_event, info) => {
            switch (info.channelType) {
                case "tcp_server_command":
                    this.tcpServer.handleCommand(info)
                    break;

                case "tcp_client_message":
                    new TcpClient(this.mainWindow, info);
                    break;

                case "refresh_details":
                    this.mainWindow.webContents.send('backend_message', {
                        channelType: "application_settings",
                        version: app.getVersion(),
                        ipAddress: GetIPAddress()
                    });
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

                default:
                    console.log(`Unknown helper call: ${JSON.stringify(info)}`)
                    break;
            }
        });
    }
}
