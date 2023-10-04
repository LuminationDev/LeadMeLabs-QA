type QaCheckResultStation = {
    id: string,
    passedStatus: string,
    checkingStatus: string,
    checkStartTime: number|null, // UTC unix time
    message: string|null
}

type QaCheckResultNuc = {
    passedStatus: string,
    checkingStatus: string,
    checkStartTime: number|null, // UTC unix time
    message: string|null
}

type QaCheckResultTablet = {
    ipAddress: string,
    passedStatus: string,
    checkingStatus: string,
    checkStartTime: number|null, // UTC unix time
    message: string|null
}


class QaCheckResult {
    requirements: Array<string> = []
    id: string
    type: string
    timeout: number = 0
    stations: Array<QaCheckResultStation> = []
    tablets: Array<QaCheckResultTablet> = []
    nuc: Array<QaCheckResultNuc> = []
    displayName: string
    extendedDescription: string|null = null

    constructor(
        id: string,
        type: string,
        timeout: number,
        stationIds: Array<string>,
        hasNuc: boolean,
        tabletIps: Array<string>,
        displayName: string,
        extendedDescription: string|null = null
    ) {
        this.id = id;
        this.type = type;
        this.timeout = timeout;
        this.displayName = displayName
        this.extendedDescription = extendedDescription

        stationIds.forEach(id => {
            this.stations.push({
                id: id,
                passedStatus: "unchecked",
                checkingStatus: "not_checking",
                checkStartTime: null,
                message: null
            })
        })
        if (hasNuc) {
            this.nuc.push({
                passedStatus: "unchecked",
                checkingStatus: "not_checking",
                checkStartTime: null,
                message: null
            })
        }
        tabletIps.forEach(ip => {
            this.tablets.push({
                ipAddress: ip,
                passedStatus: "unchecked",
                checkingStatus: "not_checking",
                checkStartTime: null,
                message: null
            })
        })
    }

    checkPassed(): boolean {
        return this.stations.filter(station => station.passedStatus !== "passed").length === 0
    }

    updateStationDetail(stationId, qaCheck) {
        const index = this.stations.findIndex(element => element.id === stationId)
        if (index !== -1) {
            this.stations[index].passedStatus = qaCheck.passedStatus
            this.stations[index].message = qaCheck.message
            this.stations[index].checkingStatus = "checked"
            this.stations[index].checkStartTime = null
        }
    }

    startQa() {
        const unixTime = Date.now()
        this.stations.forEach(station => {
            station.checkStartTime = unixTime
            station.checkingStatus = "checking"
            if (this.timeout > 0) {
                setTimeout(() => {
                    if (station.checkingStatus === "checking") {
                        station.passedStatus = "failed"
                        station.message = "Timed out waiting for check"
                    }
                }, this.timeout)
            }
        })

        this.nuc.forEach(n => {
            n.checkStartTime = unixTime
            n.checkingStatus = "checking"
            if (this.timeout > 0) {
                setTimeout(() => {
                    if (n.checkingStatus === "checking") {
                        n.passedStatus = "failed"
                        n.message = "Timed out waiting for check"
                    }
                }, this.timeout)
            }
        })

        this.tablets.forEach(tablet => {
            tablet.checkStartTime = unixTime
            tablet.checkingStatus = "checking"
            if (this.timeout > 0) {
                setTimeout(() => {
                    if (tablet.checkingStatus === "checking") {
                        tablet.passedStatus = "failed"
                        tablet.message = "Timed out waiting for check"
                    }
                }, this.timeout)
            }
        })
    }
}

export { QaCheckResult }