import { defineStore } from 'pinia';
import {Appliance, QaCheck, QaDetail, ReportTrackerItem, Station} from "../interfaces";
import { Station as StationClass } from '../types/_station'
import {QaGroup} from "../types/_qaGroup";
import {QaCheckResult} from "../types/_qaCheckResult";

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
        //List of the Station detail's from the NUC
        NucStationList: Array<Station>(),
        //List of the Station detail's from the Stations
        StationList: Array<Station>(),
        qaChecks: Array<QaCheck>(),
        qaDetails: Array<QaDetail>(),
        Stations: Array<StationClass>(),
        //Track the progress of the checks as an overall report object - populated in App.vue
        reportTracker: {} as ReportTrackerItem,
        //Can the NUC contact the CBus unit
        cbusConnection: "Loading",
        //List of appliance objects
        ApplianceList: Array<Appliance>(),

        qaGroups: [] as Array<QaGroup>
    }),
    actions: {
        buildQaList() {
            let stationIds = this.NucStationList.map(station => station.id)
            const stationConnectionChecks = new QaGroup("station_connection_checks")
            const stationIsConnected = new QaCheckResult("station_is_connected", "auto", 10000, stationIds, false, [], "Station is connected to NUC")
            stationConnectionChecks.checks.push(stationIsConnected)

            const windowsChecks = new QaGroup("windows_checks")
            const wakeOnLAN = new QaCheckResult("magic_packet_enabled", "auto", 10000, stationIds, false, [], "Wake On LAN", "Wake on Magic Packet is enabled")
            const amdInstalled = new QaCheckResult("amd_installed", "auto", 10000, stationIds, false, [], "AMD Installed", "Is AMD software installed")
            const envVariable = new QaCheckResult("openssl_environment", "auto", 10000, stationIds, false, [], "OPENSSL ENV", "Is OPENSSL_ia32cap set in environment variables")
            const wallpaper = new QaCheckResult("wallpaper_is_set", "auto", 10000, stationIds, false, [], "Wallpaper", "Is the Lumination wallpaper set")
            const timezone = new QaCheckResult("timezone_correct", "auto", 10000, stationIds, false, [], "Timezone", "Has the time zone been set to the correct location")
            const dateTime = new QaCheckResult("correct_datetime", "auto", 10000, stationIds, false, [], "Time & Date", "Is the date and time set correctly")
            windowsChecks.checks.push(wakeOnLAN, amdInstalled, envVariable, wallpaper, timezone, dateTime);

            const softwareChecks = new QaGroup("software_checks")
            const setvolInstalled = new QaCheckResult("setvol_installed", "auto", 10000, stationIds, false, [], "SetVol Installed", "SetVol is installed at the correct location")
            const steamcmdInstalled = new QaCheckResult("steamcmd_installed", "auto", 10000, stationIds, false, [], "SteamCMD Installed", "SteamCMD is installed at the correct location")
            const steamcmdInitialised = new QaCheckResult("steamcmd_initialised", "auto", 10000, stationIds, false, [], "SteamCMD Initialised", "SteamCMD is initialised with user details")
            const steamcmdConfigured = new QaCheckResult("steamcmd_configured", "auto", 10000, stationIds, false, [], "SteamCMD Configured", "SteamCMD has Steam Guard detail or does not need them")
            softwareChecks.checks.push(setvolInstalled, steamcmdInstalled, steamcmdInitialised, steamcmdConfigured)
            softwareChecks.requirements = ["station_connection_checks", "steam_config_checks"]

            const steamConfigChecks = new QaGroup("steam_config_checks")
            const isSteamUserNameSet = new QaCheckResult("steam_username", "auto", 10000, stationIds, false, [], "Steam Username is set")
            const isSteamPasswordSet = new QaCheckResult("steam_password", "auto", 10000, stationIds, false, [], "Steam Password is set")
            const isSteamInitialized = new QaCheckResult("steam_initialized", "auto", 10000, stationIds, false, [], "Steam initialised", "Steam has been logged into at least once")
            const isFriendsSettingDisabled = new QaCheckResult("friends_setting", "auto", 10000, stationIds, false, [], "Steam friends setting disabled")
            const isDownloadRegionSetCorrectly = new QaCheckResult("download_region", "auto", 10000, stationIds, false, [], "Steam download region is correct")
            const isCloudEnabledOff = new QaCheckResult("cloud_disabled", "auto", 10000, stationIds, false, [], "Steam cloud is disabled")
            const isDefaultPageSetToLibrary = new QaCheckResult("default_page_library", "auto", 10000, stationIds, false, [], "Steam default page is library")
            const skipOfflineWarning = new QaCheckResult("skip_offline_warning", "auto", 10000, stationIds, false, [], "Steam can skip offline warning")
            const allowAutoLogin = new QaCheckResult("allow_auto_login", "auto", 10000, stationIds, false, [], "Steam allows auto login")
            const wantsOfflineMode = new QaCheckResult("wants_offline_mode", "auto", 10000, stationIds, false, [], "Steam offline mode is configured correctly")
            const homeAppDisabled = new QaCheckResult("home_app_disabled", "auto", 10000, stationIds, false, [], "Steam home app is disabled")
            const controllerTimeoutSetToZero = new QaCheckResult("controller_timeout_set_to_zero", "auto", 10000, stationIds, false, [], "SteamVR controller timeout set to never")
            const screenTimeoutSetTo1800 = new QaCheckResult("screen_timeout_set_to_1800", "auto", 10000, stationIds, false, [], "SteamVR screen timeout set to 30 minutes")
            const pauseCompositorSetToFalse = new QaCheckResult("pause_compositor_set_to_false", "auto", 10000, stationIds, false, [], "SteamVR compositor pause set to off")
            const steamVrDashboardDisabled = new QaCheckResult("steamvr_dashboard_disabled", "auto", 10000, stationIds, false, [], "SteamVR dashboard is disabled")
            const steamVrStatusNotOnTop = new QaCheckResult("steamvr_status_not_on_top", "auto", 10000, stationIds, false, [], "SteamVR status is set to not display on top")
            steamConfigChecks.checks.push(isSteamUserNameSet, isSteamPasswordSet, isSteamInitialized, isFriendsSettingDisabled, isDownloadRegionSetCorrectly, isCloudEnabledOff, isDefaultPageSetToLibrary, skipOfflineWarning, allowAutoLogin, wantsOfflineMode, homeAppDisabled, controllerTimeoutSetToZero, screenTimeoutSetTo1800, pauseCompositorSetToFalse, steamVrDashboardDisabled, steamVrStatusNotOnTop)
            steamConfigChecks.requirements = ["station_connection_checks"]

            this.qaGroups = [stationConnectionChecks, windowsChecks, softwareChecks, steamConfigChecks];
        },

        processQaList() {
            const completedQaCheckGroupIds = this.qaGroups.filter(group => group.allChecksPassed()).map(group => group.id)
            console.log(completedQaCheckGroupIds)
            const groupsToStart = this.qaGroups.filter(group => !group.started).filter(group => {
                console.log(group, group.requirements)
                return (group.requirements.filter(r => !completedQaCheckGroupIds.includes(r)).length === 0)
            }).map(group => group.id)
            return groupsToStart
        },

        updateQaChecks(stationId, groupName, qaChecks) {
            console.log('updateQaChecks', qaChecks, groupName)
            console.log(this.qaGroups);
            let index = this.qaGroups.findIndex(group => group.id === groupName)
            console.log('updateQaChecks', index)
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

        statusValue(category) {
            if (category.failedCount > 0) {
                return category.failedCount + " Failed";
            } else if ((category.passedStatusCount === category.totalEntries) && category.totalEntries > 0) {
                return "Passed";
            } else {
                return "Skipped";
            }
        },

        /**
         * Get the counts of passedStatus within a test group.
         * @param entries An array containing a number of tests.
         */
        getCounts (entries: any) {
            const { totalEntries, passedStatusCount, failedCount } = entries.reduce(
                (acc, item) => {
                    acc.totalEntries += 1; // Increase totalEntries by 1 for each object in the array
                    acc.passedStatusCount += item['passedStatus'] === 'passed' ? 1 : 0; // Increment passedStatusCount if 'passed'
                    acc.failedCount += item['passedStatus'] === 'failed' ? 1 : 0; // Increment failedCount if 'failed'
                    return acc;
                },
                { totalEntries: 0, passedStatusCount: 0, failedCount: 0 }
            );

            return { totalEntries, passedStatusCount, failedCount };
        }
    },
    getters: {
        getCbusConnection(state) {
            return state.cbusConnection;
        }
    }
});
