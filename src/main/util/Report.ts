import {PDFDocument, rgb} from 'pdf-lib';
import {dialog} from 'electron';
import fs from 'fs';
import path from "path";

export async function DetermineReportType(info: any) {
    switch(info.type) {
        case "pdf":
            void generatePDF(info);
            break;

        case "csv":
            void generateCSV(info);
            break;

        case "save_progress":
            void saveCurrentProgress(info);
            break;

        case "load_progress":
            return await loadCurrentProgress(info);

        default:
            break;
    }
}

/**
 * Generate a basic PDF document with the info.data supplied.
 * @param info
 */
const generatePDF = async (info: any) => {
    const pdfDoc = await PDFDocument.create();
    const a4Page = pdfDoc.addPage([595, 842]); // A4 size in points (approximately)

    a4Page.drawText(info.data, {
        x: 50,
        y: 150,
        size: 30,
        color: rgb(0, 0, 0),
    });

    // Serialize the PDF as a buffer
    const pdfBytes = await pdfDoc.save();
    const pdfBuffer = Buffer.from(pdfBytes);

    // Use Electron's dialog to save the PDF
    const filePath = dialog.showSaveDialogSync({
        defaultPath: 'document.pdf',
    });

    if (filePath) {
        fs.writeFileSync(filePath, pdfBuffer);
    }
}

const generateCSV = async (info: any) => {
    console.log("Do something good");
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

const loadCurrentProgress = async (filepath: string) => {
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
