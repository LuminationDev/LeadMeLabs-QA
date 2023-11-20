import {QaCheckResult} from "./_qaCheckResult";

class QaGroup {
    id: string
    section: string | null
    requirements: Array<string> = []
    checks: Array<QaCheckResult> = []
    started: boolean = false

    constructor(id: string, section: string|null = null) {
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
        this.checks.forEach(check => {
            let checkedCheck = qaChecks.find(qaCheck => qaCheck.id === check.id)
            if (!checkedCheck) {
                return
            }
            if (id === "nuc") {
                check.updateNucDetail(checkedCheck)
            } else if (id.startsWith("tablet")) {
                var ip = id.split(":")[1]
                check.updateTabletDetail(ip, checkedCheck)
            } else {
                check.updateStationDetail(id, checkedCheck)
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