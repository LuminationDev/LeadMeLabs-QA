import net from "net";
import os from 'os';
import axios, { AxiosError } from "axios";
import now from "performance-now";
import {BrowserWindow} from "electron";

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
 * Downloads data from the specified URL, measures the elapsed time,
 * and calculates the download speed in megabits per second.
 * @param {string} mainWindow - The electron main window reference used to send back download information.
 * @returns {Promise<number|null>} - A Promise that resolves to the download speed
 *                                   in megabits per second, or null if the download fails.
 */
export async function downloadAndCalculateSpeed(mainWindow: BrowserWindow): Promise<string|null> {
    const url = "https://learninglablauncherdevelopment.herokuapp.com/program-nuc";

    let started = false;
    let startTime: number|undefined = undefined;

    try {
        const response = await axios({
            method: 'get',
            url,
            responseType: 'arraybuffer',
            onDownloadProgress: (progressEvent) => {
                if (!started) {
                    started = true;
                    startTime = now();
                }

                const { loaded, total } = progressEvent;

                // Calculate progress percentage
                if (total == undefined) return;
                const progress = (loaded / total) * 100;

                // Log or update UI with the progress information
                console.log(`Download progress: ${progress.toFixed(2)}%`);

                mainWindow.webContents.send('backend_message', {
                    channelType: "speed_test_progress",
                    progress: progress.toFixed(2)
                });

                // Calculate the file size in megabytes
                const fileSizeInMB = total / (1024 * 1024);

                // Calculate the download speed in megabits per second
                const downloadTime = (now() - startTime!) / 1000;
                const speedMbps = (loaded * 8 / downloadTime) / 1000000;

                // Log or update UI with download speed and file size information
                console.log(`Download speed: ${speedMbps.toFixed(2)} Mbps | File size: ${fileSizeInMB.toFixed(2)} MB`);
            },
        });

        if (startTime === undefined) {
            console.log("Start time not defined");
            return null;
        }

        const data = response.data;

        const endTime = now();
        const downloadTime = (endTime - startTime) / 1000; // Convert to seconds

        const fileSizeInBits = data.length * 8; // Convert to bits
        const speedMbps = (fileSizeInBits / downloadTime) / 1000000; // Convert to megabits per second

        console.log(`Download speed: ${speedMbps.toFixed(2)} Mbps`);

        return speedMbps.toFixed(2);
    } catch (error: any) {
        console.error(`Error downloading data: ${error.message}`);
        return null;
    }
}

/**
 * Checks the availability of a website by making a GET request with a 10-second timeout.
 * @param info - An object that contains the URL of the website to be checked.
 * @returns A Promise that resolves to a string indicating the result:
 *   - 'success' if the website is reachable with a 200 status code.
 *   - 'failed with status code [code]' if the website is reachable but responds with an error code.
 *   - 'timeout' if the request times out after 10 seconds.
 *   - 'failed with error: [error message]' if an error occurs during the request.
 */
export async function checkWebsiteAvailability(info: any): Promise<[string, string]> {
    const url = info.url;

    try {
        const response = await axios.get(url, { timeout: 10000, validateStatus: null }); // Disable axios's default status validation
        if (response.status === 200) {
            return ['passed', ''];
        } else {
            // If the request is not successful, return the HTTP error code
            return ['failed', `Status code ${response.status}`];
        }
    } catch (error: any) {
        // If there's an error, check if it's a timeout error
        if (axios.isAxiosError(error) && (error as AxiosError).code === 'ECONNABORTED') {
            return ['timeout', ''];
        } else {
            // If it's not a timeout error, return the error message
            return ['failed', `ERROR: ${error.message}`];
        }
    }
}

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
