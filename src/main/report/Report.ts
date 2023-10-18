import fs from 'fs';
import path from "path";
import os from "os";
import { dialog } from 'electron';
import { createMockWindow } from "./MockBrowser";

export async function DetermineReportType(info: any, mainWindow: Electron.BrowserWindow) {
    switch(info.type) {
        case "pdf":
        case "upload_pdf":
            void generatePDF(info, mainWindow);
            break;

        case "csv":
            void generateCSV(info);
            break;

        case "save_progress":
            void saveCurrentProgress(info);
            break;

        case "load_progress":
            return await loadCurrentProgress();

        default:
            break;
    }

    return null;
}

/**
 * Generate a basic PDF document with the info.data supplied.
 * @param info
 * @param mainWindow
 */
const generatePDF = async (info: any, mainWindow: Electron.BrowserWindow) => {
    //Save the info.data as temp.html
    const tempDir = os.tmpdir();
    const filePath = `${tempDir}/temp.html`;

    fs.writeFile(filePath, info.data, (err) => {
        if (err) throw err;
        console.log('HTML content saved to', filePath);
    });

    //The MockBrowser will open and use that temp.html to generate a pdf
    await createMockWindow(info.type === 'upload_pdf', info, mainWindow);
}

const generateCSV = async (info: any) => {
    console.log("Do something good: " + info.data);
}

const saveCurrentProgress = async (info: any) => {
    return dialog.showOpenDialog({ properties: ['openDirectory'] }).then((res) => {
        if (!res.canceled) {
            console.log(res.filePaths[0])
            const outputDir = res.filePaths[0]
            try {
                fs.writeFileSync(path.join(outputDir, 'progress.json'), info.data)
            } catch (err) {
                // @ts-ignore type error has message
                console.log(err.message)
            }
        }
    });
}

const loadCurrentProgress = async () => {
    const res = await dialog.showOpenDialog({properties: ['openFile']});
    if (!res.canceled) {
        const filepath = res.filePaths[0];
        console.log(filepath);

        try {
            return {
                message: 'load_progress',
                data: JSON.parse(fs.readFileSync(filepath, 'utf-8'))
            };
        } catch (err) {
            console.error(err);
            return 0;
        }
    } else {
        return 0;
    }
}
