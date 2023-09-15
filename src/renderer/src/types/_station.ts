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
    qaChecks: Array<QaCheck> = []

    getComputedChecks(): Array<QaCheck> {

        var qaChecks: QaCheck[] = []
        qaChecks.push(this.doesIpAddressMatch())
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
        if (this.details.ipAddress === null) {
            qaCheck.message = "Station has not provided it's IP address"
            qaCheck.passedStatus = "failed"
            return qaCheck;
        }
        if (this.expectedDetails.ipAddress === null) {
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
}

export { Station }
export type { StationDetails }