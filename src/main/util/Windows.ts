import { exec } from "child_process";
import * as os from "os";
import axios from "axios";

const wmi = require('node-wmi');
const regedit = require('regedit');
const path = require('path');
const fs = require('fs');

interface WindowsInfo {
    MagicPacket: string;
    AmdInstalled: string;
    OpensslENV: string;
    WallPaper: string;
    SystemTime: string;
    Firewall: {};
}

interface Match {
    RuleName: string
    Profiles: string
    Action: string
}

/**
 * Collect the local computer's network settings, sending them to the frontend for visual comparison.
 */
export async function CollectWindowInformation(ipcMain: Electron.IpcMain, mainWindow: Electron.BrowserWindow) {
    const details = {} as WindowsInfo;
    details.MagicPacket = await CheckMagicPacket();
    details.AmdInstalled = await IsAMDInstalled();
    details.OpensslENV = await CheckENV();
    details.WallPaper = await CheckWallpaper();
    details.SystemTime = await CheckTimeAndDate();
    details.Firewall = await CheckProgramFirewallSettings();

    // Send to the frontend via Electron.IpcMain
    mainWindow.webContents.send('backend_message', {
        channelType: "window_settings",
        data: details,
    });
}

//TODO check with an actual ethernet adapter
const CheckMagicPacket = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        const adapterName = 'Ethernet';
        const query = `SELECT * FROM Win32_NetworkAdapter WHERE NetConnectionID='${adapterName}'`;

        try {
            wmi.Query().class('MSFT_NetAdapter', (err, results) => {
                if (err) {
                    console.error('Error:', err);
                    resolve(`Error: ${err.message}`);
                } else {
                    if (results.length > 0) {
                        const adapter = results[0];
                        console.log('Adapter Advanced Settings:', adapter);
                    } else {
                        console.log('Adapter not found.');
                    }
                }

                resolve("Success");
            });
        } catch (e) {
            console.log(e);
        }
    });
}

/**
 * Checks if AMD Adrenalin is installed on the system.
 * @returns A Promise that resolves to either "Installed" if AMD Adrenalin is installed,
 *          or "Not installed" if it's not found or there's an error during the check.
 */
const IsAMDInstalled = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        const adrenalinSearchKey = 'HKCU\\SOFTWARE\\AMD';
        const adrenalinValueName = 'DisplayName';
        const adrenalinValueExpected = 'AMD Radeon Software';

        regedit.list([adrenalinSearchKey], (err, result) => {
            if (err) {
                console.error('Error:', err.message);
                resolve(`Error: ${err.message}`);
            }
            else {
                const subKeys = result[adrenalinSearchKey].keys;
                const found = subKeys.some(subKey => {
                    const subKeyValues = subKeys[subKey].values;
                    if (subKeyValues[adrenalinValueName] && subKeyValues[adrenalinValueName].value === adrenalinValueExpected) {
                        resolve('Installed');
                        return true;
                    }
                    return false;
                });

                if (!found) {
                    console.log('AMD Adrenalin is not installed.');
                    resolve('Not installed');
                }
            }
        });
    });
}

/**
 * Check the System Vairables for the OPENSSL_ia32cap entry, check if it is there and also what the value is currently
 * set to.
 */
const CheckENV = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Define the environment variable name you want to check
        const variableName = 'OPENSSL_ia32cap';

        exec(`SET ${variableName}`, (error, stdout) => {
            if (error) {
                reject(error);
                return;
            }

            const variableValue = stdout.trim();

            if (variableValue) {
                resolve(`${variableValue.split('=')[1]}`);
            } else {
                resolve(`Undefined.`);
            }
        });
    });
}

/**
 * Read the registry desktop entry to collect the name of the image used as the current wallpaper.
 */
const CheckWallpaper = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Define the Registry key path for wallpaper settings
        const wallpaperKeyPath = 'HKCU\\Control Panel\\Desktop';

        regedit.list([wallpaperKeyPath], (error, result) => {
            if (error) {
                reject(error);
                return;
            }

            const wallpaperPath = path.basename(<string>result[wallpaperKeyPath].values.WallPaper.value);
            resolve(wallpaperPath ?? 'Unknown');
        });
    });
}

/**
 * Checks the accuracy of the system time and date by comparing it with an online NTP server.
 * @returns A message indicating whether the system time is accurate or inaccurate, or an error message in case of an error.
 */
const CheckTimeAndDate = async () => {
    try {
        // Get the current system time in Unix timestamp
        const localTime = new Date().getTime();

        // Fetch the current time from an online NTP server using axios
        const onlineTimeResponse = await axios.get('http://worldtimeapi.org/api/ip');
        const onlineTimeData = onlineTimeResponse.data;
        const onlineTime = new Date(onlineTimeData.utc_datetime).getTime();

        // Calculate the time difference in milliseconds
        const timeDifferenceMs = Math.abs(localTime - onlineTime);

        // Define a threshold for acceptable time difference (e.g., 10 seconds)
        const acceptableTimeDifferenceMs = 10000;

        // Compare the time difference with the acceptable threshold
        if (timeDifferenceMs <= acceptableTimeDifferenceMs) {
            return 'System time is accurate.';
        } else {
            return 'System time is inaccurate.';
        }
    } catch (error) {
        // @ts-ignore
        return `Error: ${error.message}`;
    }
}

/**
 * Check the Firewall settings for the LeadMe Launcher, then detect if the Station or NUC software has been installed.
 * Send back if the Firewall has the rule, multiple rules or if there is only one send back the details of that rule.
 */
const CheckProgramFirewallSettings = async () => {
    //Detect what software is installed
    const appDataRoamingPath = path.join(os.homedir(), 'AppData', 'Roaming');

    const programs = {}

    //Launcher should always exist
    try {
        programs['Launcher'] = await CheckFirewall(`leadme.exe`);
    } catch (error) {
        programs['Launcher'] = { Status: "Not found" };
    }

    //Check if the Station exists
    try {
        fs.accessSync(path.join(appDataRoamingPath, 'leadme_apps', 'Station'), fs.constants.F_OK);
        programs['Station'] = await CheckFirewall(`station.exe`);
    } catch (error) {
        programs['Station'] = { Status: "Not found" };
    }

    //Check if the NUC exists
    try {
        fs.accessSync(path.join(appDataRoamingPath, 'leadme_apps', 'NUC'), fs.constants.F_OK);
        programs['NUC'] = await CheckFirewall(`NUC.exe`);
    } catch (error) {
        programs['NUC'] = { Status: "Not found" };
    }

    return programs;
}

const CheckFirewall = (exePath: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        try {
            exec(`netsh advfirewall firewall show rule name="${exePath}"`, (error, stdout) => {
                if (error) {
                    console.log(error);
                    reject( {Status: "Error"});
                    return;
                }

                const ruleSections = stdout.split("\r\n\r\n");

                //Collect the Rule Name, Profiles (private/public) and the Action (Allow, Block)
                const rulePattern = /Rule Name:\s+(.*?)\s+.*?Profiles:\s+(.*?)\s+.*?Action:\s+(.*?)\s+/gs;

                let match;
                const matches: Match[] = [];

                for (const section of ruleSections) {
                    while ((match = rulePattern.exec(section)) !== null) {
                        const [, RuleName, Profiles, Action] = match;
                        const details: Match = { RuleName, Profiles, Action }
                        matches.push(details);
                    }
                }

                if (matches.length > 0) {
                    resolve( {Status: `${matches.length} matches found. Check Firewall and remove duplicates`});
                } else if (matches.length === 1) {
                    resolve(matches[0]);
                } else {
                    resolve( {Status: "Not found"});
                }
            });
        } catch (error) {
            console.log(error);
            reject( {Status: "Error"});
        }
    });
}
