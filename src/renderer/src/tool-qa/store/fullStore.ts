import { defineStore } from 'pinia';
import { Appliance, QaCheck, QaDetail, ReportTrackerItem, Station, Tablet } from "../interfaces";
import { Station as StationClass } from '../types/_station'
import { QaGroup } from "../types/_qaGroup";
import { QaCheckResult } from "../types/_qaCheckResult";
import * as CONSTANT from "../../assets/constants";
import { useStateStore } from "./stateStore";

/**
 * Used to store values for the Lab's Full Check method only.
 */
export const useFullStore = defineStore({
    id: 'full',
    state: () => ({
        connected: false,
        //Compared against the number of Station's contacted
        numberOfStations: 0,
        //The IP address entered by a user that should be the NUC
        nucAddress: '',
        mostRecentAutoCheck: '',
        //List of the Station detail's from the NUC
        qaChecks: Array<QaCheck>(),
        qaDetails: Array<QaDetail>(),
        stations: Array<StationClass>(),
        //Track the progress of the checks as an overall report object - populated in App.vue
        reportTracker: {} as ReportTrackerItem,
        //Can the NUC contact the CBus unit
        cbusConnection: "Loading",
        //List of appliance objects
        ApplianceList: Array<Appliance>(),
        tablets: Array<Tablet>(),

        experienceChecks: Array<any>(),

        qaGroups: [] as Array<QaGroup>
    }),
    actions: {
        buildExperienceChecks() {
            let stationIds = this.stations.map(station => station.getId())

            //todo - build out proper list based on tier selection
            let experiences = [
                {
                    id: 346900,
                    title: "AdVenture Capitalist"
                },
                {
                    id: 512270,
                    title: "Home - A VR Spacewalk"
                },
                {
                    id: 2499150,
                    title: "Aonar"
                },
                {
                    id: 513490,
                    title: "1943 Berlin Blitz"
                },
                {
                    id: 1404360,
                    title: "A Shopping Trip to Eklan Tor"
                }
            ]

            experiences.forEach(experience => {
                let stations = Array<any>()
                stationIds.forEach(stationId => {
                    stations.push({
                        id: stationId,
                        status: "unchecked",
                        message: null
                    })
                })
                this.experienceChecks.push({
                    id: experience.id,
                    title: experience.title,
                    stations: stations
                })
            })
        },

        startExperienceChecks() {
            if (this.experienceChecks.length === 0) {
                this.buildExperienceChecks()
            }
            var index = 0
            this.experienceChecks[0].stations.forEach(station => {
                const i = this.stations.findIndex(s => (station.id == s.getId()) && s.vrStatuses && s.vrStatuses.openVrStatus === "Connected" && s.vrStatuses.headsetStatus === "Connected")
                if (i === -1) {
                    return;
                }

                this.experienceChecks[0].stations[index].status === "checking"
                this.sendMessage({
                    action: CONSTANT.ACTION.LAUNCH_EXPERIENCE,
                    actionData: {
                        stationId: station.id,
                        experienceId: this.experienceChecks[0].id
                    }
                })
                index++
            })
        },

        updateExperienceCheck(stationId: string, experienceId: string, status: string, message: string) {
            const index = this.experienceChecks.findIndex(element => element.id == experienceId);
            if (index === -1) {
                return;
            }
            const stationIndex = this.experienceChecks[index].stations.findIndex(element => element.id == stationId);
            if (index === -1) {
                return;
            }
            this.experienceChecks[index].stations[stationIndex].status = status
            this.experienceChecks[index].stations[stationIndex].message = message

            if (status === "passed" || status === "failed") {
                //find the next unpassed one
                let nextStationIndex = -1
                const nextCheckIndex = this.experienceChecks.findIndex(element => {
                    nextStationIndex = element.stations.findIndex(element => element.id == stationId)
                    if (index === -1) return false

                    return element.stations[nextStationIndex].status === "unchecked"
                })

                const i = this.stations.findIndex(s => (s.getId() == stationId) && s.vrStatuses && s.vrStatuses.openVrStatus === "Connected" && s.vrStatuses.headsetStatus === "Connected")
                if (i === -1) {
                    return;
                }

                this.experienceChecks[nextCheckIndex].stations[nextStationIndex].status = "checking"


                this.sendMessage({
                    action: CONSTANT.ACTION.LAUNCH_EXPERIENCE,
                    actionData: {
                        stationId: this.experienceChecks[nextCheckIndex].stations[nextStationIndex].id,
                        experienceId: this.experienceChecks[nextCheckIndex].id
                    }
                })
            }
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
            const stationIsConnected = new QaCheckResult("station_is_connected", "auto", 10000, stationIds, false, false, [], "Station is connected to NUC")
            stationConnectionChecks.checks.push(stationIsConnected)

            const windowsChecks = new QaGroup("windows_checks")
            const wakeOnLAN = new QaCheckResult("magic_packet_enabled", "auto", 10000, stationIds, false, false, [], "Wake On LAN", "Wake on Magic Packet is enabled")
            const amdInstalled = new QaCheckResult("amd_installed", "auto", 10000, stationIds, false, false, [], "AMD Installed", "Is AMD software installed")
            const envVariable = new QaCheckResult("openssl_environment", "auto", 10000, stationIds, false, false, [], "OPENSSL ENV", "Is OPENSSL_ia32cap set in environment variables")
            const wallpaper = new QaCheckResult("wallpaper_is_set", "auto", 10000, stationIds, false, false, [], "Wallpaper", "Is the Lumination wallpaper set")
            const timezone = new QaCheckResult("timezone_correct", "auto", 10000, stationIds, false, false, [], "Timezone", "Has the time zone been set to the correct location")
            const dateTime = new QaCheckResult("correct_datetime", "auto", 10000, stationIds, false, false, [], "Time & Date", "Is the date and time set correctly")
            windowsChecks.checks.push(wakeOnLAN, amdInstalled, envVariable, wallpaper, timezone, dateTime);

            const softwareChecks = new QaGroup("software_checks")
            const setvolInstalled = new QaCheckResult("setvol_installed", "auto", 10000, stationIds, false, false, [], "SetVol Installed", "SetVol is installed at the correct location")
            const steamcmdInstalled = new QaCheckResult("steamcmd_installed", "auto", 10000, stationIds, false, false, [], "SteamCMD Installed", "SteamCMD is installed at the correct location")
            const steamcmdInitialised = new QaCheckResult("steamcmd_initialised", "auto", 10000, stationIds, false, false, [], "SteamCMD Initialised", "SteamCMD is initialised with user details")
            const steamcmdConfigured = new QaCheckResult("steamcmd_configured", "auto", 10000, stationIds, false, false, [], "SteamCMD Configured", "SteamCMD has Steam Guard detail or does not need them")
            softwareChecks.checks.push(setvolInstalled, steamcmdInstalled, steamcmdInitialised, steamcmdConfigured)
            softwareChecks.requirements = ["station_connection_checks", "steam_config_checks.steam_username", "steam_config_checks.steam_password", "steam_config_checks.steam_initialized"]

            const steamConfigChecks = new QaGroup("steam_config_checks")
            const isSteamUserNameSet = new QaCheckResult("steam_username", "auto", 10000, stationIds, false, false, [], "Steam Username is set")
            const isSteamPasswordSet = new QaCheckResult("steam_password", "auto", 10000, stationIds, false, false, [], "Steam Password is set")
            const isSteamInitialized = new QaCheckResult("steam_initialized", "auto", 10000, stationIds, false, false, [], "Steam initialised", "Steam has been logged into at least once")
            const isFriendsSettingDisabled = new QaCheckResult("friends_setting", "auto", 10000, stationIds, false, false, [], "Steam friends setting disabled")
            const isDownloadRegionSetCorrectly = new QaCheckResult("download_region", "auto", 10000, stationIds, false, false, [], "Steam download region is correct")
            const isCloudEnabledOff = new QaCheckResult("cloud_disabled", "auto", 10000, stationIds, false, false, [], "Steam cloud is disabled")
            const isDefaultPageSetToLibrary = new QaCheckResult("default_page_library", "auto", 10000, stationIds, false, false, [], "Steam default page is library")
            const skipOfflineWarning = new QaCheckResult("skip_offline_warning", "auto", 10000, stationIds, false, false, [], "Steam can skip offline warning")
            const allowAutoLogin = new QaCheckResult("allow_auto_login", "auto", 10000, stationIds, false, false, [], "Steam allows auto login")
            const wantsOfflineMode = new QaCheckResult("wants_offline_mode", "auto", 10000, stationIds, false, false, [], "Steam offline mode is configured correctly")
            const homeAppDisabled = new QaCheckResult("home_app_disabled", "auto", 10000, stationIds, false, false, [], "Steam home app is disabled")
            const controllerTimeoutSetToZero = new QaCheckResult("controller_timeout_set_to_zero", "auto", 10000, stationIds, false, false, [], "SteamVR controller timeout set to never")
            const screenTimeoutSetTo1800 = new QaCheckResult("screen_timeout_set_to_1800", "auto", 10000, stationIds, false, false, [], "SteamVR screen timeout set to 30 minutes")
            const pauseCompositorSetToFalse = new QaCheckResult("pause_compositor_set_to_false", "auto", 10000, stationIds, false, false, [], "SteamVR compositor pause set to off")
            const steamVrDashboardDisabled = new QaCheckResult("steamvr_dashboard_disabled", "auto", 10000, stationIds, false, false, [], "SteamVR dashboard is disabled")
            const steamVrStatusNotOnTop = new QaCheckResult("steamvr_status_not_on_top", "auto", 10000, stationIds, false, false, [], "SteamVR status is set to not display on top")
            steamConfigChecks.checks.push(isSteamUserNameSet, isSteamPasswordSet, isSteamInitialized, isFriendsSettingDisabled, isDownloadRegionSetCorrectly, isCloudEnabledOff, isDefaultPageSetToLibrary, skipOfflineWarning, allowAutoLogin, wantsOfflineMode, homeAppDisabled, controllerTimeoutSetToZero, screenTimeoutSetTo1800, pauseCompositorSetToFalse, steamVrDashboardDisabled, steamVrStatusNotOnTop)
            steamConfigChecks.requirements = ["station_connection_checks"]

            this.qaGroups = [stationConnectionChecks, windowsChecks, softwareChecks, steamConfigChecks];
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
            const groupsToStart = this.qaGroups.filter(group => !group.started).filter(group => {
                return (group.requirements.filter(r => !allCompletedIds.includes(r)).length === 0)
            }).map(group => group.id)
            return groupsToStart
        },

        updateQaChecks(stationId, groupName, qaChecks) {
            let index = this.qaGroups.findIndex(group => group.id === groupName)
            if (index !== -1) {
                this.qaGroups[index].updateQaChecks(stationId, qaChecks)
            }
        },

        startQa(groupId) {
            let index = this.qaGroups.findIndex(group => group.id === groupId)
            if (index !== -1) {
                this.qaGroups[index].startQa()
            }
        },

        tabletConnected (ipAddress: string) {
            const index = this.tablets.findIndex(element => element.ipAddress === ipAddress)
            if (index === -1) {
                this.tablets.push({
                    ipAddress,
                    connected: true,
                    connecting: false
                })
            }
            if (index !== -1 && this.tablets[index].connected === false) {
                this.tablets[index].connected = true
                this.tablets[index].connecting = false
            }
        },

        addUnconnectedTablet(ipAddress: string) {
            const index = this.tablets.findIndex(element => element.ipAddress === ipAddress)
            if (index === -1) {
                this.tablets.push({
                    ipAddress,
                    connected: false,
                    connecting: true
                })
                setTimeout(() => {
                    const index = this.tablets.findIndex(element => element.ipAddress === ipAddress)
                    if (index !== -1) {
                        this.tablets[index].connecting = false
                    }
                })
            }
        },

        sendMessage(messageData: { action: string, actionData: any }) {
            const stateStore = useStateStore()
            const processedData = {
                qaToolAddress: stateStore.getServerDetails,
                ...messageData
            }
            // @ts-ignore api is injected
            api.ipcRenderer.send(CONSTANT.CHANNEL.HELPER_CHANNEL, {
                channelType: CONSTANT.CHANNEL.TCP_CLIENT_CHANNEL,
                key: stateStore.key,
                address: this.nucAddress,
                port: 55556,
                data: CONSTANT.MESSAGE.QA_LEAD_TEXT + ":" + JSON.stringify(processedData)
            });
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
                address: station.expectedDetails.ipAddress,
                port: 55557,
                data: CONSTANT.MESSAGE.QA_LEAD_TEXT + ":" + JSON.stringify(processedData)
            });
        },

        stationConnected (expectedStationId: string, stationData: any) {
            const index = this.stations.findIndex(element => element.expectedDetails.id === expectedStationId)
            console.log(index, expectedStationId)
            this.stations[index].details = {
                ipAddress: stationData.ipAddress,
                nucIpAddress: stationData.nucAddress,
                labLocation: stationData.labLocation,
                name: null,
                installedApplications: null,
                id: stationData.id + "",
                room: stationData.room,
                macAddress: stationData.macAddress,
                ledRingId: null
            }
        },
    },
    getters: {
        getCbusConnection(state) {
            return state.cbusConnection;
        }
    }
});
