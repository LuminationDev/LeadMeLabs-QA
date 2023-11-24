import ApplianceInterface from './_appliance_interface'
import Cbus from './_cbus'

class Scene extends Cbus implements ApplianceInterface {
    sceneId: number
    automationValue: number
    theatre_ids: number[]
    stations: Array<{
        id?: number
        action?: string
    }>

    appliances: Array<{
        id?: number
        value?: number
        type?: string
    }>

    constructor(
        id = 0,
        name = '',
        room = '',
        automationBase = 0,
        automationGroup = 0,
        automationId = 0,
        automationType = 'cbus',
        sceneId = 0,
        automationValue = 0,
        theatre_ids = [],
        stations = [],
        appliances = []
    ) {
        super(id, name, room, automationBase, automationGroup, automationId, automationType)
        this.sceneId = sceneId
        this.automationValue = automationValue
        this.theatre_ids = theatre_ids
        this.stations = stations
        this.appliances = appliances
    }
}

export default Scene
