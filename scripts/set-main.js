// scripts/set-main.js
const fs = require('fs');
const path = require("path");

const args = process.argv.slice(2);  //First two arguments are the node env and version
const configPath = `config-${args[0]}/package.main.js`;

try {
    const config = require(`../config/${configPath}`);
    const packageJsonPath = path.join(__dirname, '..', 'package.json');

    // Read the existing package.json
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Merge the main entry point from the config file
    packageJson.main = config.main;
    packageJson.name = config.name;
    packageJson.version = config.version;
    packageJson.description = config.description;

    // Write the updated package.json back
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(`Updated main entry point to: ${config.main}`);
} catch (error) {
    console.error(`Error updating main entry point: ${error.message}`);
}
