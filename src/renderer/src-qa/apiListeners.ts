import { useStateStore } from "../store/stateStore";
import { useFullStore } from "./store/fullStore";
import * as CONSTANT from "../assets/constants";
import { QaCheck, TCPMessage } from "./interfaces";
import { Station } from "./types/_station";

let stateStore: any;
let fullStore: any;

/**
 * Initialise the pinia stores required for the api listeners.. This needs to be done at run time otherwise
 * the compiler tries to initialise the stores before the app.
 */
export const initialise = () => {
    stateStore = useStateStore();
    fullStore = useFullStore();
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
            fullStore.uploadFileResult = info.result;
            break;

        case CONSTANT.MESSAGE.LOAD_PROGRESS:
            fullStore.reportTracker = info.data;
            break;
s
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
            fullStore.ApplianceList = JSON.parse(message[1]);
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
            fullStore.qaChecks.push(...qaChecks)
            const index = fullStore.stations.findIndex(element => element.expectedDetails?.id == id)
            if (index !== -1) {
                fullStore.stations[index].qaChecks.push(...qaChecks)
            }

            fullStore.updateQaChecks(id, group, qaChecks)
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
            fullStore.qaChecks.push(...qaChecks)
            fullStore.updateQaChecks('nuc', group, qaChecks)
            break;
        }
        case "RunTabletGroup": {
            const group = response.responseData.group
            const data = typeof response.responseData.data === "string" ? JSON.parse(response.responseData.data) : response.responseData.data
            const qaChecks = data.map(element => {
                var qa = {} as QaCheck
                qa.passedStatus = element._passedStatus ?? element.passedStatus
                qa.message = element._message ?? element.message
                qa.id = element._id ?? element.id
                return qa
            });
            fullStore.qaChecks.push(...qaChecks)
            fullStore.updateQaChecks('tablet:' + response.ipAddress, group, qaChecks)
            break;
        }
        case "ExperienceLaunchAttempt": {
            const status = response.responseData.result
            const message = response.responseData.message
            const stationId = response.source.split(",")[1]
            const experienceId = response.responseData.experienceId
            fullStore.updateExperienceCheck(stationId, experienceId, status, message)
            break;
        }
        case "ExperienceLaunched": {
            const stationId = response.source.split(",")[1]
            const experienceId = response.responseData.experienceId
            fullStore.updateExperienceCheck(stationId, experienceId, "passed", "")
            break;
        }
        case "ExperienceLaunchFailed": {
            const stationId = response.source.split(",")[1]
            const experienceId = response.responseData.experienceId
            fullStore.updateExperienceCheck(stationId, experienceId, "failed", response.responseData.message ?? "")
            break;
        }
        case "GetVrStatuses": {
            const stationId = response.source.split(",")[1]
            fullStore.updateStationVrStatuses(stationId, response.responseData.result)
            break;
        }
        case "GetExperiences": {
            console.log(response.responseData.stations);
            response.responseData.stations.forEach(station => {
                fullStore.checkExperiencesForErrors(station.id, station.applications);
            });
            fullStore.updateExperienceChecksWithErrors();
            break;
        }
        case "Connected": {
            fullStore.connected = true
            fullStore.ApplianceList = response.responseData.appliances;
            fullStore.cbusConnection = response.responseData.cbus;

            response.responseData.stations.forEach(station => {
                const s = new Station(station.id + "");
                s.expectedDetails = {
                    ipAddress: station.ipAddress,
                    nucIpAddress: "",
                    name: station.name,
                    installedApplications: station.installedApplications ?? "",
                    id: station.id + "",
                    room: station.room,
                    macAddress: station.macAddress,
                    ledRingId: station.ledRingId,
                    labLocation: ""
                }
                fullStore.checkExperiencesForErrors(station.id, station.installedApplications ?? "");
                fullStore.stations.push(s)
                fullStore.addDevice(s.id, 'station');
                fullStore.sendStationMessage(s.id, {
                    action: CONSTANT.ACTION.CONNECT_STATION,
                    actionData: {
                        expectedStationId: s.id
                    }
                })
            })
            break;
        }
        case "TabletConnected": {
            fullStore.tabletConnected(response.ipAddress)
            break;
        }
        case "StationConnected": {
            console.log('stationConnected')
            fullStore.stationConnected(response.responseData.expectedStationId, response.responseData)
            break;
        }
        case "TabletChecks": {
            fullStore.tabletConnected(response.ipAddress)
            console.log(response.responseData)
            break;
        }
        case "CbusConnectionValidation": {
            fullStore.cbusConnection = response.responseData.result;
            break;
        }
        case "CbusApplianceValidation": {
            const details = response.responseData;
            const foundItem = fullStore.ApplianceList.find(item =>
                item.automationBase == details.automationBase &&
                item.automationGroup == details.automationGroup &&
                item.automationId == details.automationId &&
                (details.automationValue != undefined ? item.automationValue == details.automationValue : true)
            );

            if (!foundItem) return;
            foundItem.checked = true;

            let expectedId = `${foundItem.type}-${details.address}`;
            if (details.automationValue != undefined) {
                expectedId += `${details.automationValue}`;
            }

            const correct = foundItem.id === expectedId;
            if (correct !== null) {
                foundItem.correctId = correct;
                foundItem.correct = correct;
            }
            break;
        }
        case "EpsonApplianceStatusCheck":
            const details = response.responseData;
            const foundItem = fullStore.ApplianceList.find(item => item.id === details.id);

            if (!foundItem) return;

            foundItem.checked = true;
            foundItem.correctId = details.result;

            if (details['notDefaultPassword'] !== undefined) {
                foundItem.defaultPassword = !details['notDefaultPassword'];
            }

            foundItem.correct = details.result;

            break;
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
