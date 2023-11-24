import Cbus from './_cbus'

class Light extends Cbus {
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
    }
}

export default Light
