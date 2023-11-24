import Cbus from './_cbus'

class Blind extends Cbus {
    labels: any

    constructor(
        id = 0,
        name = '',
        room = '',
        automationBase = 0,
        automationGroup = 0,
        automationId = 0,
        automationType = 'cbus'
    ) {
        super(id, name, room, automationBase, automationGroup, automationId, automationType)
        this.labels = {
            open: 'OPEN',
            close: 'CLOSE',
            stop: 'STOP'
        }
    }
}

export default Blind
