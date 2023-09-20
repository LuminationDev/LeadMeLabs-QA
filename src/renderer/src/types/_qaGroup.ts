import {QaCheckResult} from "./_qaCheckResult";

class QaGroup {
    id: string
    requirements: Array<string> = []
    checks: Array<QaCheckResult> = []
    started: boolean = false

    constructor(id: string) {
        this.id = id;
    }

    allChecksPassed(): boolean {
        return this.checks.filter(check => check.checkPassed() === false).length === 0
    }

    updateQaChecks(stationId, qaChecks) {
        console.log('updateQaChecks:qaGroup', qaChecks)
        this.checks.forEach(check => {
            check.updateStationDetail(stationId, qaChecks.find(qaCheck => qaCheck.id === check.id))
        })
    }
}

export { QaGroup }