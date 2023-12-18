import Cbus from './_cbus'
import ApplianceInterface from './_appliance_interface'

class Splicer extends Cbus implements ApplianceInterface {
    hidden: string
    preAppliances?: Array<{
        id?: number
        type?: string
        value?: number
    }>

    constructor(
        id = 0,
        name = '',
        room = '',
        automationBase = 0,
        automationGroup = 0,
        automationId = 0,
        automationType = 'cbus',
        hidden = 'false',
        preAppliances = []
    ) {
        super(id, name, room, automationBase, automationGroup, automationId, automationType)

        this.hidden = hidden
        this.preAppliances = preAppliances
    }
}

export default Splicer
