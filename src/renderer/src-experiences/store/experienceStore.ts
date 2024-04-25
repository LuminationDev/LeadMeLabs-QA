import * as CONSTANT from "../../assets/constants";
import { defineStore } from 'pinia';
import { QaCheck, QaDetail } from "../../interfaces";
import { Station as StationClass } from '../../types/_station'
import { QaGroup } from "../../types/_qaGroup";
import { QaCheckResult } from "../../types/_qaCheckResult";
import { useStateStore } from "../../store/stateStore";
import { Report, Targets } from "../../interfaces/_report";
import { ExperienceCheck } from "../../interfaces/_experiences";
import { ExperienceDetails } from "../../interfaces/_experienceDetails";

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
        allowRunningExperienceChecks: false,
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
        experienceErrors: Array<ExperienceCheck>(),
        experienceChecks: Array<ExperienceCheck>(),
        qaGroups: [] as Array<QaGroup>,
        experiences: CONSTANT.EXPERIENCES.experiences,
        onlineExperiences: CONSTANT.EXPERIENCES.onlineExperiences
    }),
    actions: {
        /**
         * Check a Station's installed experiences for errors, these can be extra experiences that are installed and not
         * on the tier list or experiences that are missing that should be installed.
         */
        checkExperiencesForErrors(stationId: string, installedExperiences: string, noLicenseApplications: string, blockedFamilyMode: string) {
            if (installedExperiences === null || installedExperiences.length === 0) {
                console.log("Experiences not collected!");
                return;
            }

            //If the station is not in VR mode return
            if(!this.shouldStationBeVrCompatible(stationId)) return;

            //Build the expected experience list
            let expectedExperiences = this.experiences;
            // @ts-ignore
            if (this.reportTracker["labType"] === "Online") {
                expectedExperiences.push(...this.onlineExperiences);
            }

            //Check for unexpected experiences
            const jsonExperiences: ExperienceDetails[] = JSON.parse(installedExperiences);
            jsonExperiences.forEach((experience: ExperienceDetails) => {
                if (!experience) {
                    return;
                }

                if (experience.WrapperType === "Launcher") return;

                const isExpected = expectedExperiences.some(expected => expected.id === parseInt(experience.Id));
                if (isExpected) return;

                const station = { id: stationId, status: "pending", checkingStatus: "timeout", message: "Not expected" };
                const updatedTitle = experience.Name.replace(/^"(.*)"$/, '$1'); //Remove the leading and trailing quotes (")
                this.addOrUpdateError(this.experienceErrors, parseInt(experience.Id), updatedTitle, station);
            });

            //Check for experiences with no license or blocked by family mode before saying they are not installed
            let jsonNoLicenses: string[] = [];
            if (noLicenseApplications !== null && noLicenseApplications !== undefined) {
                jsonNoLicenses = JSON.parse(noLicenseApplications);
            }

            let jsonBlockedFamilyMode: string[] = [];
            if (blockedFamilyMode !== null && blockedFamilyMode !== undefined) {
                jsonBlockedFamilyMode = JSON.parse(blockedFamilyMode);
            }

            //Check for not installed experiences
            expectedExperiences.forEach(expected => {
                const isInstalled = jsonExperiences.some(installed => parseInt(installed.Id) === expected.id);
                if (isInstalled) return;

                let message = "Not installed";
                if (jsonNoLicenses.includes(expected.id.toString())) {
                    message = "No license";
                }
                if (jsonBlockedFamilyMode.includes(expected.id.toString())) {
                    message = "Blocked by family mode"
                }

                const station = { id: stationId, status: "pending", checkingStatus: "timeout", message };
                this.addOrUpdateError(this.experienceErrors, expected.id, expected.title, station);
            });

            this.experienceErrors = this.sortExperiences(this.experienceErrors);
        },

        /**
         * Add of update an entry in the experienceErrors array.
         */
        addOrUpdateError(errors: Array<ExperienceCheck>, id: number, title: string, station) {
            const index = errors.findIndex(error => error.id === id);

            if (index === -1) {
                errors.push({ id, title, stations: [station] });
            } else {
                const stationIndex = errors[index].stations.findIndex(stationEntry => stationEntry.id === station.id);
                if (stationIndex !== -1) {
                    errors[index].stations[stationIndex] = station;
                } else {
                    errors[index].stations.push(station);
                }
            }
        },

        /**
         * Update the experienceChecks array with any errors that were found when the installedAppliances for each
         * station were received from the NUC.
         */
        updateExperienceChecksWithErrors() {
            this.experienceErrors.forEach(experienceError => {
                const checkIndex = this.experienceChecks.findIndex(entry => entry.id == experienceError.id);
                experienceError.stations.forEach(station => {
                    this.addCheckToReportTracker("imvr", "pre_experience_checks",
                        {
                            key: experienceError.title,
                            description: ""
                        },
                        {
                            "station": true,
                            "tablet": false,
                            "nuc": false,
                            "cbus": false
                        });

                    this.updateReport(
                        "imvr",
                        "pre_experience_checks",
                        { passedStatus: "warning", checkingStatus: "timeout", message: station.message },
                        experienceError.title,
                        station.id);

                    if (checkIndex === -1) return;
                    const foundStation = this.experienceChecks[checkIndex].stations.find(entry => entry.id === station.id.toString());
                    if (!foundStation) return;

                    foundStation.status = "failed";
                    foundStation.checkingStatus = "checked";
                    foundStation.message = station.message;
                });
            });
        },

        sortExperiences(experienceList: any[]) {
            return experienceList.sort((a, b) => {
                const titleA = a.title.toLowerCase().replace(/^the /, ''); // Convert titles to lowercase for case-insensitive sorting
                const titleB = b.title.toLowerCase().replace(/^the /, '');

                if (titleA < titleB) {
                    return -1;
                } else if (titleA > titleB) {
                    return 1;
                } else {
                    return 0; // Titles are equal
                }
            });
        },

        buildExperienceChecks() {
            let stationIds = this.stations.map(station => station.getId())

            let sortedExperiences = this.experiences;
            // @ts-ignore
            if (this.reportTracker["labType"] === "Online") {
                sortedExperiences.push(...this.onlineExperiences);
            }
            sortedExperiences = this.sortExperiences(sortedExperiences);

            //Add the experiences to the reportTracker
            sortedExperiences.forEach(experience => {
                this.addCheckToReportTracker("imvr", "experience_checks",
                    {
                        key: experience.title,
                        description: ""
                    },
                    {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                });

                let stations = Array<any>()
                stationIds.forEach(stationId => {
                    if(!this.isStationVrCompatible(stationId)) return;

                    stations.push({
                        id: stationId,
                        status: null,
                        checkingStatus: "unchecked",
                        message: null
                    })
                });

                const index = this.experienceChecks.findIndex(entry => entry.id === experience.id);
                if(index === -1) {
                    this.experienceChecks.push({
                        id: experience.id,
                        title: experience.title,
                        stations: stations
                    });
                }
            });
        },

        startExperienceChecks() {
            this.allowRunningExperienceChecks = true
            if (this.experienceChecks.length === 0) {
                this.buildExperienceChecks()
            }
            this.experienceChecks[0].stations.forEach(station => {
                const index = this.stations.findIndex(s => s.id === station.id)
                //Do not attempt to run an experience if the Station is not a VR station
                if(!this.isStationVrCompatible(station.id)) return;

                if (index !== -1 && this.stations[index].vrStatuses?.openVrStatus === 'Connected') {
                    this.launchNextExperience(station.id)
                }
            })
        },

        launchNextExperience(stationId: string) {
            //find the next unpassed one
            let nextStationIndex = -1
            const alreadyChecking = (this.experienceChecks.findIndex(element => {
                nextStationIndex = element.stations.findIndex(element => element.id == stationId)
                if (nextStationIndex === -1) return false

                return element.stations[nextStationIndex].checkingStatus === "checking"
            }) !== -1)
            if (alreadyChecking) {
                return
            }
            const nextCheckIndex = this.experienceChecks.findIndex(element => {
                nextStationIndex = element.stations.findIndex(element => element.id == stationId)
                if (nextStationIndex === -1) return false

                return element.stations[nextStationIndex].checkingStatus === "unchecked"
            })

            const i = this.stations.findIndex(s => (s.getId() == stationId) && s.vrStatuses && s.vrStatuses.openVrStatus === "Connected" && s.vrStatuses.headsetStatus === "Connected")
            if (i === -1) {
                return;
            }

            this.launchExperience(nextCheckIndex, nextStationIndex)
        },

        launchExperienceOnAll(experienceIndex: number) {
            var stationIndex = 0
            this.experienceChecks[experienceIndex].stations.forEach(() => {
                this.launchExperience(experienceIndex, stationIndex)
                stationIndex++
            })
        },

        launchExperience(experienceIndex: number, stationIndex: number) {
            if (experienceIndex === -1 || stationIndex === -1) {
                return;
            }
            this.experienceChecks[experienceIndex].stations[stationIndex].checkingStatus = "checking"

            setTimeout(() => {
                useStateStore().sendMessage({
                    action: CONSTANT.ACTION.LAUNCH_EXPERIENCE,
                    actionData: {
                        stationId: this.experienceChecks[experienceIndex].stations[stationIndex].id,
                        experienceId: this.experienceChecks[experienceIndex].id
                    }
                })
            }, 3000)
            setTimeout(() => {
                if (this.experienceChecks[experienceIndex].stations[stationIndex].checkingStatus === 'checking') {
                    this.updateExperienceCheck(this.experienceChecks[experienceIndex].stations[stationIndex].id, this.experienceChecks[experienceIndex].id.toString(), "failed", "Timed out waiting for response")
                }
            }, 55000 + 3000)
        },

        updateExperienceCheck(stationId: string, experienceId: string, status: string, message: string) {
            const index = this.experienceChecks.findIndex(element => element.id.toString() == experienceId);
            if (index === -1) {
                return;
            }
            const stationIndex = this.experienceChecks[index].stations.findIndex(element => element.id == stationId);
            if (index === -1) {
                return;
            }
            this.experienceChecks[index].stations[stationIndex].status = status
            this.experienceChecks[index].stations[stationIndex].message = message

            //Update the report tracker
            this.updateReport(
                "imvr",
                "experience_checks",
                { passedStatus: status, message: message },
                this.experienceChecks[index].title,
                stationId);

            if (message.includes('Timed out')) {
                this.experienceChecks[index].stations[stationIndex].checkingStatus = "timeout";
            } else if (status === "passed" || status === "failed" || status === "warning") {
                this.experienceChecks[index].stations[stationIndex].checkingStatus = "checked";
            }

            if (!this.allowRunningExperienceChecks) {
                return;
            }

            this.launchNextExperience(stationId);
        },

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

        /**
         * Check if a Station is set to VR mode and has sent confirmation of it's details.
         * @param stationId
         */
        isStationVrCompatible(stationId: string): boolean {
            //If the station is not in VR mode return
            const index = this.stations.findIndex(element => element.getId() == stationId)
            if (index === -1) return false; //Station does not exist - do not continue regardless
            const station = this.stations[index];

            return !(station.details == null || station.details.stationMode !== "vr");
        },

        /**
         * Check if a Station should be set to VR mode.
         * @param stationId
         */
        shouldStationBeVrCompatible(stationId: string): boolean {
            //If the station is not in VR mode return
            const index = this.stations.findIndex(element => element.getId() == stationId)
            if (index === -1) return false; //Station does not exist - do not continue regardless
            const station = this.stations[index];

            return !(station.expectedDetails == null || station.expectedDetails.stationMode !== "vr");
        }
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

        experienceChecksCompleted(state) {
            return state.experienceChecks.filter(check => {
                return check.stations.filter(station => station.checkingStatus !== 'checking' && station.status !== null).length === 0
            }).length === 0
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
