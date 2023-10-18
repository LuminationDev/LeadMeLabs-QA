import * as path from 'path'
import * as fs from 'fs'

export function uploadAppliance(
    applianceJson: string,
    outputFolder: string,
    outputFolderOld: string,
    setSavedFileCallback: () => void): string | void
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
        fs.writeFileSync(path.join(outputFolder, 'appliance_list.json'), applianceJson, 'utf-8')
        setSavedFileCallback()
        return outputFolder
    } catch (err) {
        console.log(err + ' error has occured')
        console.error('Error while trying to write new appliance_list')
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
