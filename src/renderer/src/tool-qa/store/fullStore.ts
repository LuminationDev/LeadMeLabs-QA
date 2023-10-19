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
        online: true,
        uploadFileResult: false,
        //Track the progress of the checks as an overall report object
        reportTracker: {} as Report,
        //Track all connected devices
        deviceMap: [
            { id: 'NUC', prefix: '', type: 'nuc', checks: {} },
            { id: 'C-Bus', prefix: '', type: 'cbus', checks: {}}
        ],
        allowRunningExperienceChecks: false,
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

            let experiences = [
                {
                    id: 348250,
                    title: "Google Earth VR"
                },
                {
                    id: 871620,
                    title: "Volcano Eruption"
                },
                {
                    id: 327140,
                    title: "Tilt Brush"
                },
                {
                    id: 1514840,
                    title: "All-In-One Sports VR"
                },
                {
                    id: 861400,
                    title: "Nefertari: Journey to Eternity"
                },
                {
                    id: 1424190,
                    title: "Curious Alice"
                },
                {
                    id: 1029110,
                    title: "Trash Time"
                },
                {
                    id: 1494670,
                    title: "Space Dance Harmony"
                },
                {
                    id: 751110,
                    title: "Overview: A Walk Through The Universe"
                },
                {
                    id: 533970,
                    title: "Blocks by Google"
                },
                {
                    id: 607590,
                    title: "Earthquake Simulator"
                },
                {
                    id: 1245640,
                    title: "The Book of Distance"
                },
                {
                    id: 972510,
                    title: "Thingamajig"
                },
                {
                    id: 629040,
                    title: "Skytropolis"
                },
                {
                    id: 653930,
                    title: "Tiny Town VR"
                },
                {
                    id: 1141930,
                    title: "Mondly"
                },
                {
                    id: 746560,
                    title: "Gadgeteer"
                },
                {
                    id: 1532110,
                    title: "Curatours"
                },
                {
                    id: 880270,
                    title: "Geogebra"
                },
                {
                    id: 1172310,
                    title: "Mona Lisa: Beyond the Glass"
                },
                {
                    id: 512270,
                    title: "Home - A VR Spacewalk"
                },
                {
                    id: 1308470,
                    title: "Journey to the Centre of the Cell"
                },
                {
                    id: 1165850,
                    title: "IL DIVINO: Michaelangelo's Sistene Ceiling in VR"
                },
                {
                    id: 612030,
                    title: "Harvest Simulator"
                },
                {
                    id: 513490,
                    title: "1943 Berlin Blitz"
                },
                {
                    id: 476540,
                    title: "Google Spotlight Stories: Pearl"
                },
                {
                    id: 515020,
                    title: "The VR Museum of Fine Art"
                },
                {
                    id: 482390,
                    title: "The Night Cafe"
                },
                {
                    id: 570540,
                    title: "Amazon Odyssey"
                },
                {
                    id: 504650,
                    title: "Masterpiece VR"
                },
                {
                    id: 878620,
                    title: "Neotrie VR"
                },
                {
                    id: 508250,
                    title: "Aussie Sports VR"
                },
                {
                    id: 1046910,
                    title: "Dissection Simulator: Frog Edition"
                },
                {
                    id: 1053760,
                    title: "Arkio"
                },
                {
                    id: 1236560,
                    title: "The Dawn of Art"
                },
                {
                    id: 422760,
                    title: "Ocean Rift"
                },
                {
                    id: 1379970,
                    title: "Solar System VR"
                },
                {
                    id: 547280,
                    title: "Calcflow"
                },
                {
                    id: 970800,
                    title: "Short Ciruit VR"
                },
                {
                    id: 1511090,
                    title: "Great Paintings VR"
                },
                {
                    id: 542170,
                    title: "Edmersiv"
                },
                {
                    id: 1614850,
                    title: "Colosseum VR"
                },
                {
                    id: 1564310,
                    title: "Materials VR"
                },
                {
                    id: 1331260,
                    title: "iB Cricket"
                },
                {
                    id: 1788300,
                    title: "Robotics in VR"
                },
                {
                    id: 451980,
                    title: "The Body VR: Journey Inside the Cell"
                },
                {
                    id: 812610,
                    title: "Escape Architect VR"
                },
                {
                    id: 1462520,
                    title: "BRINK Traveler"
                },
                {
                    id: 587580,
                    title: "Nature Treks VR"
                },
                {
                    id: 572630,
                    title: "Lyra VR"
                },
                {
                    id: 1282770,
                    title: "Virtual Presenter Pro"
                },
                {
                    id: 696760,
                    title: "HoloLab Champions"
                }
            ]

            //Add the experiences to the reportTracker

            experiences.forEach(experience => {
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
                    stations.push({
                        id: stationId,
                        status: null,
                        checkingStatus: "unchecked",
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
            this.allowRunningExperienceChecks = true
            if (this.experienceChecks.length === 0) {
                this.buildExperienceChecks()
            }
            this.experienceChecks[0].stations.forEach(station => {
                this.launchNextExperience(station.id)
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
            this.experienceChecks[experienceIndex].stations[stationIndex].checkingStatus = "checking"

            setTimeout(() => {
                this.sendMessage({
                    action: CONSTANT.ACTION.LAUNCH_EXPERIENCE,
                    actionData: {
                        stationId: this.experienceChecks[experienceIndex].stations[stationIndex].id,
                        experienceId: this.experienceChecks[experienceIndex].id
                    }
                })
            }, 3000)
            setTimeout(() => {
                if (this.experienceChecks[experienceIndex].stations[stationIndex].checkingStatus === 'checking') {
                    this.updateExperienceCheck(this.experienceChecks[experienceIndex].stations[stationIndex].id, this.experienceChecks[experienceIndex].id, "failed", "Timed out waiting for response")
                }
            }, 35000 + 3000)
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

            //Update the report tracker
            this.updateReport(
                "imvr",
                "experience_checks",
                { passedStatus: status, message: message },
                this.experienceChecks[index].title,
                stationId);

            if (status === "passed" || status === "failed") {
                this.experienceChecks[index].stations[stationIndex].checkingStatus = "checked"
                if (!this.allowRunningExperienceChecks) {
                    return
                }
                this.launchNextExperience(stationId)
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
            const stationIsConnected = new QaCheckResult("station_is_connected", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Station is connected to NUC")
            stationConnectionChecks.checks.push(stationIsConnected)

            const networkChecks = new QaGroup("network_checks", "network")
            const defaultGateway = new QaCheckResult("default_gateway_is_correct", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Default Gateway", "Checks that the default gateway is set based on the default setting")
            const dnsServer = new QaCheckResult("dns_server_is_correct", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "DNS Server", "Checks that the DNS server is set based on the default setting")
            const altDnsServer = new QaCheckResult("alt_dns_server_is_correct", "auto", 10000,{station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Alt. DNS Server", "Checks that the alternate DNS server is set based on the default setting")
            const staticIpAddress = new QaCheckResult("static_ip_is_default", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Static IP", "Checks that the static IP address is set based on the default setting")
            const allowedThroughFirewall = new QaCheckResult("allowed_through_firewall", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Firewall", "Checks that the NUC/Station software is allowed through the firewall")
            const launcherAllowedThroughFirewall = new QaCheckResult("launcher_allowed_through_firewall", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Launcher firewall", "Checks that the launcher software is allowed through the firewall")
            const nucCanAccessNucHosting = new QaCheckResult("can_access_nuc_hosting", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, [], [], "Access NUC Hosting", "Checks that we can access the NUC hosting server")
            const stationCanAccessStationHosting = new QaCheckResult("can_access_station_hosting", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Access Station Hosting", "Checks that we can access the station hosting server")
            const canAccessLauncherHosting = new QaCheckResult("can_access_launcher_hosting", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds,  [], "Access Launcher Hosting", "Checks that we can access the launcher hosting server")
            const milesightNotDefaultPassword = new QaCheckResult("milesight_not_default_password", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, [], [], "Milesight not default", "Checks that the milesight router is not set with the default password")
            const canReachPlayStore = new QaCheckResult("can_reach_play_store", "auto", 10000, {station: false, tablet: true, nuc: false, cbus: false}, [], this.getConnectedTabletIpAddresses, "Can reach play store", "Tablet can reach play store through the network")
            const canReachAnalytics = new QaCheckResult("can_reach_analytics", "auto", 10000, {station: false, tablet: true, nuc: false, cbus: false}, [], this.getConnectedTabletIpAddresses, "Can reach analytics", "Tablet can reach analytics through the network")
            const canReachSentry = new QaCheckResult("can_reach_sentry", "auto", 10000, {station: false, tablet: true, nuc: false, cbus: false}, [], this.getConnectedTabletIpAddresses, "Can reach sentry", "Tablet can reach sentry through the network")
            const canReachSteamStatic = new QaCheckResult("can_reach_steam_static", "auto", 10000, {station: false, tablet: true, nuc: false, cbus: false}, [], this.getConnectedTabletIpAddresses, "Can reach steam static", "Tablet can reach steam static through the network")
            networkChecks.checks.push(defaultGateway, dnsServer, altDnsServer, staticIpAddress, allowedThroughFirewall, launcherAllowedThroughFirewall, nucCanAccessNucHosting, stationCanAccessStationHosting, canAccessLauncherHosting, milesightNotDefaultPassword, canReachPlayStore, canReachAnalytics, canReachSentry, canReachSteamStatic)
            networkChecks.requirements = ["station_connection_checks"]

            const windowsChecks = new QaGroup("windows_checks", "windows")
            const wakeOnLAN = new QaCheckResult("magic_packet_enabled", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Wake On LAN", "Wake on Magic Packet is enabled")
            const envVariable = new QaCheckResult("openssl_environment", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "OPENSSL ENV", "Is OPENSSL_ia32cap set in environment variables")
            const wallpaper = new QaCheckResult("wallpaper_is_set", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Wallpaper", "Is the Lumination wallpaper set")
            const timezone = new QaCheckResult("timezone_correct", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Timezone", "Has the time zone been set to the correct location")
            const dateTime = new QaCheckResult("correct_datetime", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Time & Date", "Is the date and time set correctly")
            const taskScheduler = new QaCheckResult("task_scheduler_created", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Task scheduler", "Task scheduler is correctly setup")
            const oldTaskScheduler = new QaCheckResult("old_task_scheduler_not_existing", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Old task scheduler", "Old task scheduler is gone")
            const cbusScriptId = new QaCheckResult("cbus_script_id", "auto", 10000, {station: false, tablet: false, nuc: true, cbus: false},[], [], "CBus script id", "CBus script id is correctly set")
            windowsChecks.checks.push(wakeOnLAN, envVariable, wallpaper, timezone, dateTime, taskScheduler, oldTaskScheduler, cbusScriptId);

            const softwareChecks = new QaGroup("software_checks", "software")
            const amdInstalled = new QaCheckResult("amd_installed", "auto", 20000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "AMD Installed", "Is AMD software installed")
            const setvolInstalled = new QaCheckResult("setvol_installed", "auto", 20000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SetVol Installed", "SetVol is installed at the correct location")
            const steamcmdInstalled = new QaCheckResult("steamcmd_installed", "auto", 20000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamCMD Installed", "SteamCMD is installed at the correct location")
            const steamcmdInitialised = new QaCheckResult("steamcmd_initialised", "auto", 20000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamCMD Initialised", "SteamCMD is initialised with user details")
            const steamcmdConfigured = new QaCheckResult("steamcmd_configured", "auto", 20000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamCMD Configured", "SteamCMD has Steam Guard detail or does not need them")
            const steamGuardDisabled = new QaCheckResult("steam_guard_disabled", "auto", 60000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam guard disabled", "Steam Guard has been disabled")
            const driverEasyNotInstalled = new QaCheckResult("drivereasy_not_installed", "auto", 20000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "DriverEasy", "DriverEasy is not installed")
            const nvidiaNotInstalled = new QaCheckResult("nvidia_not_installed", "auto", 20000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "NVidia", "No NVidia programs are installed")
            softwareChecks.checks.push(setvolInstalled, amdInstalled, steamGuardDisabled, steamcmdInstalled, steamcmdInitialised, steamcmdConfigured, driverEasyNotInstalled, nvidiaNotInstalled)
            softwareChecks.requirements = ["station_connection_checks", "steam_config_checks.steam_username", "steam_config_checks.steam_password", "steam_config_checks.steam_initialized"]

            const securityChecks = new QaGroup("security_checks", "security")
            const cbusPasswordComplexity = new QaCheckResult("cbus_password_complexity", "auto", 10000, {station: false, tablet: false, nuc: true, cbus: false},  [], [], "CBus password complexity", "Is CBus password complex enough?")
            const appAppToDate = new QaCheckResult("app_up_to_date", "auto", 10000, {station: false, tablet: true, nuc: false, cbus: false}, [], this.getConnectedTabletIpAddresses, "App up to date", "LeadMe Labs is up to date")
            const pinNotDefault = new QaCheckResult("pin_is_not_default", "auto", 10000, {station: false, tablet: true, nuc: false, cbus: false},[], this.getConnectedTabletIpAddresses, "Pin not default", "Pin is not default")
            securityChecks.checks.push(cbusPasswordComplexity, appAppToDate, pinNotDefault)
            securityChecks.requirements = ["station_connection_checks"]

            const imvrChecks = new QaGroup("imvr_checks", "imvr")
            const headsetConnected = new QaCheckResult("headset_connected", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Headset Connected", "Is CBus password complex enough?")
            const headsetFirmware = new QaCheckResult("headset_firmware", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Headset Firmware", "Is CBus password complex enough?")
            const controllersConnected = new QaCheckResult("controllers_connected", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Controllers Connected", "Is CBus password complex enough?")
            const controllersFirmware = new QaCheckResult("controllers_firmware", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Controllers Firmware", "Is CBus password complex enough?")
            const baseStationsConnected = new QaCheckResult("base_stations_connected", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Sase Stations Connected", "Is CBus password complex enough?")
            const baseStationsFirmware = new QaCheckResult("base_stations_firmware", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Base Stations Firmware", "Is CBus password complex enough?")
            imvrChecks.checks.push(headsetConnected, headsetFirmware, controllersConnected, controllersFirmware, baseStationsConnected, baseStationsFirmware)
            imvrChecks.requirements = ["station_connection_checks"]

            //TODO add extendedDescriptions for the below checks
            const steamConfigChecks = new QaGroup("steam_config_checks", "software")
            const isSteamUserNameSet = new QaCheckResult("steam_username", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam Username is set")
            const isSteamPasswordSet = new QaCheckResult("steam_password", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds,  [], "Steam Password is set")
            const isSteamPasswordComplex = new QaCheckResult("steam_password_complexity", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam Password is complex enough")
            const isSteamInitialized = new QaCheckResult("steam_initialized", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam initialised", "Steam has been logged into at least once")
            const isFriendsSettingDisabled = new QaCheckResult("friends_setting", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam friends setting disabled")
            const isDownloadRegionSetCorrectly = new QaCheckResult("download_region", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam download region is correct")
            const isCloudEnabledOff = new QaCheckResult("cloud_disabled", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam cloud is disabled")
            const isDefaultPageSetToLibrary = new QaCheckResult("default_page_library", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam default page is library")
            const skipOfflineWarning = new QaCheckResult("skip_offline_warning", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam can skip offline warning")
            const allowAutoLogin = new QaCheckResult("allow_auto_login", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam allows auto login")
            const wantsOfflineMode = new QaCheckResult("wants_offline_mode", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam offline mode is configured correctly")
            const homeAppDisabled = new QaCheckResult("home_app_disabled", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam home app is disabled")
            const controllerTimeoutSetToZero = new QaCheckResult("controller_timeout_set_to_zero", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamVR controller timeout set to never")
            const screenTimeoutSetTo1800 = new QaCheckResult("screen_timeout_set_to_1800", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamVR screen timeout set to 30 minutes")
            const pauseCompositorSetToFalse = new QaCheckResult("pause_compositor_set_to_false", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamVR compositor pause set to off")
            const steamVrDashboardDisabled = new QaCheckResult("steamvr_dashboard_disabled", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamVR dashboard is disabled")
            const steamVrStatusNotOnTop = new QaCheckResult("steamvr_status_not_on_top", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamVR status is set to not display on top")
            steamConfigChecks.checks.push(isSteamUserNameSet, isSteamPasswordSet, isSteamPasswordComplex, isSteamInitialized, isFriendsSettingDisabled, isDownloadRegionSetCorrectly, isCloudEnabledOff, isDefaultPageSetToLibrary, skipOfflineWarning, allowAutoLogin, wantsOfflineMode, homeAppDisabled, controllerTimeoutSetToZero, screenTimeoutSetTo1800, pauseCompositorSetToFalse, steamVrDashboardDisabled, steamVrStatusNotOnTop)
            steamConfigChecks.requirements = ["station_connection_checks"]

            this.qaGroups = [stationConnectionChecks, networkChecks, securityChecks, windowsChecks, softwareChecks, steamConfigChecks, imvrChecks];
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
                    action: CONSTANT.ACTION.RUN_TABLET_GROUP,
                    actionData: {
                        group: group.id,
                        tabletIps: this.getConnectedTabletIpAddresses
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
                    id: type === 'station' ? id : (index + ""),
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

        getConnectedTabletIpAddresses(state): Array<string> {
            return state.tablets.filter(tablet => tablet.connected).map(tablet => tablet.ipAddress)
        },
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
            const keysToRemove = ['labLocation', 'technicianName'];
            const reportWithoutKey = { ...state.reportTracker };
            keysToRemove.forEach(key => {
                if (reportWithoutKey.hasOwnProperty(key)) {
                    delete reportWithoutKey[key];
                }
            });
            return reportWithoutKey;
        }
    }
});
