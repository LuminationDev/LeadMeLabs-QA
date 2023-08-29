import { exec } from "child_process";
import net from "net";

interface NetworkInfo {
    NetworkInterface: string;
    SubnetMask: string;
    DefaultGateway: string;
    DnsServer: string | null;
    AltDnsServer: string | null;
    PortDetails: string | null;
}

/**
 * Collect the local computer's network settings, sending them to the frontend for visual comparison.
 */
export async function CollectNetworkInformation(ipcMain: Electron.IpcMain, mainWindow: Electron.BrowserWindow) {
    const details = await CollectDetailsAsync();

    // Send to the frontend via Electron.IpcMain
    mainWindow.webContents.send('backend_message', {
        channelType: "network_interface_settings",
        data: details,
    });
}

/**
 * Collects network details, including the network interface, subnet mask,
 * default gateway, primary DNS server, and alternate DNS server information.
 * Executes system commands to retrieve network information and resolves
 * a Promise with the gathered network details.
 * @returns {Promise<NetworkInfo>} A Promise that resolves with the network information.
 */
const CollectDetailsAsync = (): Promise<NetworkInfo> => {
    return new Promise((resolve, reject) => {
        exec('netstat -rn | findstr "0.0.0.0"', (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`stderr: ${stderr}`);
                return;
            }

            const outputLines = stdout.trim().split('\n');
            if (outputLines.length > 0) {
                const parts = outputLines[0].split(/\s+/);
                const gateway = parts[2];
                const ipAddress = parts[3];

                exec('ipconfig /all', (dnsError, dnsStdout) => {
                    if (dnsError) {
                        reject(`Error: ${dnsError.message}`);
                        return;
                    }

                    const dnsMatches = dnsStdout.match(/DNS Servers[^:]*:\s+([\d.]+)/g);
                    const dnsServers = dnsMatches?.map(match => match.split(':')[1].trim());

                    const interfaceDetails = dnsStdout.split('\n\r\n');
                    const interfaceDetail = interfaceDetails.find(detail => detail.includes(ipAddress));
                    const subnetMatch = interfaceDetail?.match(/Subnet Mask[^:]*:\s+([\d.]+)/);
                    const subnetMask = subnetMatch ? subnetMatch[1] : 'Unknown';

                    const networkInfo: NetworkInfo = {
                        NetworkInterface: ipAddress,
                        SubnetMask: subnetMask,
                        DefaultGateway: gateway,
                        DnsServer: null,
                        AltDnsServer: null,
                        PortDetails: null
                    };

                    //Primary DNS
                    if(dnsServers != null && dnsServers.length > 0) {
                        networkInfo.DnsServer = dnsServers[0];
                    }
                    //Alternate DNS
                    if(dnsServers != null && dnsServers.length > 1) {
                        networkInfo.AltDnsServer = dnsServers[1];
                    }

                    resolve(networkInfo);
                });
            }
        });
    });
}

/**
 * Check a destination IP address and port to see if a connection can be established.
 */
export async function CheckOpenPort(ipcMain: Electron.IpcMain, mainWindow: Electron.BrowserWindow, info: any) {
    const details = await CheckPortAsync(info.port, info.address);

    // Send to the frontend via Electron.IpcMain
    mainWindow.webContents.send('backend_message', {
        channelType: "network_port_settings",
        data: details,
    });
}

/**
 * Checks if a specific port is open on the local computer by attempting to establish
 * a connection to the port. Uses a client socket to check the port's availability.
 * @param {number} portToCheck - The port number to check for availability.
 * @param {string} ipAddress - The IP address to check for the port's availability (default: '127.0.0.1').
 * @returns {Promise<string>} A Promise that resolves with the result message.
 */
const CheckPortAsync = async (portToCheck: number, ipAddress: string = '127.0.0.1'): Promise<string> => {
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        client.setTimeout(1000);

        client.on('connect', () => {
            client.destroy();
            resolve(`Port ${portToCheck} is open for address ${ipAddress}`);
        });

        client.on('timeout', () => {
            client.destroy();
            resolve(`Port ${portToCheck} is closed for address ${ipAddress}`);
        });

        client.on('error', (err: NodeJS.ErrnoException) => {
            if (err.code === 'ECONNREFUSED') {
                resolve(`Port ${portToCheck} is closed for address ${ipAddress}`);
            } else {
                reject(`Error: ${err.message}`);
            }
        });

        client.connect(portToCheck, ipAddress);
    });
};
