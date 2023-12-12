import { BrowserWindow, dialog } from 'electron';
import fetch from 'node-fetch'
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
                await uploadFile(filePath, info.fileName, info.location, info, mainWindow);
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
const uploadFile = async (filePath: string, fileName: string, location: string, info: any, mainWindow: Electron.BrowserWindow) => {
    let result = false;

    try {
        const fileMetadata = {
            contentType: 'application/pdf'
        };

        if (fileName.startsWith("Network_Report")) {
            const response = await fetch("https://us-central1-leadme-labs.cloudfunctions.net/uploadNetworkCheckerReport", {
                method: "POST",
                headers: {
                    "Content-Type": "application/pdf",
                    "SiteName": info.siteName,
                    "Email": info.email
                },
                body: fs.readFileSync(filePath)
            })
            if (response.status === 200) {
                mainWindow.webContents.send('backend_message', {
                    channelType: "network_report_success"
                });
            } else {
                mainWindow.webContents.send('backend_message', {
                    channelType: "network_report_failed"
                });
            }
        } else {
            const bucket = admin.storage().bucket('leadme-labs.appspot.com');
            const destination = `QA/${location}/${fileName}.pdf`;
            await bucket.upload(filePath, {
                destination,
                metadata: fileMetadata
            });
        }

        console.log('File uploaded successfully.');
        result = true;
    } catch (error) {
        console.error('Error uploading file:', error);
        result = false;
        mainWindow.webContents.send('backend_message', {
            channelType: "network_report_failed"
        });
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
