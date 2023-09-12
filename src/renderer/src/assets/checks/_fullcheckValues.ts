/**
 * This file contains the titles and text for each of the Full Checks.
 */
export const CABLING = {
    "Device Power": "Each device is receiving power",
    "Video Cable": "Video cable is connected to the graphics card",
    "Projector HDMI": "Video cable that is connected to the PC is connected to HDMI 1 on the Projector",
    "Additional Cables": "Additional cables are connected for Presentation mode, they are connected to a secondary display input",
    "PC Ethernet": "An Ethernet cable is connected to each PC to the TP Link switch",
    "Projector Ethernet": "An Ethernet cable is connected to each Projector to the TP Link switch",
    "CBus Ethernet": "An Ethernet cable is connected to the CBus"
}

export const NETWORK = {
    "Milesight Router": "The devices are viewable in the Milesight router web interface and have the correct IP address"
}

export const CBUS = {
    "CBus Template": "The CBUS template contains the necessary scripts and objects, and that the keyword ‘sendToNuc’ has been added to all Lumination Cbus objects"
}

export const SECURITY = {

}

export const BIOS = {
    "Wake on LAN": "Wake on LAN or Resume by pcie device is enabled",
    "Restore Power": "Restore Power after AC loss is set to 'Power On'"
}

export const WINDOWS = {
    "Windows Updates": "Windows is up-to-date: Confirm via Settings > Update & Security > check for updates",
    "Device Manager": "Control Panel > Device Manager - any drivers with warning symbols have been resolved",
    "Motherboard": "The motherboard drivers and firmware are up to date",
    "AMD Adrenalin": "AMD Adrenalin is set to only run recommended updates, not recommended + optional",
    "Hostname": "Hostname is set and recorded in Lab Handover doc",
    "MAC Address": "MAC Address is set and recorded in Lab Handover doc",
    "LeadMe": "Station.exe / NUC.exe launches on start up each time after rebooting 3 times consecutively",
}