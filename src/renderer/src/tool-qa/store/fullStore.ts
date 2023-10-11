import * as CONSTANT from "../../assets/constants";
import { defineStore } from 'pinia';
import { Appliance, QaCheck, QaDetail, Tablet } from "../interfaces";
import { Station as StationClass } from '../types/_station'
import { QaGroup } from "../types/_qaGroup";
import { QaCheckResult } from "../types/_qaCheckResult";
import { useStateStore } from "./stateStore";
import { Report } from "../interfaces/_report";

/**
 * Used to store values for the Lab's Full Check method only.
 */
export const useFullStore = defineStore({
    id: 'full',
    state: () => ({
        //Track the progress of the checks as an overall report object
        reportTracker: {} as Report,
        //Track all connected devices
        deviceMap: [
            { id: 'NUC', prefix: '', type: 'nuc', checks: {} },
            { id: 'C-Bus', prefix: '', type: 'cbus', checks: {}}
        ],
        connected: false,
        //Compared against the number of Station's contacted
        numberOfStations: 0,
        //The most progress a user has made
        maxProgress: 0,
        //The IP address entered by a user that should be the NUC
        nucAddress: '',
        mostRecentAutoCheck: '',
        //List of the Station detail's from the NUC
        qaChecks: Array<QaCheck>(),
        qaDetails: Array<QaDetail>(),
        stations: Array<StationClass>(),
        //Can the NUC contact the CBus unit
        cbusConnection: "Loading",
        //List of appliance objects
        ApplianceList: Array<Appliance>(),
        tablets: Array<Tablet>(),
        experienceChecks: Array<any>(),
        qaGroups: [] as Array<QaGroup>,
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

            const networkChecks = new QaGroup("network_checks", "network")
            const defaultGateway = new QaCheckResult("default_gateway_is_correct", "auto", 10000, stationIds, true, false, [], "Default Gateway", "Checks that the default gateway is set based on the default setting")
            const dnsServer = new QaCheckResult("dns_server_is_correct", "auto", 10000, stationIds, true, false, [], "DNS Server", "Checks that the DNS server is set based on the default setting")
            const altDnsServer = new QaCheckResult("alt_dns_server_is_correct", "auto", 10000, stationIds, true, false, [], "Alt. DNS Server", "Checks that the alternate DNS server is set based on the default setting")
            const staticIpAddress = new QaCheckResult("static_ip_is_default", "auto", 10000, stationIds, true, false, [], "Static IP", "Checks that the static IP address is set based on the default setting")
            const allowedThroughFirewall = new QaCheckResult("allowed_through_firewall", "auto", 10000, stationIds, true, false, [], "Firewall", "Checks that the NUC/Station software is allowed through the firewall")
            const launcherAllowedThroughFirewall = new QaCheckResult("launcher_allowed_through_firewall", "auto", 10000, stationIds, true, false, [], "Launcher firewall", "Checks that the launcher software is allowed through the firewall")
            const nucCanAccessNucHosting = new QaCheckResult("can_access_nuc_hosting", "auto", 10000, [], true, false, [], "Access NUC Hosting", "Checks that we can access the NUC hosting server")
            const stationCanAccessStationHosting = new QaCheckResult("can_access_station_hosting", "auto", 10000, stationIds, false, false, [], "Access Station Hosting", "Checks that we can access the station hosting server")
            const canAccessLauncherHosting = new QaCheckResult("can_access_launcher_hosting", "auto", 10000, stationIds, true, false, [], "Access Launcher Hosting", "Checks that we can access the launcher hosting server")
            const milesightNotDefaultPassword = new QaCheckResult("milesight_not_default_password", "auto", 10000, [], true, false, [], "Milesight not default", "Checks that the milesight router is not set with the default password")
            networkChecks.checks.push(defaultGateway, dnsServer, altDnsServer, staticIpAddress, allowedThroughFirewall, launcherAllowedThroughFirewall, nucCanAccessNucHosting, stationCanAccessStationHosting, canAccessLauncherHosting, milesightNotDefaultPassword)
            networkChecks.requirements = ["station_connection_checks"]

            const windowsChecks = new QaGroup("windows_checks", "windows")
            const wakeOnLAN = new QaCheckResult("magic_packet_enabled", "auto", 10000, stationIds, true, false, [], "Wake On LAN", "Wake on Magic Packet is enabled")
            const envVariable = new QaCheckResult("openssl_environment", "auto", 10000, stationIds, false, false, [], "OPENSSL ENV", "Is OPENSSL_ia32cap set in environment variables")
            const wallpaper = new QaCheckResult("wallpaper_is_set", "auto", 10000, stationIds, false, false, [], "Wallpaper", "Is the Lumination wallpaper set")
            const timezone = new QaCheckResult("timezone_correct", "auto", 10000, stationIds, true, false, [], "Timezone", "Has the time zone been set to the correct location")
            const dateTime = new QaCheckResult("correct_datetime", "auto", 10000, stationIds, true, false, [], "Time & Date", "Is the date and time set correctly")
            const taskScheduler = new QaCheckResult("task_scheduler_created", "auto", 10000, stationIds, true, false, [], "Task scheduler", "Task scheduler is correctly setup")
            const oldTaskScheduler = new QaCheckResult("old_task_scheduler_not_existing", "auto", 10000, stationIds, true, false, [], "Old task scheduler", "Old task scheduler is gone")
            const cbusScriptId = new QaCheckResult("cbus_script_id", "auto", 10000, [], true, false, [], "CBus script id", "CBus script id is correctly set")
            windowsChecks.checks.push(wakeOnLAN, envVariable, wallpaper, timezone, dateTime, taskScheduler, oldTaskScheduler, cbusScriptId);

            const softwareChecks = new QaGroup("software_checks", "software")
            const amdInstalled = new QaCheckResult("amd_installed", "auto", 20000, stationIds, false, false, [], "AMD Installed", "Is AMD software installed")
            const setvolInstalled = new QaCheckResult("setvol_installed", "auto", 20000, stationIds, false, false, [], "SetVol Installed", "SetVol is installed at the correct location")
            const steamcmdInstalled = new QaCheckResult("steamcmd_installed", "auto", 20000, stationIds, false, false, [], "SteamCMD Installed", "SteamCMD is installed at the correct location")
            const steamcmdInitialised = new QaCheckResult("steamcmd_initialised", "auto", 20000, stationIds, false, false, [], "SteamCMD Initialised", "SteamCMD is initialised with user details")
            const steamcmdConfigured = new QaCheckResult("steamcmd_configured", "auto", 20000, stationIds, false, false, [], "SteamCMD Configured", "SteamCMD has Steam Guard detail or does not need them")
            const steamGuardDisabled = new QaCheckResult("steam_guard_disabled", "auto", 20000, stationIds, false, false, [], "Steam guard disabled", "Steam Guard has been disabled")
            const driverEasyNotInstalled = new QaCheckResult("drivereasy_not_installed", "auto", 20000, stationIds, true, false, [], "DriverEasy", "DriverEasy is not installed")
            const nvidiaNotInstalled = new QaCheckResult("nvidia_not_installed", "auto", 20000, stationIds, true, false, [], "NVidia", "No NVidia programs are installed")
            softwareChecks.checks.push(setvolInstalled, amdInstalled, steamGuardDisabled, steamcmdInstalled, steamcmdInitialised, steamcmdConfigured, driverEasyNotInstalled, nvidiaNotInstalled)
            softwareChecks.requirements = ["station_connection_checks", "steam_config_checks.steam_username", "steam_config_checks.steam_password", "steam_config_checks.steam_initialized"]

            const securityChecks = new QaGroup("security_checks", "security")
            const cbusPasswordComplexity = new QaCheckResult("cbus_password_complexity", "auto", 10000, [], true, false, [], "CBus password complexity", "Is CBus password complex enough?")
            securityChecks.checks.push(cbusPasswordComplexity)
            securityChecks.requirements = ["station_connection_checks"]

            const steamConfigChecks = new QaGroup("steam_config_checks", "software")
            const isSteamUserNameSet = new QaCheckResult("steam_username", "auto", 10000, stationIds, false, false, [], "Steam Username is set")
            const isSteamPasswordSet = new QaCheckResult("steam_password", "auto", 10000, stationIds, false, false, [], "Steam Password is set")
            const isSteamPasswordComplex = new QaCheckResult("steam_password_complexity", "auto", 10000, stationIds, false, false, [], "Steam Password is complex enough")
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
            steamConfigChecks.checks.push(isSteamUserNameSet, isSteamPasswordSet, isSteamPasswordComplex, isSteamInitialized, isFriendsSettingDisabled, isDownloadRegionSetCorrectly, isCloudEnabledOff, isDefaultPageSetToLibrary, skipOfflineWarning, allowAutoLogin, wantsOfflineMode, homeAppDisabled, controllerTimeoutSetToZero, screenTimeoutSetTo1800, pauseCompositorSetToFalse, steamVrDashboardDisabled, steamVrStatusNotOnTop)
            steamConfigChecks.requirements = ["station_connection_checks"]

            this.qaGroups = [stationConnectionChecks, networkChecks, securityChecks, windowsChecks, softwareChecks, steamConfigChecks];
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

        startQa(groupId) {
            let index = this.qaGroups.findIndex(group => group.id === groupId)
            if (index !== -1) {
                this.qaGroups[index].startQa()
                const group = this.qaGroups[index]
                this.sendMessage({
                    action: CONSTANT.ACTION.RUN_STATION_GROUP,
                    actionData: {
                        group: group.id,
                        stationIds: ['all'] // todo, method for this
                    }
                })

                this.sendMessage({
                    action: CONSTANT.ACTION.RUN_NUC_GROUP,
                    actionData: {
                        group: group.id
                    }
                })

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
                this.addDevice(ipAddress, 'tablet');
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
                });
                this.addDevice(ipAddress, 'tablet');
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
                installedApplications: null,
                id: stationData.id + "",
                room: stationData.room,
                macAddress: stationData.macAddress,
                ledRingId: null
            }
        },

        /**
         * Add a device to the deviceMap if it does not already exist.
         * @param id
         * @param type
         */
        addDevice(id: string, type: string) {
            const index = this.deviceMap.findIndex(item => item.id === id);
            if(index === -1) {
                this.deviceMap.push({
                    id: id,
                    prefix: type === 'station' ? 'S' : 'T', //Assumes only stations or tablets are added
                    type: type,
                    checks: {}
                });
            }
        },

        /**
         * Add a check with its associated information to the report tracker
         * @param parent
         * @param page
         * @param check
         * @param targetDevices
         */
        addCheckToReportTracker(parent: string, page: string, check, targetDevices: {}) {
            const checkKey = check.key;
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
            const mapDevice = this.deviceMap.find(device => device.id === deviceId);
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
        }
    },
    getters: {
        getCbusConnection(state) {
            return state.cbusConnection;
        },
        connectedTabletCount(state) {
            return state.tablets.filter(tablet => tablet.connected).length
        },
        /**
         * Order the devices from the fullStore.deviceMap into a constant order based
         * on the device type.
         */
        orderedDevices(state) {
            const typeOrder: { [key: string]: number } = { 'station': 0, 'tablet': 1, 'nuc': 2, 'cbus': 3 };
            return state.deviceMap.sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
        }
    }
});
