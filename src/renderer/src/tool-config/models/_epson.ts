import EpsonInterface from './_epson_interface'
import Appliance from './_appliance'

export default class Epson extends Appliance implements EpsonInterface {
    ipAddress: string
    automationType: string

    constructor(id: number, name: string, room: string, ipAddress: string, automationType: string) {
        super(id, name, room)
        this.ipAddress = ipAddress
        this.automationType = automationType
    }
}
