import ProjectorAppliance from './_projector_appliance'
import ApplianceInterface from './_appliance_interface'

class PanasonicSource extends ProjectorAppliance implements ApplianceInterface {
    username?: string
    password?: string
    options?: any

    constructor(
        id = 0,
        name = '',
        room = '',
        automationType = 'panasonic',
        ipAddress = '',
        username = '',
        password = '',
        option = {}
    ) {
        super(id, name, room, ipAddress, automationType)
        this.username = username
        this.password = password
        this.options = option
    }
}

export default PanasonicSource
