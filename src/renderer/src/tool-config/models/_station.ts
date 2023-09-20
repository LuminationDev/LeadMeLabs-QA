import ApplianceInterface from './_appliance_interface'
import Appliance from './_appliance'

class Station extends Appliance implements ApplianceInterface {
    ip_address: string
    port: number
    theatre_id: string
    theatre_lead: string
    mac_address: string
    led_ring_id: number

    constructor(
        id = 0,
        name = '',
        ip_address = '',
        port = 0,
        theatre_id = '',
        theatre_lead = '',
        room = '',
        mac_address = '',
        led_ring_id = 0
    ) {
        super(id, name, room)
        this.ip_address = ip_address
        this.port = port
        this.theatre_id = theatre_id
        this.theatre_lead = theatre_lead

        this.mac_address = mac_address
        this.led_ring_id = led_ring_id
    }
}

export default Station
