import ApplianceInterface from './_appliance_interface'

interface EpsonInterface extends ApplianceInterface {
    id: number
    name: string
    room: string
    ipAddress: string
}

export default EpsonInterface
