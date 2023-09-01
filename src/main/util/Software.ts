import { exec, spawn } from "child_process";
import path from "path";
import os from "os";
import Encryption from "./Encryption";

const fs = require('fs');

interface SoftwareInfo {
    TaskScheduler: string;
    SteamCMD: string;
}

/**
 * Collect the information relating to the LeadMe software installed on the local computer.
 */
export async function CollectSoftwareInformation(ipcMain: Electron.IpcMain, mainWindow: Electron.BrowserWindow) {
    const details = {} as SoftwareInfo;

    CheckTaskSchedulerItem();

    //details.SteamCMD = await SteamCMD();

    // Send to the frontend via Electron.IpcMain
    mainWindow.webContents.send('backend_message', {
        channelType: "software_settings",
        data: details,
    });
}

//TODO needs admin rights?
const CheckTaskSchedulerItem = () => {
    const taskFolder: string = "LeadMe\\Software_Checker";
    const args = `SCHTASKS /QUERY /TN ${taskFolder} /fo LIST`;

    console.log(args);

    exec(args, (error, stdout) => {
        if(error != null) {

        }

        const lines = stdout.split('\n');

        let taskName = '';
        let status = '';

        for (const line of lines) {
            if (line.includes('TaskName:')) {
                taskName = line.replace('TaskName:', '').trim();
            } else if (line.includes('Status:')) {
                status = line.replace('Status:', '').trim();
            }
        }

        console.log('TaskName:', taskName);
        console.log('Status:', status);

        console.log("ERROR: " + error);
    });
}

const SteamCMD = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        const appDataRoamingPath = path.join(os.homedir(), 'AppData', 'Roaming', 'leadme_apps', 'Station');

        //Check if SteamCMD has been initialised
        const filePath = path.join(appDataRoamingPath, 'external', 'steamcmd', 'steamerrorreporter.exe');
        if (!fs.existsSync(filePath)) {
            resolve("Not initialised");
        }

        //Check if there are saved Steam details in the Station/_config/config.env
        // const configPath = path.join(appDataRoamingPath, '_config', 'config.env');
        // let data;
        // Encryption.decryptData(fs.readFileSync(configPath).toString()).then(result => console.log(result));
        // console.log(data);

        //Check that Steam Guard is not active (or) correctly configured
        const steamPath = path.join(appDataRoamingPath, 'external', 'steamcmd', 'steamcmd.exe');
        const args = ['+login anonymous',' +quit']; // Arguments to pass to steamcmd

        // Spawn the steamcmd process
        const steamcmdProcess = spawn(steamPath, args);

        // Collect the console output
        let consoleOutput = '';

        steamcmdProcess.stdout.on('data', (data) => {
            consoleOutput += data.toString();
            process.stdout.write(data);
        });

        steamcmdProcess.stderr.on('data', (data) => {
            consoleOutput += data.toString();
            process.stderr.write(data);
        });

        // Wait for the process to exit
        steamcmdProcess.on('close', (code) => {
            console.log(`SteamCMD process exited with code ${code}`);
            console.log('Console Output:', consoleOutput);
        });


        resolve("Other");
    });
}
