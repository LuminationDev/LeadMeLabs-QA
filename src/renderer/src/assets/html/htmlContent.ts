export function generateHtml(reportDivContent: string) {
    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>LeadMe QA</title>
                <script src='https://cdn.tailwindcss.com'></script>
            </head>

            <body style='background-color:white;'>
                ${reportDivContent}
            </body>
        </html>
    `;
}
