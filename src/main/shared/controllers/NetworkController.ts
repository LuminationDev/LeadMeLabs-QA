import { IpcMain, BrowserWindow } from "electron";
import { checkWebsiteAvailability, CheckOpenPort, downloadAndCalculateSpeed } from "../network/Network";

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

                case "website_ping":
                    this.checkWebsiteAccess(info);
                    break;

                case "network_port_settings":
                    void CheckOpenPort(this.mainWindow, info);
                    break;

                case "speed_test":
                    void this.speedTest(info);
                    break;

                default:
                    console.log(`Unknown network tool call: ${JSON.stringify(info)}`)
                    break;
            }
        });
    }

    checkWebsiteAccess(info: any): void {
        checkWebsiteAvailability(info).then(([passedStatus, message]) => {
            this.mainWindow.webContents.send('backend_message', {
                channelType: "website_result",
                name: info.name,
                passedStatus,
                message
            });
        });
    }

    async speedTest(info: any): Promise<void> {
        const result = await downloadAndCalculateSpeed(this.mainWindow);

        this.mainWindow.webContents.send('backend_message', {
            channelType: "speed_test_result",
            speed: result,
        });
    }
}
