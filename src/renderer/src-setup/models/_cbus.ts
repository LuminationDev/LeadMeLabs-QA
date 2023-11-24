import CbusInterface from './_cbus_interface'
import Appliance from './_appliance'

export default class Cbus extends Appliance implements CbusInterface {
    automationBase: number
    automationGroup: number
    automationId: number
    automationType: string

    constructor(
        id: number,
        name: string,
        room: string,
        automationBase: number,
        automationGroup: number,
        automationId: number,
        automationType: string
    ) {
        super(id, name, room)

        this.automationBase = automationBase
        this.automationGroup = automationGroup
        this.automationId = automationId
        this.automationType = automationType
    }
}
