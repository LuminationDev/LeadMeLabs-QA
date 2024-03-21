import ProjectorAppliance from './_projector_appliance'

class PanasonicProjector extends ProjectorAppliance {
    username?: string
    password?: string
    options?: any

    constructor(id = 0,
                name = '',
                room = '',
                automationType = 'panasonic',
                ipAddress = '',
                username = '',
                password = '') {
        super(id, name, room, ipAddress, automationType)

        this.username = username
        this.password = password
    }
}

export default PanasonicProjector
