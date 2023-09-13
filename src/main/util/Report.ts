import { PDFDocument, rgb } from 'pdf-lib';
import { dialog } from 'electron';
import fs from 'fs';

export async function DetermineReportType(info: any) {
    switch(info.type) {
        case "pdf":
            void GeneratePDF(info);
            break;

        case "csv":
            void GenerateCSV(info);
            break;

        default:
            break;
    }
}

/**
 * Generate a basic PDF document with the info.data supplied.
 * @param info
 */
const GeneratePDF = async (info: any) => {
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

const GenerateCSV = async (info: any) => {
    console.log("Do something good");
}
