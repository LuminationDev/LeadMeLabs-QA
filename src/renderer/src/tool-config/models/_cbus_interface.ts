import ApplianceInterface from './_appliance_interface'

interface CbusInterface extends ApplianceInterface {
    automationBase: number
    automationGroup: number
    automationId: number
    automationType: string
}

export default CbusInterface
