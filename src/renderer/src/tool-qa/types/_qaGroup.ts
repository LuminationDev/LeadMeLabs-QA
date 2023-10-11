import {QaCheckResult} from "./_qaCheckResult";

class QaGroup {
    id: string
    section: string | null
    requirements: Array<string> = []
    checks: Array<QaCheckResult> = []
    started: boolean = false

    constructor(id: string, section: string| null = null) {
        this.id = id;
        this.section = section;
    }

    allChecksPassed(): boolean {
        return this.checks.filter(check => check.checkPassed() === false).length === 0
    }

    getPassedChecksIds(): Array<string> {
        return this.checks.filter(check => check.checkPassed() === true).map(check => this.id + "." + check.id)
    }

    updateQaChecks(id, qaChecks) {
        console.log('updateQaChecks:qaGroup', qaChecks)
        this.checks.forEach(check => {
            if (id === "nuc") {
                check.updateNucDetail(qaChecks.find(qaCheck => qaCheck.id === check.id))
            } else {
                check.updateStationDetail(id, qaChecks.find(qaCheck => qaCheck.id === check.id))
            }
        })
    }

    startQa() {
        this.started = true
        this.checks.forEach(check => {
            check.startQa()
        })
    }
}

export { QaGroup }