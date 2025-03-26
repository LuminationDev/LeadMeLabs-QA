import * as CONSTANT from "../../assets/constants";
import { defineStore } from 'pinia';
import { QaCheck, QaDetail } from "../../interfaces";
import { Station as StationClass } from '../../types/_station'
import { QaGroup } from "../../types/_qaGroup";
import { QaCheckResult } from "../../types/_qaCheckResult";
import { useStateStore } from "../../store/stateStore";
import { Report, Targets } from "../../interfaces/_report";

/**
 * Used to store values for the Lab's Full Check method only.
 */
export const useExperienceStore = defineStore({
    id: 'experience',
    state: () => ({
        online: true,
        uploadFileResult: false,
        //Track the progress of the checks as an overall report object
        reportTracker: {} as Report,
        //Track all connected devices
        deviceMap: [
            { id: 'NUC', prefix: '', ipAddress: '', type: 'nuc', checks: {} }
        ],
        connected: false,
        //Compared against the number of Station's contacted
        numberOfStations: 0,
        //The most progress a user has made
        maxProgress: 0,
        mostRecentAutoCheck: '',
        //List of the Station detail's from the NUC
        qaChecks: Array<QaCheck>(),
        qaDetails: Array<QaDetail>(),
        stations: Array<StationClass>(),
        qaGroups: [] as Array<QaGroup>,
    }),
    actions: {
        updateStationVrStatuses(stationId: string, statuses: any) {
            const index = this.stations.findIndex(element => element.getId() == stationId)
            if (index !== -1) {
                this.stations[index].vrStatuses = statuses
            }
        },

        buildQaList() {
            let stationIds = this.stations.map(station => station.getId())
            const stationConnectionChecks = new QaGroup("station_connection_checks")
            const stationIsConnected = new QaCheckResult("station_is_connected", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Station is connected to NUC")
            stationConnectionChecks.checks.push(stationIsConnected)

            const imvrChecks = new QaGroup("imvr_checks", "imvr", { headset: this.reportTracker['headsetType'] })
            const correctHeadset = new QaCheckResult("correct_headset", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Correct Headset Select", "Is the correct headset selected in the launcher?")
            const headsetConnected = new QaCheckResult("headset_connected", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Headset Connected", "Is the headset connected?")
            const headsetFirmware = new QaCheckResult("headset_firmware", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Headset Firmware", "Are there any firmware updates available for the headset?")
            const controllersConnected = new QaCheckResult("controllers_connected", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Controllers Connected", "Are the controllers connected?")
            const controllersFirmware = new QaCheckResult("controllers_firmware", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Controllers Firmware", "Are there any firmware updates available for the controllers?")
            const baseStationsConnected = new QaCheckResult("base_stations_connected", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Base Stations Connected", "Are there any base stations connected?")
            const baseStationsFirmware = new QaCheckResult("base_stations_firmware", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Base Stations Firmware", "Are there any firmware updates available for the base stations?")
            imvrChecks.checks.push(correctHeadset, headsetConnected, headsetFirmware, controllersConnected, controllersFirmware, baseStationsConnected, baseStationsFirmware)
            imvrChecks.requirements = ["station_connection_checks"]

            this.qaGroups = [stationConnectionChecks, imvrChecks];
        },

        processQaList() {
            const completedQaCheckGroupIds = this.qaGroups.filter(group => group.allChecksPassed()).map(group => group.id)
            const completedQaCheckIds = [] as Array<string>
            this.qaGroups.forEach(qaGroup => {
                completedQaCheckIds.push(...qaGroup.getPassedChecksIds())
            })
            var allCompletedIds = [] as Array<string>
            allCompletedIds.push(...completedQaCheckGroupIds)
            allCompletedIds.push(...completedQaCheckIds)
            return this.qaGroups.filter(group => !group.started).filter(group => {
                return (group.requirements.filter(r => !allCompletedIds.includes(r)).length === 0)
            }).map(group => group.id)
        },

        updateQaChecks(id, groupName, qaChecks) {
            let index = this.qaGroups.findIndex(group => group.id === groupName)
            if (index !== -1) {
                this.qaGroups[index].updateQaChecks(id, qaChecks)
            }
        },

        startQa(groupId: string) {
            let index = this.qaGroups.findIndex(group => group.id === groupId)
            if (index !== -1) {
                this.qaGroups[index].startQa()
                const group = this.qaGroups[index]
                useStateStore().sendMessage({
                    action: CONSTANT.ACTION.RUN_STATION_GROUP,
                    actionData: {
                        group: group.id,
                        labType: this.reportTracker["labType"] ?? "Online",
                        stationIds: ['all'], // todo, method for this
                        parameters: group.parameters ?? {}
                    }
                });

                useStateStore().sendMessage({
                    action: CONSTANT.ACTION.RUN_NUC_GROUP,
                    actionData: {
                        group: group.id,
                        labType: this.reportTracker["labType"] ?? "Online",
                        parameters: group.parameters ?? {}
                    }
                });
            }
        },

        sendStationMessage(stationId: string, messageData: { action: string, actionData: any }) {
            const stateStore = useStateStore()
            const processedData = {
                qaToolAddress: stateStore.getServerDetails,
                ...messageData
            }
            const station = this.stations.find(element => element.expectedDetails && element.expectedDetails.id === stationId);
            if (!station) {
                return
            }
            // @ts-ignore api is injected
            api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
                channelType: CONSTANT.CHANNEL.TCP_CLIENT_CHANNEL,
                key: stateStore.key,
                address: station.expectedDetails?.ipAddress,
                port: 55557,
                data: CONSTANT.MESSAGE.QA_LEAD_TEXT + ":" + JSON.stringify(processedData)
            });
        },

        stationConnected (expectedStationId: string, stationData: any) {
            const index = this.stations.findIndex(element => element.expectedDetails?.id === expectedStationId)
            console.log(index, expectedStationId)
            this.stations[index].details = {
                ipAddress: stationData.ipAddress,
                nucIpAddress: stationData.nucAddress,
                labLocation: stationData.labLocation,
                name: null,
                installedJsonApplications: null,
                noLicenseApplications: null,
                blockedFamilyModeApplications: null,
                id: stationData.id + "",
                room: stationData.room,
                macAddress: stationData.macAddress,
                ledRingId: null,
                stationMode: stationData.stationMode ? stationData.stationMode.toLowerCase() : "vr"
            }
        },

        /**
         * Add a device to the deviceMap if it does not already exist.
         * @param id
         * @param type
         */
        addDevice(id: string, type: string) {
            const index = this.deviceMap.findIndex(item => item.id === id);
            const tabletNum = this.deviceMap.filter(item => item.type === 'tablet');
            if(index === -1) {
                this.deviceMap.push({
                    id: type === 'tablet' ? `T${(tabletNum.length + 1)}` : id,
                    ipAddress: type === 'tablet' ? id : '',
                    prefix: type === 'station' ? 'S' : '', //Assumes only stations have prefixes
                    type: type,
                    checks: {}
                });
            }
        },

        /**
         * Remove a device from the deviceMap. If the device is a tablet, compare the id against the ipAddress
         * otherwise compare against the id.
         * @param id
         * @param type
         */
        removeDevice(id: string, type: string) {
            if (type === 'tablet') {
                this.deviceMap = this.deviceMap.filter(item => item.ipAddress !== id);
            } else {
                this.deviceMap = this.deviceMap.filter(item => item.id !== id);
            }
        },

        /**
         * Add a check with its associated information to the report tracker
         * @param parent
         * @param page
         * @param check
         * @param targetDevices
         */
        addCheckToReportTracker(parent: string, page: string, check, targetDevices: Targets) {
            const checkKey = check.key;
            this.reportTracker[parent] ||= {};
            const reportTracker = this.reportTracker[parent][page] ||= {};

            reportTracker[checkKey] ||= {
                description: check.description,
                comments: [],
                targets: targetDevices,
                devices: {}
            };

            this.deviceMap.forEach(device => {
                if (targetDevices[device.type]) {
                    reportTracker[checkKey].devices[device.id] ||= {
                        deviceId: device.id,
                        type: device.type,
                        passedStatus: "skipped",
                        message: "Not provided",
                        id: checkKey
                    };
                }
            });
        },

        /**
         * On a checkbox change update the reportTracker. The manual check items are either 'passed' or 'skipped'.
         * @param parent
         * @param page
         * @param info A string representing the current state of the check.
         * @param checkId A string ID of the associated check.
         * @param deviceId A string ID of the associated device.
         */
        updateReport(parent: string, page: string, info: any, checkId: string, deviceId: string) {
            // Access reportTracker properties step by step
            const parentPage = this.reportTracker[parent]?.[page];
            const check = parentPage?.[checkId];
            let device = check?.devices?.[deviceId];

            // Update the passedStatus based on the event
            if (device) {
                this.reportTracker[parent][page][checkId]['date'] = useStateStore().formattedDate(false);
                this.reportTracker[parent][page][checkId].devices[deviceId] = info;
            }

            // Update the fullStore.deviceMap
            const mapDevice = this.deviceMap.find(device => device.id == deviceId);
            if (mapDevice) {
                mapDevice.checks[checkId] = info;
            }
        },

        /**
         * Read any saved report data from the reportTracker, mapping it to the deviceMap.
         * @param parent
         * @param page
         */
        readReportData(parent: string, page: string) {
            const reportTracker = this.reportTracker[parent]?.[page];

            if (!reportTracker) return;

            for (const [checkId, check] of Object.entries(reportTracker)) {
                if(checkId === 'comments') continue;

                for (const [deviceId, info] of Object.entries(check.devices)) {
                    const device = this.deviceMap.find(device => device.id === deviceId);
                    if (device) {
                        device.checks[checkId] ??= info;
                    }
                }
            }
        },

        /**
         * Update the max progress if the user's current progress is greater. The max progress tracks the overall progress
         * of the report (hence is never reduced).
         * @param progress
         */
        updateMaxProgress(progress: number) {
            this.maxProgress = progress > this.maxProgress ? progress : this.maxProgress;
        },
    },
    getters: {
        /**
         * Order the devices from the fullStore.deviceMap into a constant order based
         * on the device type.
         */
        orderedDevices(state) {
            const typeOrder: { [key: string]: number } = { 'station': 0, 'tablet': 1, 'nuc': 2, 'cbus': 3 };
            return state.deviceMap.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
        },

        getReportSections(state) {
            const keysToRemove = ['labLocation', 'technicianName', 'labType', 'networkType', 'headsetType', 'comments'];
            const reportWithoutKey = { ...state.reportTracker };
            keysToRemove.forEach(key => {
                if (reportWithoutKey.hasOwnProperty(key)) {
                    delete reportWithoutKey[key];
                }
            });
            return reportWithoutKey;
        },

        groupsThatHaveRun(state) {
            return state.qaGroups.filter(element => element.started).map(element => element.id)
        },
        /**
         * Collect just the titles (keys) from the report tracker.
         */
        getReportTitles() {
            return Object.keys(useExperienceStore().getReportSections);
        }
    }
});
