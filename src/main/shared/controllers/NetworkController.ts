import { IpcMain, BrowserWindow } from "electron";
import {
    checkWebsiteAvailability,
    downloadAndCalculateSpeed,
    checkInternetConnection, pingIpAddress
} from "../network/Network";

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
        this.ipcMain.on('network_function', (_event, info) => {
            switch (info.channelType) {

                case "internet_online":
                    this.isInternetAvailable(info);
                    break;

                case "website_ping":
                    this.checkWebsiteAccess(info);
                    break;

                case "check_port":
                    console.log("Nothing to see here yet");
                    break;

                case "speed_test":
                    void this.speedTest(info);
                    break;

                case "attempt_device_connection":
                    this.attemptToConnectDevice(info);
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
}
