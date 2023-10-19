import { dialog } from "electron";
import path from "path";
import fs from "fs";
import CbusConnector from "../connectors/CbusConnector";
import { uploadAppliance, uploadStation } from "../actions/uploads";
import { sendCommandTcpEpson } from "../actions/epsonActions";

export default class ConfigTool {
    ipcMain: Electron.IpcMain;
    mainWindow: Electron.BrowserWindow;
    cbusConnector: CbusConnector | null | undefined;
    userHasSaved: boolean = false;

    //Folder and file path defaults
    outputFolder: string  = `C:\\labs_config\\`;
    outputFolderOld: string  = `C:\\labs_config\\old\\`;
    appliancesJsonPath: string = `C:\\labs_config\\appliance_list.json`;
    stationsJsonPath: string  = `C:\\labs_config\\station_list.json`;

    constructor(ipcMain: Electron.IpcMain, mainWindow: Electron.BrowserWindow) {
        this.ipcMain = ipcMain;
        this.mainWindow = mainWindow;
    }

    /**
     * Initiate the config tool listener, each function uses a different channel handle to respond to
     * different events that the frontend requires.
     */
    startup(): void {
        this.configToolListenerDelegate();
    }

    /**
     * Create a listener that will delegate actions between the config tool functions depending on what channel type has
     * been sent. This allows just one listener to be active rather than individual function ones.
     */
    configToolListenerDelegate(): void {
        this.ipcMain.handle('config_function', (_event, info) => {
            switch(info.channelType) {
                case 'get-cbus-env':
                    return this.collectCbusEnv();

                case 'set-cbus':
                    return this.setCbus(info.creds, info.ipAddress);

                case 'is-cbus-information-set':
                    return this.isCbusInformationSet();

                case 'read-appliancejson':
                    return this.readApplianceJson();

                case 'read-stationjson':
                    return this.readStationJson();

                case 'get-cbusid':
                    return this.getCbusId(info.automationBase, info.automationGroup, info.automationId);

                case 'get-appliance-id-and-status':
                    return this.getCbusIdAndStatus(info.automationBase, info.automationGroup, info.automationId);

                case 'set-cbus-appliance-value':
                    return this.setCbusValue(info.automationBase, info.automationGroup, info.automationId, info.value);

                case 'load-file-picker':
                    return this.loadFilePicker();

                case 'save-file-picker':
                    return this.saveFilePicker(info.applianceJson, info.stationJson);

                case 'write-temp':
                    this.writeTempFile(info.applianceJson);
                    break;

                case 'read-temp':
                    return this.readTempFile();

                case 'load-temp':
                    return this.loadTempFile(info.filepath);

                case 'check-appliance-file':
                    return fs.existsSync(this.appliancesJsonPath);

                case 'check-station-file':
                    return fs.existsSync(this.stationsJsonPath);

                //External file actions
                case 'upload-appliance':
                    return uploadAppliance(info.applianceJson, this.outputFolder, this.outputFolderOld, this.setSavedFileCallback)

                case 'upload-station':
                    return uploadStation(info.stationObj, this.outputFolder, this.outputFolderOld, this.setSavedFileCallback)

                case 'send-command-epson':
                    return sendCommandTcpEpson(this.mainWindow, info.ip, info.port, info.desc, info.message);

                default:
                    console.log(`Unknown config tool call: ${JSON.stringify(info)}`)
                    break;
            }
        });
    }

    /**
     * Check ENV variables for CbusIP and CbusCred. Return object to the renderer
     */
    collectCbusEnv = () => {
        const cbusIP = process.env['CbusIP'] || ''
        const cbusLogin = process.env['CbusLogin'] || ''
        return {
            CbusIP: cbusIP,
            CbusLogin: cbusLogin
        }
    }

    /**
     * Set the Cbus credentials in the class and attempt to establish a connection to the Cbus unit.
     * @param credentials A string of username and password separated by a ':'.
     * @param IpAddress A string of the Cbus' IP address.
     */
    setCbus = async (credentials: string, IpAddress: string): Promise<boolean> => {
        try {
            this.cbusConnector = new CbusConnector(credentials, IpAddress)
            if (await this.cbusConnector.testConnection()) {
                console.log('test connection successful ')
                return true
            } else {
                this.cbusConnector = undefined
                return false
            }
        } catch (err) {
            return false
        }
    }

    /**
     * Check the current status of the Cbus connector.
     */
    isCbusInformationSet = (): boolean => {
        return this.cbusConnector !== undefined
    }

    /**
     * Set that the user has saved any current changes
     */
    setSavedFileCallback = (): void => {
        this.userHasSaved = true
    }

    /**
     * Read the local appliance_list.json and return the contents.
     */
    readApplianceJson = () => {
        try {
            return JSON.parse(fs.readFileSync(this.appliancesJsonPath, 'utf-8'))
        } catch (err) {
            // @ts-ignore error has message properties
            console.log(err.message)
            return 0
        }
    }

    /**
     * Read the local station_list.json and return the contents.
     */
    readStationJson = () => {
        try {
            return JSON.parse(fs.readFileSync(this.stationsJsonPath, 'utf-8'))
        } catch (err) {
            console.error(err)
            return 0
        }
    }

    /**
     * Collect the id of a Cbus object based on the automation values passed in.
     * @param automationBase
     * @param automationGroup
     * @param automationId
     */
    getCbusId = async (automationBase: string, automationGroup: string, automationId: string) => {
        try {
            if (this.cbusConnector !== undefined) {
                return await this.cbusConnector?.sendGetId(automationBase, automationGroup, automationId)
            } else {
                console.error('Connector has not been initialized. Please set up proper CBus IP')
            }
        } catch (e: any) {
            console.error(e.message)
        }
    }

    /**
     * Collect the id of a Cbus object and the current status of it based on the automation values passed in.
     * @param automationBase
     * @param automationGroup
     * @param automationId
     */
    getCbusIdAndStatus = async (automationBase: string, automationGroup: string, automationId: string) => {
        try {
            if (this.cbusConnector !== undefined) {
                return await this.cbusConnector?.getApplianceIdAndStatus(automationBase, automationGroup, automationId)
            } else {
                console.error('Connector has not been initialized. Please set up proper CBus IP')
            }
        } catch (e: any) {
            console.error(e.message)
        }
    }

    /**
     * Attempt to set the value of a Cbus object based on the automation values passed in.
     * @param automationBase
     * @param automationGroup
     * @param automationId
     * @param value
     */
    setCbusValue = async (automationBase: string, automationGroup: string, automationId: string, value: number) => {
        try {
            if (this.cbusConnector !== undefined) {
                return await this.cbusConnector?.sendSetValue(automationBase, automationGroup, automationId, value)
            } else {
                console.error('Connector has not been initialized. Please set up proper CBus IP')
            }
        } catch (e: any) {
            console.error(e.message)
        }
    }

    /**
     * Open a file that has been supplied and attempt to parse those files into the program as the station_list.json or
     * the appliance_list.json.
     */
    loadFilePicker = async () => {
        return dialog.showOpenDialog({ properties: ['openFile'] }).then((res) => {
            if (!res.canceled) {
                let applianceJson = ''
                let stationJson = ''
                const filepath = res.filePaths[0]

                if (path.parse(filepath).base == 'appliance_list.json') {
                    applianceJson = filepath
                    stationJson = path.join(path.parse(filepath).dir, 'station_list.json')
                } else if (path.parse(filepath).base == 'station_list.json') {
                    stationJson = filepath
                    applianceJson = path.join(path.parse(filepath).dir, 'appliance_list.json')
                }

                console.log(applianceJson)
                console.log(stationJson)

                try {
                    const applianceList = JSON.parse(fs.readFileSync(applianceJson, 'utf-8'))
                    const stationList = JSON.parse(fs.readFileSync(stationJson, 'utf-8'))
                    const tempStation = {}
                    tempStation['name'] = 'stations'
                    tempStation['objects'] = [...stationList]
                    return [...applianceList, tempStation]
                } catch (err) {
                    console.error(err)
                    return 0
                }
            } else {
                return 0
            }
        })
    }

    /**
     * Attempt to save the supplied applianceJson and stationJson information to the default file location.
     * @param applianceJson
     * @param stationJson
     */
    saveFilePicker = async (applianceJson, stationJson) => {
        return dialog.showOpenDialog({ properties: ['openDirectory'] }).then((res) => {
            if (!res.canceled) {
                console.log(res.filePaths[0])
                const outputDir = res.filePaths[0]
                try {
                    fs.writeFileSync(path.join(outputDir, 'appliance_list.json'), applianceJson)
                    fs.writeFileSync(path.join(outputDir, 'station_list.json'), stationJson)
                    this.setSavedFileCallback()
                    return outputDir
                } catch (err) {
                    // @ts-ignore type error has message
                    console.log(err.message)
                    return undefined;
                }
            }
            return undefined;
        });
    }

    /**
     * Save the applianceJson to a temporary location.
     * @param applianceJson
     */
    writeTempFile = (applianceJson: {}) => {
        const data = applianceJson.toString()
        const outputFilename = path.join(this.outputFolder, `appliance_list-${Date.now()}.json.tmp`)
        try {
            fs.writeFile(outputFilename, data, 'utf-8', function () {
                // do something after write has finished
                console.log('write has finished')
            })
        } catch (err) {
            console.log(err + ' error has occured')
        }
    }

    /**
     * Read the temporary file.
     */
    readTempFile = async () => {
        const glob = require('glob')
        // outputFolder available here
        const fileQuery = 'appliance_list-*.json.tmp'
        const pathAndFileQuery = path.join(this.outputFolder, fileQuery)
        const tempfileLib: { date: string; path: string }[] = []
        const allFiles = glob(pathAndFileQuery, { sync: true })
        for (const file of allFiles) {
            const indvFileName = path.parse(path.parse(file).name).name
            const timestamp = parseInt(indvFileName.split('-')[1])
            const formattedDate = this.myDateHelper(timestamp)

            const fileObject = {
                date: formattedDate as string,
                path: file as string
            }
            tempfileLib.push(Object.assign({}, fileObject))
        }
        return tempfileLib
    }

    /**
     * Check if there is a temporary file that is saved at the supplied file location. Load the contents into memory
     * if the file exists.
     * @param filepath
     */
    loadTempFile = (filepath: string) => {
        // return file content and rename file into appliance_list.json
        const applianceJson = JSON.parse(fs.readFileSync(filepath, 'utf-8'))
        const dirname = path.dirname(filepath)
        try {
            // rename file
            fs.rename(filepath, path.join(dirname, 'appliance_list.json'), function () {
                console.log('successfully reinstated a tempfile into an actual file')
            })
        } catch (err) {
            console.log(err)
        }
        return applianceJson
    }

    /**
     * A custom date formatter.
     * @param timestamp A generic time stamp to be formatted.
     */
    myDateHelper = (timestamp: number): string => {
        const dateFormat = new Date(timestamp)
        return `Date: ${dateFormat.getDate()}/${
            dateFormat.getMonth() + 1
        }/${dateFormat.getFullYear()} ${dateFormat.getHours()}:${dateFormat.getMinutes()}:${dateFormat.getSeconds()}`
    }
}
