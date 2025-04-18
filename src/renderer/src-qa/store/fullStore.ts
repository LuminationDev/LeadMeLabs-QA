import * as CONSTANT from "../../assets/constants";
import { defineStore } from 'pinia';
import { Appliance, QaCheck, QaDetail, Tablet } from "../../interfaces";
import { Station as StationClass } from '../../types/_station'
import { QaGroup } from "../../types/_qaGroup";
import { QaCheckResult } from "../../types/_qaCheckResult";
import { useStateStore } from "../../store/stateStore";
import { Report, Targets } from "../../interfaces/_report";

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
            { id: 'NUC', prefix: '', ipAddress: '', type: 'nuc', checks: {} },
            { id: 'C-Bus', prefix: '', ipAddress: '', type: 'cbus', checks: {}}
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
        //Can the NUC contact the CBus unit
        cbusConnection: "Loading",
        //List of appliance objects
        ApplianceList: Array<Appliance>(),
        tablets: Array<Tablet>(),
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

            const networkChecks = new QaGroup("network_checks", "network", { networkType: this.reportTracker['networkType'] })
            //Milesight network
            const defaultGateway = new QaCheckResult("default_gateway_is_correct", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Default Gateway", "Checks that the default gateway is set based on the default setting")
            const dnsServer = new QaCheckResult("dns_server_is_correct", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "DNS Server", "Checks that the DNS server is set based on the default setting")
            const altDnsServer = new QaCheckResult("alt_dns_server_is_correct", "auto", 10000,{station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Alt. DNS Server", "Checks that the alternate DNS server is set based on the default setting")
            const staticIpAddress = new QaCheckResult("static_ip_is_default", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Static IP", "Checks that the static IP address is set based on the default setting")
            const milesightNotDefaultPassword = new QaCheckResult("milesight_not_default_password", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, [], [], "Milesight not default", "Checks that the milesight router is not set with the default password")
            //School network
            const staticIpAddressPresent = new QaCheckResult("static_ip_is_present", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Static IP", "Checks that a static IP address is set")
            const allowedThroughFirewall = new QaCheckResult("allowed_through_firewall", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Firewall", "Checks that the NUC/Station software has allow rules in the firewall and is not disallowed")
            const launcherAllowedThroughFirewall = new QaCheckResult("launcher_allowed_through_firewall", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Launcher firewall", "Checks that the launcher software has allow rules in the firewall and is not disallowed")
            const nucCanAccessNucHosting = new QaCheckResult("can_access_nuc_hosting", "auto", 10000, {station: false, tablet: false, nuc: true, cbus: false}, [], [], "Access NUC Hosting", "Checks that we can access the NUC hosting server")
            const stationCanAccessStationHosting = new QaCheckResult("can_access_station_hosting", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Access Station Hosting", "Checks that we can access the station hosting server")
            const canAccessLauncherHosting = new QaCheckResult("can_access_launcher_hosting", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds,  [], "Access Launcher Hosting", "Checks that we can access the launcher hosting server")
            const canReachPlayStore = new QaCheckResult("can_reach_play_store", "auto", 10000, {station: false, tablet: true, nuc: false, cbus: false}, [], this.getConnectedTabletIpAddresses, "Can reach play store", "Tablet can reach play store through the network")
            const canReachAnalytics = new QaCheckResult("can_reach_analytics", "auto", 10000, {station: false, tablet: true, nuc: false, cbus: false}, [], this.getConnectedTabletIpAddresses, "Can reach analytics", "Tablet can reach analytics through the network")
            const canReachSentry = new QaCheckResult("can_reach_sentry", "auto", 10000, {station: false, tablet: true, nuc: false, cbus: false}, [], this.getConnectedTabletIpAddresses, "Can reach sentry", "Tablet can reach sentry through the network")
            const canReachSteamStatic = new QaCheckResult("can_reach_steam_static", "auto", 10000, {station: false, tablet: true, nuc: false, cbus: false}, [], this.getConnectedTabletIpAddresses, "Can reach steam static", "Tablet can reach steam static through the network")
            const speedtest = new QaCheckResult("internet_speedtest", "auto", 150000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Internet Speedtest", "Get speed to download a 100MB file")
            const packetLossTest = new QaCheckResult("packet_loss_test", "auto", 30000, {station: false, tablet: true, nuc: false, cbus: false}, [], this.getConnectedTabletIpAddresses, "Packet loss test", "Checks that at most 1 of 20 packets are lost, and that the average response time is less than 300ms")
            // @ts-ignore //Only add if the labType equals online
            if (this.reportTracker['networkType'] === "Milesight") {
                networkChecks.checks.push(defaultGateway, dnsServer, altDnsServer, staticIpAddress, milesightNotDefaultPassword);
            } else {
                networkChecks.checks.push(staticIpAddressPresent);
            }
            networkChecks.checks.push(allowedThroughFirewall, launcherAllowedThroughFirewall, nucCanAccessNucHosting, stationCanAccessStationHosting, canAccessLauncherHosting, canReachPlayStore, canReachAnalytics, canReachSentry, canReachSteamStatic, packetLossTest)
            // @ts-ignore //Only add if the labType equals online
            if(this.reportTracker['labType'] !== "Offline") {networkChecks.checks.push(speedtest)}
            networkChecks.requirements = ["station_connection_checks"]

            const windowsChecks = new QaGroup("windows_checks", "windows")
            const windowsVersionDetail = new QaCheckResult("windows_version_detail", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Windows Version", "What is the PCs Windows version?")
            const wakeOnLAN = new QaCheckResult("magic_packet_enabled", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Magic packet enabled", "Wake on Magic Packet is enabled")
            const envVariable = new QaCheckResult("openssl_environment", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "OPENSSL ENV set", "Is OPENSSL_ia32cap set in environment variables")
            const wallpaper = new QaCheckResult("wallpaper_is_set", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Correct wallpaper", "Is the Lumination wallpaper set based on the image name")
            const timezone = new QaCheckResult("timezone_correct", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Timezone", "Has the timezone been set to the correct location")
            const dateTime = new QaCheckResult("correct_datetime", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Time & Date", "Is the date and time set correctly")
            windowsChecks.checks.push(wakeOnLAN, envVariable, wallpaper);
            // @ts-ignore //Only add if the labType equals online
            if(this.reportTracker['labType'] !== "Offline") {windowsChecks.checks.push(windowsVersionDetail, timezone, dateTime)}

            const configChecks = new QaGroup("configuration_checks", "configuration");
            const taskScheduler = new QaCheckResult("task_scheduler_created", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Task scheduler", "Task scheduler is correctly setup")
            const oldTaskScheduler = new QaCheckResult("old_task_scheduler_not_existing", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Old task scheduler", "Old task scheduler is not present")
            const shellStartup = new QaCheckResult("shell_startup_not_existing", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Shell Startup", "The NUC/Station software is not present in the shell:startup folder")
            const cbusScriptId = new QaCheckResult("cbus_script_id", "auto", 10000, {station: false, tablet: false, nuc: true, cbus: false},[], [], "CBus script id", "CBus script id is correctly set")
            const allProjectorsAssigned = new QaCheckResult("all_projectors_assigned", "auto", 10000, {station: false, tablet: false, nuc: true, cbus: false},[], [], "Projectors Assigned", "Are all projectors assigned to scenes")
            const environmentCbusIp = new QaCheckResult("environment_cbus_ip", "auto", 10000, {station: false, tablet: false, nuc: true, cbus: false},[], [], "Environment: CbusIp", "Check that the CbusIp environment variable is set in the launcher and not in the system variables")
            const environmentCbusLogin = new QaCheckResult("environment_cbus_login", "auto", 10000, {station: false, tablet: false, nuc: true, cbus: false},[], [], "Environment: CbusLogin", "Check that the CbusLogin environment variable is set in the launcher and not in the system variables")
            const environmentNucScriptId = new QaCheckResult("environment_nuc_script_id", "auto", 10000, {station: false, tablet: false, nuc: true, cbus: false},[], [], "Environment: NucScriptId", "Check that the NucScriptId environment variable is set in the launcher and not in the system variables")
            const environmentNovastarLogin = new QaCheckResult("environment_novastar_login", "auto", 10000, {station: false, tablet: false, nuc: true, cbus: false},[], [], "Environment: NovastarLogin", "Check that the NovastarLogin environment variable is set in the launcher and not in the system variables")
            const environmentLabLocation = new QaCheckResult("environment_lab_location", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false},stationIds, [], "Environment: LabLocation", "Check that the LabLocation environment variable is set in the launcher and not in the system variables")
            const environmentEncryptionKey = new QaCheckResult("environment_encryption_key", "auto", 10000, {station: true, tablet: false, nuc: true, cbus: false},stationIds, [], "Environment: EncryptionKey", "Check that the EncryptionKey environment variable is set in the launcher and not in the system variables")
            const environmentSteamUsername = new QaCheckResult("environment_steam_username", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false},stationIds, [], "Environment: SteamUsername", "Check that the SteamUsername environment variable is set in the launcher and not in the system variables")
            const environmentSteamPassword = new QaCheckResult("environment_steam_password", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false},stationIds, [], "Environment: SteamPassword", "Check that the SteamPassword environment variable is set in the launcher and not in the system variables")
            const environmentNucAddress = new QaCheckResult("environment_nuc_address", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false},stationIds, [], "Environment: NucAddress", "Check that the NucAddress environment variable is set in the launcher and not in the system variables")
            const environmentStationId = new QaCheckResult("environment_station_id", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false},stationIds, [], "Environment: StationId", "Check that the StationId environment variable is set in the launcher and not in the system variables")
            const environmentHeadsetType = new QaCheckResult("environment_headset_type", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false},stationIds, [], "Environment: HeadsetType", "Check that the HeadsetType environment variable is set in the launcher and not in the system variables")
            const environmentRoom = new QaCheckResult("environment_room", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false},stationIds, [], "Environment: Room", "Check that the Room environment variable is set in the launcher and not in the system variables")
            const environmentStationMode = new QaCheckResult("environment_station_mode", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false},stationIds, [], "Environment: StationMode", "Check that the StationMode environment variable is set in the launcher and not in the system variables")
            const allSceneAppliancesValid = new QaCheckResult("all_scene_appliances_valid", "auto", 10000, {station: false, tablet: false, nuc: true, cbus: false},[], [], "Scene Appliances Valid", "Checks that all appliances listed in scenes are also listed as individual appliances")
            configChecks.checks.push(taskScheduler, oldTaskScheduler, shellStartup, cbusScriptId, allSceneAppliancesValid, allProjectorsAssigned, environmentCbusIp, environmentCbusLogin, environmentNucScriptId, environmentNovastarLogin, environmentLabLocation, environmentEncryptionKey, environmentSteamUsername, environmentSteamPassword, environmentNucAddress, environmentStationId, environmentHeadsetType, environmentRoom, environmentStationMode)

            const softwareChecks = new QaGroup("software_checks", "software")
            const amdInstalled = new QaCheckResult("amd_installed", "auto", 20000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "AMD Installed", "Is AMD software installed")
            const setvolInstalled = new QaCheckResult("setvol_installed", "auto", 20000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SetVol Installed", "SetVol is installed at the correct location")
            const steamcmdInstalled = new QaCheckResult("steamcmd_installed", "auto", 20000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamCMD Installed", "SteamCMD is installed at the correct location")
            const steamcmdInitialised = new QaCheckResult("steamcmd_initialised", "auto", 20000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamCMD Initialised", "SteamCMD is initialised with user details")
            const steamcmdConfigured = new QaCheckResult("steamcmd_configured", "auto", 20000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamCMD Configured", "SteamCMD has Steam Guard detail or does not need them")
            const steamGuardDisabled = new QaCheckResult("steam_guard_disabled", "auto", 60000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam guard disabled", "Steam Guard has been disabled")
            const softwareVersion = new QaCheckResult("latest_software_version", "auto", 20000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Software Version", "Is the software up-to-date?")
            const productionMode = new QaCheckResult("production_mode", "auto", 20000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Production Mode", "Is the launcher set to Production")
            const autoStart = new QaCheckResult("auto_start", "auto", 20000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Auto Start", "Is the launcher set to autostart")
            const driverEasyNotInstalled = new QaCheckResult("drivereasy_not_installed", "auto", 20000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "DriverEasy", "DriverEasy is not installed")
            const nvidiaNotInstalled = new QaCheckResult("nvidia_not_installed", "auto", 20000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "NVidia", "No NVidia programs are installed")
            const launcherInstallLocation = new QaCheckResult("launcher_install_location", "auto", 20000, {station: true, tablet: false, nuc: true, cbus: false}, stationIds, [], "Launcher Install Location", "Checks launcher is in correct location, and not installed in old location")
            softwareChecks.checks.push(productionMode, autoStart, setvolInstalled, amdInstalled, steamGuardDisabled, steamcmdInstalled, steamcmdInitialised, steamcmdConfigured, driverEasyNotInstalled, nvidiaNotInstalled, launcherInstallLocation)
            // @ts-ignore //Only add if the labType equals online
            if(this.reportTracker['labType'] !== "Offline") {softwareChecks.checks.push(softwareVersion)}
            softwareChecks.requirements = ["station_connection_checks", "steam_config_checks.steam_username", "steam_config_checks.steam_password", "steam_config_checks.steam_initialized"]

            const securityChecks = new QaGroup("security_checks", "security")
            const cbusPasswordComplexity = new QaCheckResult("cbus_password_complexity", "auto", 10000, {station: false, tablet: false, nuc: true, cbus: false},  [], [], "CBus password complexity", "Is CBus password complex enough?")
            const appAppToDate = new QaCheckResult("app_up_to_date", "auto", 20000, {station: false, tablet: true, nuc: false, cbus: false}, [], this.getConnectedTabletIpAddresses, "App up to date", "Tablet app is up to date")
            const pinNotDefault = new QaCheckResult("pin_is_not_default", "auto", 20000, {station: false, tablet: true, nuc: false, cbus: false},[], this.getConnectedTabletIpAddresses, "Pin not default", "Pin is not default")
            securityChecks.checks.push(cbusPasswordComplexity, appAppToDate, pinNotDefault)
            securityChecks.requirements = ["station_connection_checks"]

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

            const steamConfigChecks = new QaGroup("steam_config_checks", "software")
            const isSteamUserNameSet = new QaCheckResult("steam_username", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam Username", "Can the username be found in the Station config?")
            const isSteamPasswordSet = new QaCheckResult("steam_password", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds,  [], "Steam Password", "Can the password be found in the Station config?")
            const isSteamPasswordComplex = new QaCheckResult("steam_password_complexity", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam Password complexity", "Does the password conform to the requirements?")
            const isSteamInitialized = new QaCheckResult("steam_initialized", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam initialised", "Steam has been logged into at least once")
            const isFriendsSettingDisabled = new QaCheckResult("friends_setting", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam friends setting disabled", "Is the Steam friends setting disabled?")
            const isDownloadRegionSetCorrectly = new QaCheckResult("download_region", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam download region", "Is the correct download region selected?")
            const isCloudEnabledOff = new QaCheckResult("cloud_disabled", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam cloud is disabled", "Is the Steam cloud setting disabled?")
            const isDefaultPageSetToLibrary = new QaCheckResult("default_page_library", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam default page is library", "Is the default page set to the library?")
            const skipOfflineWarning = new QaCheckResult("skip_offline_warning", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam can skip offline warning", "Does Steam skip the offline warning on login?")
            const allowAutoLogin = new QaCheckResult("allow_auto_login", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam allows auto login", "Does Steam allow auto login?")
            const wantsOfflineMode = new QaCheckResult("wants_offline_mode", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam offline mode is configured correctly", "Is Steam offline mode working correctly?")
            const homeAppDisabled = new QaCheckResult("home_app_disabled", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "Steam home app is disabled", "Is the Steam home app disabled?")
            const controllerTimeoutSetToZero = new QaCheckResult("controller_timeout_set_to_zero", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamVR controller timeout", "Is the controller timeout set to 0 (never)?")
            const screenTimeoutSetTo1800 = new QaCheckResult("screen_timeout_set_to_1800", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamVR screen timeout", "Is the headset timeout set to 30 minutes?")
            const pauseCompositorSetToFalse = new QaCheckResult("pause_compositor_set_to_false", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamVR compositor", "Is the compositor pause setting set to off?")
            const steamVrDashboardDisabled = new QaCheckResult("steamvr_dashboard_disabled", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamVR dashboard is disabled", "Is the SteamVR dashboard disabled?")
            const steamVrStatusNotOnTop = new QaCheckResult("steamvr_status_not_on_top", "auto", 10000, {station: true, tablet: false, nuc: false, cbus: false}, stationIds, [], "SteamVR status UI", "Is the SteamVR status set to not display on top?")
            steamConfigChecks.checks.push(isSteamUserNameSet, isSteamPasswordSet, isSteamPasswordComplex, isSteamInitialized, isFriendsSettingDisabled, isDownloadRegionSetCorrectly, isCloudEnabledOff, isDefaultPageSetToLibrary, skipOfflineWarning, allowAutoLogin, wantsOfflineMode, homeAppDisabled, controllerTimeoutSetToZero, screenTimeoutSetTo1800, pauseCompositorSetToFalse, steamVrDashboardDisabled, steamVrStatusNotOnTop)
            steamConfigChecks.requirements = ["station_connection_checks"]

            this.qaGroups = [stationConnectionChecks, networkChecks, securityChecks, windowsChecks, configChecks, softwareChecks, steamConfigChecks, imvrChecks];
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
                    action: CONSTANT.ACTION.RUN_TABLET_GROUP,
                    actionData: {
                        group: group.id,
                        labType: this.reportTracker["labType"] ?? "Online",
                        tabletIps: this.getConnectedTabletIpAddresses,
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

        stationConnected(expectedStationId: string, stationData: any) {
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
        getCbusConnection(state) {
            return state.cbusConnection;
        },
        connectedTabletCount(state) {
            return state.tablets.filter(tablet => tablet.connected).length
        },
        getConnectedTabletIpAddresses(state): Array<string> {
            return state.tablets
                .filter(tablet => tablet.connected && tablet.ipAddress !== null)
                .map(tablet => tablet.ipAddress!);
        },
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
            return Object.keys(useFullStore().getReportSections);
        }
    }
});
