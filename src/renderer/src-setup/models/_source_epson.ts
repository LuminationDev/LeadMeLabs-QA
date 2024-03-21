import ProjectorAppliance from './_projector_appliance'
import ApplianceInterface from './_appliance_interface'

class EpsonSource extends ProjectorAppliance implements ApplianceInterface {
    options?: any

    constructor(
        id = 0,
        name = '',
        room = '',
        automationType = 'epson',
        ipAddress = '',
        option = {}
    ) {
        super(id, name, room, ipAddress, automationType)
        this.options = option
    }
}

export default EpsonSource
