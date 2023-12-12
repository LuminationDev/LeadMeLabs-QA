import { IpcMain, BrowserWindow } from "electron";
import { GetIPAddress } from "../network/Network";
const { exec } = require('child_process')
const network = require('network')
var net = require('net');
import {
    checkWebsiteAvailability,
    downloadAndCalculateSpeed,
    checkInternetConnection, pingIpAddress
} from "../network/Network";
import { DetermineReportType } from "../report/Report";

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

                case "website_ping":
                    this.checkWebsiteAccess(info);
                    break;

                case "speed_test":
                    void this.speedTest(info);
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
                exec(`Start-Process cmd -Verb RunAs -ArgumentList '@cmd /k route ${addOrDelete ? 'add' : 'delete'} ${ipAddress} MASK 255.255.255.255 ${gateway}'`, {'shell':'powershell.exe'}, (err, stdout)=> {
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
}
