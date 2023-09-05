import TcpServer from './tcp/TcpServer';
import TcpClient from './tcp/TcpClient';
import { CheckOpenPort } from "./util/Network";

/**
 * A class that initiates electron IPC controls that handle application downloads, extractions, configurations
 * and launching.
 */
export default class Helpers {
    ipcMain: Electron.IpcMain;
    mainWindow: Electron.BrowserWindow;
    tcpServer: TcpServer;

    constructor(ipcMain: Electron.IpcMain, mainWindow: Electron.BrowserWindow) {
        this.ipcMain = ipcMain;
        this.mainWindow = mainWindow;
        this.tcpServer = new TcpServer(ipcMain, this.mainWindow);
    }

    /**
     * Initiate the helper listener, each function uses a different channel handle to respond to
     * different events that the frontend requires.
     */
    startup(): void {
        this.helperListenerDelegate();
    }

    /**
     * Create a listeners that will delegate actions between the helper functions depending on what channel type has
     * been sent. This allows just one listener to be active rather than individual function ones.
     */
    helperListenerDelegate(): void {
        this.ipcMain.on('helper_function', (_event, info) => {
            switch(info.channelType) {
                case "tcp_server_command":
                    this.tcpServer.handleCommand(info)
                    break;

                case "tcp_client_message":
                    new TcpClient(this.mainWindow, info);
                    break;

                case "network_port_settings":
                    void CheckOpenPort(this.ipcMain, this.mainWindow, info);
                    break;

                default:
                    console.log(`Unknown helper call: ${JSON.stringify(info)}`)
                    break;
            }
        });
    }
}
