//@ts-ignore

import Cbus from './_cbus'

class LedRing extends Cbus {
    associatedStation: number

    constructor(
        id = 0,
        name = '',
        room = '',
        automationBase = 0,
        automationGroup = 0,
        automationId = 0,
        automationType = 'cbus',
        associatedStation = 0
    ) {
        super(id, name, room, automationBase, automationGroup, automationId, automationType)
        this.automationType = automationType
        this.associatedStation = associatedStation
    }

    // functions here
    // add stuffs
}

export default LedRing
