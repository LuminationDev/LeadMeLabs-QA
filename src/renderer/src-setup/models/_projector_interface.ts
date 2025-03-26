import ApplianceInterface from './_appliance_interface'

interface ProjectorInterface extends ApplianceInterface {
    id: number
    name: string
    room: string
    ipAddress: string
}

export default ProjectorInterface
