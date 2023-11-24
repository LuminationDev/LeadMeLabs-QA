import ApplianceInterface from './_appliance_interface'

export default class Appliance implements ApplianceInterface {
    id: number
    name: string
    //@ts-ignore room is declared here????
    room: string
    displayType?: string
    hidden?: string

    constructor(id: number, name: string, room: string) {
        this.id = id
        this.name = name
        this.room = room
    }
}
