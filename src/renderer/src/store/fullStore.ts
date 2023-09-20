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

        //TEMPORARY ITEMS
        //List of appliance objects
        ApplianceList: Array<Appliance>(),

        qaGroups: [] as Array<QaGroup>
    }),
    actions: {
        buildQaList(numberOfStations: number) {
            const stationConnectionChecks = new QaGroup("station_connection_checks")
            // todo -magic packet is not the actual test here, but it's something that's done
            const magicPacketEnabled = new QaCheckResult("magic_packet_enabled", "auto", 30, numberOfStations, false, [])
            stationConnectionChecks.checks.push(magicPacketEnabled)

            const steamConfigChecks = new QaGroup("steam_config_checks")
            const isSteamUserNameSet = new QaCheckResult("steam_username", "auto", 10, numberOfStations, false, [])
            const isSteamPasswordSet = new QaCheckResult("steam_password", "auto", 10, numberOfStations, false, [])
            const isSteamInitialized = new QaCheckResult("steam_initialized", "auto", 10, numberOfStations, false, [])
            const isFriendsSettingDisabled = new QaCheckResult("friends_setting", "auto", 10, numberOfStations, false, [])
            const isDownloadRegionSetCorrectly = new QaCheckResult("download_region", "auto", 10, numberOfStations, false, [])
            const isCloudEnabledOff = new QaCheckResult("cloud_disabled", "auto", 10, numberOfStations, false, [])
            const isDefaultPageSetToLibrary = new QaCheckResult("default_page_library", "auto", 10, numberOfStations, false, [])
            const skipOfflineWarning = new QaCheckResult("skip_offline_warning", "auto", 10, numberOfStations, false, [])
            const allowAutoLogin = new QaCheckResult("allow_auto_login", "auto", 10, numberOfStations, false, [])
            const wantsOfflineMode = new QaCheckResult("wants_offline_mode", "auto", 10, numberOfStations, false, [])
            const homeAppDisabled = new QaCheckResult("home_app_disabled", "auto", 10, numberOfStations, false, [])
            const controllerTimeoutSetToZero = new QaCheckResult("controller_timeout_set_to_zero", "auto", 10, numberOfStations, false, [])
            const screenTimeoutSetTo1800 = new QaCheckResult("screen_timeout_set_to_1800", "auto", 10, numberOfStations, false, [])
            const pauseCompositorSetToFalse = new QaCheckResult("pause_compositor_set_to_false", "auto", 10, numberOfStations, false, [])
            const steamVrDashboardDisabled = new QaCheckResult("steamvr_dashboard_disabled", "auto", 10, numberOfStations, false, [])
            const steamVrStatusNotOnTop = new QaCheckResult("steamvr_status_not_on_top", "auto", 10, numberOfStations, false, [])
            steamConfigChecks.checks.push(isSteamUserNameSet, isSteamPasswordSet, isSteamInitialized, isFriendsSettingDisabled, isDownloadRegionSetCorrectly, isCloudEnabledOff, isDefaultPageSetToLibrary, skipOfflineWarning, allowAutoLogin, wantsOfflineMode, homeAppDisabled, controllerTimeoutSetToZero, screenTimeoutSetTo1800, pauseCompositorSetToFalse, steamVrDashboardDisabled, steamVrStatusNotOnTop)
            steamConfigChecks.requirements = ["station_connection_checks"]

            this.qaGroups.push(stationConnectionChecks, steamConfigChecks)
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
            let index = this.qaGroups.findIndex(group => group.id === groupName)
            console.log('updateQaChecks', index)
            if (index !== -1) {
                this.qaGroups[index].updateQaChecks(stationId, qaChecks)
            }
        },

        startQa(groupId) {
            let index = this.qaGroups.findIndex(group => group.id === groupId)
            if (index !== -1) {
                this.qaGroups[index].started = true
            }
        }
    },
    getters: {

    }
});
