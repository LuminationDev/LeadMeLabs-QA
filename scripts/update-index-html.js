// update-index-html.js
const fs = require('fs');
const path = require('path');

// Get the script name from passed arguments
const args = process.argv.slice(2); //First two arguments are the node env and version
const scriptName = args[0]; // Get script name from command line or default to 'start'

// Read the index.html file
const indexPath = path.join(__dirname, '..', 'src', 'renderer', 'index.html');
let originalIndexHtml = fs.readFileSync(indexPath, 'utf-8');

// Replace the placeholder with the actual script
const scriptTag = `<script id="main-script" type="module" src="${scriptName}.ts"></script>`;
const searchRegex = /<script id="main-script".*?><\/script>/s;
const modifiedIndexHtml = originalIndexHtml.replace(searchRegex, scriptTag);

// Write the updated index.html back
fs.writeFileSync(indexPath, modifiedIndexHtml, 'utf-8');

console.log(`Updated index.html with script: ${scriptTag}`);
