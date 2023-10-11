import { BrowserWindow, dialog } from 'electron';
import fs from 'fs';
import os from "os";

let mainWindow: BrowserWindow | null;

/**
 * A basic browser window that is not shown to the user. It loads up the temp.html that was saved by the Report page,
 * on finished loading electron uses the printToPDF function to create a replica of the current screen. Hence generating
 * the report.
 */
export function createMockWindow() {
    // Create the browser window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    const tempDir = os.tmpdir();
    const tempFilePath = `${tempDir}/temp.html`;

    // Load a blank HTML page
    mainWindow.loadFile(tempFilePath).then(() => {
        const options = {
            landscape: false,
            marginsType: 0,
            printBackground: true,
        };

        // Print to PDF
        mainWindow?.webContents.printToPDF(options).then((pdfData) => {
            // Use Electron's dialog to save the PDF
            const filePath = dialog.showSaveDialogSync({
                defaultPath: 'document.pdf',
            });

            if (filePath) {
                //Save the new PDF
                fs.writeFile(filePath, pdfData, (error) => {
                    if (error) throw error;
                });

                //Delete the temporary file
                fs.unlink(tempFilePath, (error) => {
                    if (error) throw error;
                });
            }

            mainWindow?.close();
        });
    });

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}
