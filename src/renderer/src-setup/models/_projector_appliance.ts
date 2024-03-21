import ProjectorInterface from './_projector_interface'
import Appliance from './_appliance'

export default class ProjectorAppliance extends Appliance implements ProjectorInterface {
    ipAddress: string
    automationType: string

    constructor(id: number, name: string, room: string, ipAddress: string, automationType: string) {
        super(id, name, room)
        this.ipAddress = ipAddress
        this.automationType = automationType
    }
}
