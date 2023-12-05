import { IpcMain, BrowserWindow } from "electron";
import {checkWebsiteAvailability, CheckOpenPort, downloadAndCalculateSpeed, GetIPAddress} from "../network/Network";
const { exec } = require('child_process')
const defaultGateway = require('default-gateway')
var net = require('net');
import {
    checkWebsiteAvailability,
    downloadAndCalculateSpeed,
    checkInternetConnection
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
            console.log(info);

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

                case "port_test":
                    void this.portTest(info);
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

    async runRouteCommand(addOrDelete: boolean) {
        const {gateway, int} = await defaultGateway.v4();
        const ipAddress = GetIPAddress()
        return new Promise(async (resolve, reject) => {
            exec(`Start-Process cmd -Verb RunAs -ArgumentList '@cmd /k route ${addOrDelete ? 'add' : 'delete'} ${ipAddress} MASK 255.255.255.255 ${gateway}'`, {'shell':'powershell.exe'}, (err, stdout)=> {
                if (err) {
                    reject(new Error("Could not create rule"))
                }
                resolve('success')
            });
        })
    }

    async checkRouteExists() {
        const {gateway, int} = await defaultGateway.v4();
        const ipAddress = GetIPAddress()
        return new Promise(async (resolve, reject) => {
            exec(`route print ${ipAddress} MASK 255.255.255.255 ${gateway} | grep ${ipAddress}`, (err, stdout)=> {
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
    }

    async buildPortCheck() {
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
        await this.checkRouteExists().catch(() => {
            this.mainWindow.webContents.send('backend_message', {
                channelType: "port_result",
                port,
                result: "warning",
                message: "Could not configure testing route"
            });
        })
        const port = info.port

        var server = net.createServer();
        var resolved = false;

        server.on('connection', async (result) => {
            resolved = true
            this.mainWindow.webContents.send('backend_message', {
                channelType: "port_result",
                port,
                result: "success",
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
                    port,
                    result: "failure",
                    message: "Could not connect over port"
                });
            }
        }, 5000)
    }
}
