import net from "net";
import os from 'os';
const networkInterfaces = os.networkInterfaces();

/**
 * Check a destination IP address and port to see if a connection can be established.
 */
export async function CheckOpenPort(mainWindow: Electron.BrowserWindow, info: any) {
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

/**
 * Loop through all network interfaces on the computer and find the first non-internal (external) IPv4 address.
 */
export function GetIPAddress(): string {
    // Iterate through network interfaces to find the IP address
    let ipAddress: string = "";
    for (const interfaceName of Object.keys(networkInterfaces)) {
        const networkInterface = networkInterfaces[interfaceName];
        if(networkInterface === undefined) continue;
        for (const entry of networkInterface) {
            if (!entry.internal && entry.family === 'IPv4') {
                ipAddress = entry.address;
                break;
            }
        }
        if (ipAddress) break;
    }

    if (ipAddress) {
        return ipAddress;
    } else {
        return 'Unable to determine IP address.';
    }
}
