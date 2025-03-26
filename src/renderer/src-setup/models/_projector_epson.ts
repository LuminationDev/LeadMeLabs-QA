import ProjectorAppliance from './_projector_appliance'

class EpsonProjector extends ProjectorAppliance {
    options?: any

    constructor(id = 0, name = '', room = '', automationType = 'epson', ipAddress = '') {
        super(id, name, room, ipAddress, automationType)
    }
}

export default EpsonProjector
