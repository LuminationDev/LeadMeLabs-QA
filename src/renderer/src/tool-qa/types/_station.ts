import QaCheck from "../interfaces/_qaCheck";

type StationDetails = {
    ipAddress: string,
    nucIpAddress: string,
    labLocation: string,
    name: string;
    installedApplications: null | string[];
    id: number;
    room: string;
    macAddress: string;
    ledRingId: string;
}

class Station {
    details: StationDetails | null = null
    expectedDetails: StationDetails | null = null // from NUC
    vrStatuses: any = null
    qaChecks: Array<QaCheck> = []

    getComputedChecks(): Array<QaCheck> {
        var qaChecks: QaCheck[] = []
        qaChecks.push(this.doesIpAddressMatch())
        qaChecks.push(this.doesMacAddressMatch())
        return qaChecks
    }

    doesIpAddressMatch(): QaCheck {
        var qaCheck = {} as QaCheck
        qaCheck.id = "ip_address_match"
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
        if (this.details.macAddress !== this.expectedDetails.macAddress) {
            qaCheck.message = `Station IP address did not match expected MAC address. Station address: ${this.details.macAddress}. Expected address: ${this.expectedDetails.macAddress}`
            qaCheck.passedStatus = "failed"
        }
        if (this.details.macAddress === this.expectedDetails.macAddress) {
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