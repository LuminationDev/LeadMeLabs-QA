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
    timeout: number|null = null
    stations: Array<QaCheckResultStation> = []
    tablets: Array<QaCheckResultTablet> = []
    nuc: Array<QaCheckResultNuc> = []

    constructor(
        id: string,
        type: string,
        timeout: number,
        numberOfStations: number,
        hasNuc: boolean,
        tabletIps: Array<string>
    ) {
        this.id = id;
        this.type = type;
        this.timeout = timeout;
        this.stations.push({
            id: "101",
            passedStatus: "unchecked",
            checkingStatus: "not_checking",
            checkStartTime: null,
            message: null
        })
        // for (let i = 1; i <= numberOfStations; i++) {
        //     this.stations.push({
        //         id: i + "",
        //         passedStatus: "unchecked",
        //         checkingStatus: "not_checking",
        //         checkStartTime: null,
        //         message: null
        //     })
        // }
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
        }
    }
}

export { QaCheckResult }