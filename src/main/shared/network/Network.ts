import os from 'os';
import axios, { AxiosError } from "axios";
import now from "performance-now";
import { BrowserWindow } from "electron";
import ping from "ping";

const networkInterfaces = os.networkInterfaces();

/**
 * Checks the internet connection by attempting to make a GET request to 'http://www.google.com'.
 * @returns A Promise resolving to a tuple containing two strings:
 *   - The first string represents the result status: "passed" if the connection is successful, "failed" otherwise.
 *   - The second string provides a descriptive message: "Connected" if the connection is successful, "Disconnected" otherwise.
 */
export async function checkInternetConnection(): Promise<[string, string]> {
    try {
        await axios.get('http://www.google.com');
        return ["passed", "Connected"];
    } catch (error) {
        return ["failed", "Disconnected"];
    }
}

/**
 * Downloads data from the specified URL, measures the elapsed time,
 * and calculates the download speed in megabits per second.
 * @param {string} mainWindow - The electron main window reference used to send back download information.
 * @returns {Promise<number|null>} - A Promise that resolves to the download speed
 *                                   in megabits per second, or null if the download fails.
 */
export async function downloadAndCalculateSpeed(mainWindow: BrowserWindow): Promise<[string, string]> {
    const url = "https://leadme-internal.sgp1.vultrobjects.com/NUC/NUC.zip";

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
            return ["failed", "Internal error, try again."];
        }

        const data = response.data;

        const endTime = now();
        const downloadTime = (endTime - startTime) / 1000; // Convert to seconds

        const fileSizeInBits = data.length * 8; // Convert to bits
        const speedMbps = (fileSizeInBits / downloadTime) / 1000000; // Convert to megabits per second

        console.log(`Download speed: ${speedMbps.toFixed(2)} Mbps`);

        return ["passed", `${speedMbps.toFixed(2)} Mbps`];
    } catch (error: any) {
        console.error(`Error downloading data: ${error.message}`);
        return ["failed", error.message];
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
    const url = info.value;

    try {
        const response = await axios.get(url, { timeout: 10000, validateStatus: null }); // Disable axios's default status validation
        if (response.status === 200) {
            return ['passed', 'Open'];
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
 * Asynchronously checks the reachability of a specified IP address using ICMP ping.
 *
 * @param info - An object containing information about the IP address to ping.
 *               The IP address should be specified in the 'value' property.
 * @returns A Promise resolving to an array with the ping result and an optional message.
 *          - If the IP address is reachable, the result is 'passed'.
 *          - If the IP address is unreachable, the result is 'failed'.
 *          - The second element of the array may contain additional information or be an empty string.
 * @throws If an error occurs during the ping operation, the Promise is rejected with an error message.
 */
export async function pingIpAddress(info: any): Promise<[string, string]> {
    const ipAddress = info.value;

    try {
        return new Promise((resolve) => {
            ping.sys.probe(ipAddress, function (isAlive: boolean) {
                resolve([isAlive ? 'passed' : 'failed', '']);
            });
        });
    } catch (error: any) {
        return ['failed', error.message];
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
