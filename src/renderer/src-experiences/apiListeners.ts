import { useStateStore } from "../store/stateStore";
import { useExperienceStore } from "./store/experienceStore";
import { useExperienceCheckStore } from "../store/experienceCheckStore";
import * as CONSTANT from "../assets/constants";
import { QaCheck, TCPMessage } from "../interfaces";
import { Station } from "../types/_station";
import { getStorage, ref, uploadBytes } from 'firebase/storage';

let stateStore: any;
let experienceStore: any;
let experienceCheckStore: any;

/**
 * Initialise the pinia stores required for the api listeners.. This needs to be done at run time otherwise
 * the compiler tries to initialise the stores before the app.
 */
export const initialise = () => {
    stateStore = useStateStore();
    experienceStore = useExperienceStore();
    experienceCheckStore = useExperienceCheckStore();
}

/**
 * Backend listener, any messages from the node backend are directed to this listener and then
 * triaged for the appropriate follow through.
 */
export const listeners = (info: any) => {
    switch(info.channelType) {
        case CONSTANT.CHANNEL.APPLICATION_CHANNEL:
            updateApplicationSettings(info); //Software version number
            break;

        case CONSTANT.CHANNEL.TCP_SERVER_CHANNEL:
            handleTCPMessage(info as TCPMessage); //Message from the TCP server
            break;

        case CONSTANT.CHANNEL.TCP_CLIENT_CHANNEL:
            handleTCPClientError(info as TCPMessage); //Message from the TCP client (Error states)
            break;

        case CONSTANT.CHANNEL.NETWORK_PORT_CHANNEL:
            stateStore.PortDetails = info.data; // Data sent back as port details
            break;

        case CONSTANT.CHANNEL.ERROR_CHANNEL:
            openNotificationModal(info.title, info.message);
            break;

        case CONSTANT.CHANNEL.UPDATE_CHANNEL:
            console.log(info);
            break;

        case CONSTANT.CHANNEL.REPORT_GENERATED:
            experienceStore.uploadFileResult = info.result;
            break;

        case CONSTANT.MESSAGE.LOAD_PROGRESS:
            experienceStore.reportTracker = info.data;
            break;

        case CONSTANT.MESSAGE.UPLOAD_FILE:
            uploadFile(info);
            break;

        default:
            break;
    }
};

/**
 * The NUC or Station has sent a message via the TCP server, determine what it is and how to handle it.
 */
const handleTCPMessage = (info: any) => {
    stateStore.isAwaitingResponse = false;

    //[0]Message type | [1]Message details
    const message = stateStore.splitStringWithLimit(info.mainText, ":", 2);
    switch(message[0]) {
        case "ServerStatus":
            stateStore.isServerRunning = message[1].includes("true");
            break;
        case "ApplianceList":
            experienceStore.ApplianceList = JSON.parse(message[1]);
            break;
    }


    console.log(info.mainText)
    if (!info.mainText || info.mainText === "") {
        return;
    }
    const response = JSON.parse(info.mainText) // todo expected response type
    switch (response.response) {
        case "RunGroup": {
            const group = response.responseData.group
            const id = response.source.split(",")[1]

            const qaChecks = JSON.parse(response.responseData.data).map(element => {
                var qa = {} as QaCheck
                qa.passedStatus = element._passedStatus ?? element.passedStatus
                qa.message = element._message ?? element.message
                qa.id = element._id ?? element.id
                return qa
            });
            experienceStore.qaChecks.push(...qaChecks)
            const index = experienceStore.stations.findIndex(element => element.expectedDetails?.id == id)
            if (index !== -1) {
                experienceStore.stations[index].qaChecks.push(...qaChecks)
            }

            experienceStore.updateQaChecks(id, group, qaChecks)
            break;
        }
        case "RunNucGroup": {
            const group = response.responseData.group
            const qaChecks = JSON.parse(response.responseData.data).map(element => {
                var qa = {} as QaCheck
                qa.passedStatus = element._passedStatus ?? element.passedStatus
                qa.message = element._message ?? element.message
                qa.id = element._id ?? element.id
                return qa
            });
            experienceStore.qaChecks.push(...qaChecks)
            experienceStore.updateQaChecks('nuc', group, qaChecks)
            break;
        }
        case "ExperienceLaunchAttempt": {
            const status = response.responseData.result
            const message = response.responseData.message
            const stationId = response.source.split(",")[1]
            const experienceId = response.responseData.experienceId
            experienceCheckStore.updateExperienceCheck(stationId, experienceId, status, message)
            break;
        }
        case "ExperienceLaunched": {
            const stationId = response.source.split(",")[1]
            const experienceId = response.responseData.experienceId
            experienceCheckStore.updateExperienceCheck(stationId, experienceId, "passed", "")
            break;
        }
        case "ExperienceLaunchFailed": {
            const stationId = response.source.split(",")[1]
            const experienceId = response.responseData.experienceId
            experienceCheckStore.updateExperienceCheck(stationId, experienceId, "failed", response.responseData.message ?? "")
            break;
        }
        case "GetVrStatuses": {
            const stationId = response.source.split(",")[1]
            experienceStore.updateStationVrStatuses(stationId, response.responseData.result)
            break;
        }
        case "GetExperiences": {
            console.log(response.responseData.stations);
            response.responseData.stations.forEach(station => {
                experienceCheckStore.checkExperiencesForErrors(station.id, station.applications, station.noLicenses, station.blockedFamilyMode, station.unacceptedEulas);
            });
            experienceCheckStore.updateExperienceChecksWithErrors();
            break;
        }
        case "Connected": {
            experienceStore.connected = true

            response.responseData.stations.forEach(station => {
                const s = new Station(station.id + "");
                s.expectedDetails = {
                    ipAddress: station.ipAddress,
                    nucIpAddress: "",
                    name: station.name,
                    installedJsonApplications: station.installedJsonApplications ?? "[]",
                    noLicenseApplications: station.noLicenseApplications ?? "[]",
                    blockedFamilyModeApplications: station.blockedFamilyModeApplications ?? "[]",
                    unacceptedEulas: station.unacceptedEulas ?? "[]",
                    id: station.id + "",
                    room: station.room,
                    macAddress: station.macAddress,
                    ledRingId: station.ledRingId,
                    labLocation: "",
                    stationMode: station?.mode ? station.mode.toLowerCase() : "vr"
                }

                experienceStore.stations.push(s)
                experienceCheckStore.checkExperiencesForErrors(station.id, station.installedJsonApplications ?? "[]", station.noLicenseApplications ?? "[]", station.blockedFamilyModeApplications ?? "[]", station.unacceptedEulas ?? "[]");
                experienceStore.addDevice(s.id, 'station');
                experienceStore.sendStationMessage(s.id, {
                    action: CONSTANT.ACTION.CONNECT_STATION,
                    actionData: {
                        expectedStationId: s.id
                    }
                })
            })
            break;
        }
        case "StationConnected": {
            console.log('stationConnected')
            experienceStore.stationConnected(response.responseData.expectedStationId, response.responseData)
            break;
        }
    }
}

/**
 * The electron Socket client has encountered an error, handle the type and required flow.
 */
const handleTCPClientError = (info: any) => {
    stateStore.isAwaitingResponse = false;

    switch(info.headerMessage) {
        case "TimedOut":
            console.log(`Socket timed out on: ${info.mainText}`);
            break;
    }
}

/**
 * Update the Library store's details, these are shown on the settings page.
 * @param info
 */
const updateApplicationSettings = (info: any) => {
    stateStore.version = info.version;
    stateStore.ipAddress = info.ipAddress;
}

const openNotificationModal = (s_title: string, s_message: string) => {
    stateStore.title = s_title;
    stateStore.message = s_message;
    stateStore.openModal = true;
}

const uploadFile = (info: any) => {
    const storage = getStorage();

    // Decode the Base64-encoded file content back to binary
    const binaryData = Uint8Array.from(atob(info.fileContents), c => c.charCodeAt(0));

    // Define the storage reference
    const storageRef = ref(storage, info.destination);

    // Upload the file contents as bytes
    uploadBytes(storageRef, binaryData)
        .then(() => {
            console.log('File uploaded successfully');
            experienceStore.uploadFileResult = true;
        })
        .catch((error) => {
            console.error('Error uploading file:', error);
            experienceStore.uploadFileResult = false;
        });
}
