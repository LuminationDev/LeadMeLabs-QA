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
    targets: {}
    stations: Array<QaCheckResultStation> = []
    tablets: Array<QaCheckResultTablet> = []
    nuc: Array<QaCheckResultNuc> = []
    cbus: Array<QaCheckResultNuc> = []
    displayName: string
    extendedDescription: string|null = null

    constructor(
        id: string,
        type: string,
        timeout: number,
        targets: {
            station: boolean,
            tablet: boolean,
            nuc: boolean,
            cbus: boolean,
        },
        stationIds: Array<string>,
        tabletIps: Array<string>,
        displayName: string,
        extendedDescription: string|null = null
    ) {
        this.id = id;
        this.type = type;
        this.timeout = timeout;
        this.targets = targets;
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
        if (targets['nuc']) {
            this.nuc.push({
                passedStatus: "unchecked",
                checkingStatus: "not_checking",
                checkStartTime: null,
                message: null
            })
        }
        if (targets['cbus']) {
            this.cbus.push({
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
        const index = this.stations.findIndex(element => element.id == stationId)
        if (index !== -1) {
            this.stations[index].passedStatus = qaCheck.passedStatus
            this.stations[index].message = qaCheck.message
            this.stations[index].checkingStatus = "checked"
            this.stations[index].checkStartTime = null
        }
    }

    updateTabletDetail(tabletIp, qaCheck) {
        const index = this.tablets.findIndex(element => element.ipAddress == tabletIp)
        if (index !== -1) {
            this.tablets[index].passedStatus = qaCheck.passedStatus
            this.tablets[index].message = qaCheck.message
            this.tablets[index].checkingStatus = "checked"
            this.tablets[index].checkStartTime = null
        }
    }

    updateNucDetail(qaCheck) {
        if (this.nuc.length > 0) {
            this.nuc[0].passedStatus = qaCheck.passedStatus
            this.nuc[0].message = qaCheck.message
            this.nuc[0].checkingStatus = "checked"
            this.nuc[0].checkStartTime = null
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
                        station.checkingStatus = "timeout"
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
                        n.checkingStatus = "timeout"
                        n.passedStatus = "failed"
                        n.message = "Timed out waiting for check"
                    }
                }, this.timeout)
            }
        })

        this.cbus.forEach(c => {
            c.checkStartTime = unixTime
            c.checkingStatus = "checking"
            if (this.timeout > 0) {
                setTimeout(() => {
                    if (c.checkingStatus === "checking") {
                        c.checkingStatus = "timeout"
                        c.passedStatus = "failed"
                        c.message = "Timed out waiting for check"
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
                        tablet.checkingStatus = "timeout"
                        tablet.passedStatus = "failed"
                        tablet.message = "Timed out waiting for check"
                    }
                }, this.timeout)
            }
        })
    }
}

export { QaCheckResult }