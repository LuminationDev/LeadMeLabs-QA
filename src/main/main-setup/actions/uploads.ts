import * as path from 'path'
import * as fs from 'fs'
import Encryption from "../../shared/encryption/Encryption";

export async function uploadAppliance(
    applianceJson: string,
    outputFolder: string,
    outputFolderOld: string,
    setSavedFileCallback: () => void): Promise<string | void>
{
    // rename and move old file
    try {
        fs.renameSync(
            path.join(outputFolder, `appliance_list.json`),
            path.join(outputFolderOld, `appliance_list-${Date.now()}.json`)
        )
    } catch (err) {
        console.log(err)
        console.error(`Error while trying to move appliance list to old folder`)
    }

    // write a new one in the output location
    try {
        console.log('trying to write appliance_list.json')
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true })
        }

        //Change the panasonic projector username and password into encrypted data
        let appliances = JSON.parse(applianceJson);

        // Decrypt username and password fields for projectors and sources
        await Promise.all([
            decryptAutomationType(appliances, 'projectors'),
            decryptAutomationType(appliances, 'sources')
        ]);

        fs.writeFileSync(path.join(outputFolder, 'appliance_list.json'), JSON.stringify(appliances), 'utf-8')
        setSavedFileCallback()
        return outputFolder
    } catch (err) {
        console.log(err + ' error has occured')
        console.error('Error while trying to write new appliance_list')
    }
}

/**
 * Decrypts the usernames and passwords of appliances belonging to a specific automation type.
 *
 * @param {Array} appliances - The array of appliances containing objects with 'automationType' property.
 * @param {string} typeName - The name of the automation type whose usernames and passwords need to be decrypted.
 * @returns {Promise<void>} - A Promise that resolves once all decryption operations are complete.
 */
async function decryptAutomationType(appliances: any, typeName: string): Promise<void> {
    const index = appliances.findIndex((item: any) => item.name === typeName);

    if (index !== -1) {
        await Promise.all(appliances[index].objects.map(async (item: any) => {
            if (item['automationType'] === 'panasonic') {
                item.username = await Encryption.encryptDataUTF16(item.username);
                item.password = await Encryption.encryptDataUTF16(item.password);
            }
        }));
    }
}

export function uploadStation(
    stationObj: string,
    outputFolder: string,
    outputFolderOld: string,
    setSavedFileCallback: () => void
): void {
    // export Electron API to write file out
    const data = stationObj
    // rename and move old file
    try {
        fs.renameSync(
            path.join(outputFolder, `station_list.json`),
            path.join(outputFolderOld, `station_list-${Date.now()}.json`)
        )
    } catch (err) {
        console.log(err)
        console.error('Error while trying to move station list to old folder')
    }
    try {
        fs.writeFileSync(path.join(outputFolder, 'station_list.json'), data, 'utf-8')
        setSavedFileCallback()
    } catch (err) {
        console.log(err + ' error has occured')
        console.error('Error while trying to write new station list')
    }
}
