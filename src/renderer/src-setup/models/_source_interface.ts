import ApplianceInterface from "./_appliance_interface";

interface SourceInterface extends ApplianceInterface {
    id: number
    name: string
    room: string
    ipAddress: string
    automationType: string,
}

export default SourceInterface