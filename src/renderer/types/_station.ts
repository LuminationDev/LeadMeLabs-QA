import QaCheck from "../interfaces/_qaCheck";
import { useFullStore } from "../src-qa/store/fullStore";

type StationDetails = {
    ipAddress: string,
    nucIpAddress: string,
    labLocation: string,
    name: string|null;
    installedJsonApplications: null | string[];
    noLicenseApplications: null | string[];
    blockedFamilyModeApplications: null | string[];
    unacceptedEulas: null | string[];
    id: string;
    room: string;
    macAddress: string;
    ledRingId: string|null;
    stationMode: string|null;
}

class Station {
    constructor(id: string) {
        this.id = id;
    }
    details: StationDetails | null = null
    id: string
    expectedDetails: StationDetails | null = null // from NUC
    vrStatuses: any = null
    qaChecks: Array<QaCheck> = []

    getId(): string {
        return this.expectedDetails?.id ?? ''
    }

    getComputedChecks(): Array<QaCheck> {
        var qaChecks: QaCheck[] = []
        qaChecks.push(this.doesIpAddressMatch())
        qaChecks.push(this.doesMacAddressMatch())
        qaChecks.push(this.doesIdMatch())
        qaChecks.push(this.doesNameMatch())
        qaChecks.push(this.doesLabLocationMatch())
        qaChecks.push(this.doesRoomMatch())
        return qaChecks
    }

    doesIpAddressMatch(): QaCheck {
        var qaCheck = {} as QaCheck
        qaCheck.id = "ip_address_match"
        qaCheck.displayName = "IP Address Matches"
        if (this.details === null) {
            qaCheck.message = "Details not sent from station"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (this.expectedDetails === null) {
            qaCheck.message = "Details not sent from NUC"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (!this.details.ipAddress || this.details.ipAddress === "") {
            qaCheck.message = "Station has not provided it's IP address"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (!this.expectedDetails.ipAddress || this.expectedDetails.ipAddress === "") {
            qaCheck.message = "NUC has not provided Station's expected IP address"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (this.details.ipAddress !== this.expectedDetails.ipAddress) {
            qaCheck.message = `Station IP address did not match expected IP address. Station address: ${this.details.ipAddress}. Expected address: ${this.expectedDetails.ipAddress}`
            qaCheck.passedStatus = "failed"
            return qaCheck
        }
        if (this.details.ipAddress === this.expectedDetails.ipAddress) {
            qaCheck.passedStatus = "passed"
            return qaCheck
        }
        qaCheck.message = "Unknown failure"
        qaCheck.passedStatus = "failed"
        return qaCheck
    }

    doesMacAddressMatch(): QaCheck {
        var qaCheck = {} as QaCheck
        qaCheck.id = "mac_address_match"
        qaCheck.displayName = "MAC address matches"
        if (this.details === null) {
            qaCheck.message = "Details not sent from station"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (this.expectedDetails === null) {
            qaCheck.message = "Details not sent from NUC"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (!this.details.macAddress || this.details.macAddress === "") {
            qaCheck.message = "Station has not provided it's MAC address"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (!this.expectedDetails.macAddress || this.expectedDetails.macAddress === "") {
            qaCheck.message = "NUC has not provided Station's expected MAC address"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (this.details.macAddress.toLowerCase() !== this.expectedDetails.macAddress.toLowerCase()) {
            qaCheck.message = `Station IP address did not match expected MAC address. Station address: ${this.details.macAddress}. Expected address: ${this.expectedDetails.macAddress}`
            qaCheck.passedStatus = "failed"
            return qaCheck
        }
        if (this.details.macAddress.toLowerCase() === this.expectedDetails.macAddress.toLowerCase()) {
            qaCheck.passedStatus = "passed"
            return qaCheck
        }
        qaCheck.message = "Unknown failure"
        qaCheck.passedStatus = "failed"
        return qaCheck
    }

    doesLabLocationMatch(): QaCheck {
        var qaCheck = {} as QaCheck
        qaCheck.id = "lab_location_match"
        qaCheck.displayName = "Lab location matches"
        if (this.details === null) {
            qaCheck.message = "Details not sent from station"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (this.expectedDetails === null) {
            qaCheck.message = "Details not sent from NUC"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (!this.details.labLocation || this.details.labLocation === "") {
            qaCheck.message = "Station has not provided it's lab location"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (this.details.labLocation !== useFullStore().reportTracker.labLocation) {
            qaCheck.message = `Station lab location did not match expected lab location. Station lab location: ${this.details.labLocation}. Expected lab location: ${useFullStore().reportTracker.labLocation}`
            qaCheck.passedStatus = "failed"
            return qaCheck
        }
        if (this.details.labLocation === useFullStore().reportTracker.labLocation) {
            qaCheck.passedStatus = "passed"
            return qaCheck
        }
        qaCheck.message = "Unknown failure"
        qaCheck.passedStatus = "failed"
        return qaCheck
    }

    doesIdMatch(): QaCheck {
        var qaCheck = {} as QaCheck
        qaCheck.id = "id_match"
        qaCheck.displayName = "ID matches"
        if (this.details === null) {
            qaCheck.message = "Details not sent from station"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (this.expectedDetails === null) {
            qaCheck.message = "Details not sent from NUC"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (!this.details.id || this.details.id === "") {
            qaCheck.message = "Station has not provided it's id"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (!this.expectedDetails.id || this.expectedDetails.id === "") {
            qaCheck.message = "NUC has not provided Station's expected id"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }

        if (this.details.id !== this.expectedDetails.id) {
            qaCheck.message = `Station id did not match expected id. Station id: ${this.details.id}. Expected id: ${this.expectedDetails.id}`
            qaCheck.passedStatus = "failed"
            return qaCheck
        }
        if (this.details.id === this.expectedDetails.id) {
            qaCheck.passedStatus = "passed"
            return qaCheck
        }
        qaCheck.message = "Unknown failure"
        qaCheck.passedStatus = "failed"
        return qaCheck
    }

    doesNameMatch(): QaCheck {
        var qaCheck = {} as QaCheck
        qaCheck.id = "name_match"
        qaCheck.displayName = "Name matches"
        if (this.details === null) {
            qaCheck.message = "Details not sent from station"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (this.expectedDetails === null) {
            qaCheck.message = "Details not sent from NUC"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (!this.details.id || this.details.id === "") {
            qaCheck.message = "Station has not provided it's id"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (!this.expectedDetails.name || this.expectedDetails.name === "") {
            qaCheck.message = "NUC has not provided Station's expected name"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }

        if (`Station ${this.details.id}` !== this.expectedDetails.name) {
            qaCheck.message = `Station name did not match expected name. Station name: Station ${this.details.id}. Expected name: ${this.expectedDetails.name}`
            qaCheck.passedStatus = "failed"
            return qaCheck
        }
        if (`Station ${this.details.id}` === this.expectedDetails.name) {
            qaCheck.passedStatus = "passed"
            return qaCheck
        }
        qaCheck.message = "Unknown failure"
        qaCheck.passedStatus = "failed"
        return qaCheck
    }

    doesRoomMatch(): QaCheck {
        var qaCheck = {} as QaCheck
        qaCheck.id = "room_match"
        qaCheck.displayName = "Room matches"
        if (this.details === null) {
            qaCheck.message = "Details not sent from station"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (this.expectedDetails === null) {
            qaCheck.message = "Details not sent from NUC"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (!this.details.room || this.details.room === "") {
            qaCheck.message = "Station has not provided it's room"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (!this.expectedDetails.room || this.expectedDetails.room === "") {
            qaCheck.message = "NUC has not provided Station's expected room"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }

        if (this.details.room !== this.expectedDetails.room) {
            qaCheck.message = `Station room did not match expected room. Station room: ${this.details.room}. Expected room: ${this.expectedDetails.room}`
            qaCheck.passedStatus = "failed"
            return qaCheck
        }
        if (this.details.room === this.expectedDetails.room) {
            qaCheck.passedStatus = "passed"
            return qaCheck
        }
        qaCheck.message = "Unknown failure"
        qaCheck.passedStatus = "failed"
        return qaCheck
    }
}

export { Station }
export type { StationDetails }