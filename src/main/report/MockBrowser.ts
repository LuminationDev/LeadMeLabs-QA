import { BrowserWindow, dialog } from 'electron';
import fs from 'fs';
import os from "os";
import admin from "firebase-admin";

let tempWindow: BrowserWindow | null;

/**
 * A basic browser window that is not shown to the user. It loads up the temp.html that was saved by the Report page,
 * on finished loading electron uses the printToPDF function to create a replica of the current screen. Hence generating
 * the report.
 */
export async function createMockWindow(isTemp: boolean, info: any, mainWindow: Electron.BrowserWindow) {
    tempWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    const tempDir = os.tmpdir();
    const tempFilePath = `${tempDir}/temp.html`;

    try {
        await tempWindow.loadFile(tempFilePath);

        const options = {
            landscape: false,
            marginsType: 0,
            printBackground: true,
        };

        const pdfData = await tempWindow.webContents.printToPDF(options);

        let filePath: fs.PathOrFileDescriptor | undefined;

        if (isTemp) {
            filePath = `${tempDir}/${info.fileName}.pdf`;
        } else {
            filePath = dialog.showSaveDialogSync({
                defaultPath: `${info.fileName}.pdf`,
            });
        }

        if (filePath) {
            await fs.promises.writeFile(filePath, pdfData);

            if (isTemp) {
                await uploadFile(filePath, info.fileName, info.location, mainWindow);
            }

            await fs.promises.unlink(tempFilePath);
        }

        tempWindow?.close();
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * Upload the temporary PDF to Firebase Storage.
 */
const uploadFile = async (filePath: string, fileName: string, location: string, mainWindow: Electron.BrowserWindow) => {
    const bucket = admin.storage().bucket('leadme-labs.appspot.com');
    const destination = `QA/${location}/${fileName}.pdf`;

    let result = false;

    try {
        const fileMetadata = {
            contentType: 'application/pdf'
        };

        await bucket.upload(filePath, {
            destination,
            metadata: fileMetadata
        });

        console.log('File uploaded successfully.');
        result = true;
    } catch (error) {
        console.error('Error uploading file:', error);
        result = false;
    } finally {
        try {
            await fs.promises.unlink(filePath);
            console.log(`Successfully deleted: ${filePath}`);
        } catch (error) {
            console.error('Error deleting file:', error);
        }

        mainWindow.webContents.send('backend_message', {
            channelType: 'pdf_uploaded',
            result,
        });
    }
};
