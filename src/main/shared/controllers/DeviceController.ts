import { IpcMain, BrowserWindow } from "electron";
import wol from 'wake_on_lan';

interface MacAddress {
    mac: string;
}

export default class DeviceController {
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
        this.deviceListenerDelegate();
    }

    /**
     * Create a listener that will delegate actions between the network tool functions depending on what channel type has
     * been sent. This allows just one listener to be active rather than individual function ones.
     */
    deviceListenerDelegate(): void {
        this.ipcMain.on('device_function', async (_event, info) => {
            switch (info.channelType) {

                case "wake_on_lan":
                    this.wakeOnLan(info.macAddresses);
                    break;

                default:
                    console.log(`Unknown device tool call: ${JSON.stringify(info)}`)
                    break;
            }
        });
    }

    wakeOnLan(macAddresses: MacAddress[]): void {
        macAddresses.forEach(({mac}) => {
            wol.wake(mac, function(error) {
                if (error) {
                    // handle error
                    console.log(error);
                } else {
                    // done sending packets
                    console.log("PACKETS SENT: " + mac);
                }
            });
        });
    }
}
