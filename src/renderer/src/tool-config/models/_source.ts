import Epson from './_epson'
import ApplianceInterface from './_appliance_interface'

class Source extends Epson implements ApplianceInterface {
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

export default Source
