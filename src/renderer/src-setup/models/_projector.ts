import Epson from './_epson'

class Projector extends Epson {
    options?: any

    constructor(id = 0, name = '', room = '', automationType = 'epson', ipAddress = '') {
        super(id, name, room, ipAddress, automationType)
    }
}

export default Projector
