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

export const LAUNCHING = {
    "LAUNCHING": "Launching"
}

export const NETWORK = {
    "Milesight Interface": "The devices are viewable in the Milesight router web interface and have the correct IP address",
    "Milesight Router": "The master configuration file has been uploaded to the router"
}

export const CBUS = {
    "CBus Template": "The CBUS template contains the necessary scripts and objects, and that the keyword ‘sendToNuc’ has been added to all Lumination Cbus objects"
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

export const STEAM = {
    "Steam Guard": "Steam guard has been disabled for all accounts",
    "Remote Play": "Remote Play has all settings disabled",
    "Broadcasting": "Has been disabled",
}

export const KEYBOARD = {
    "Pairing": "The keyboard has been paired with a USB receiver",
    "Recovery Mode": "The keyboard works in Windows Recovery Mode",
    "BIOS": "The keyboard works in BIOs menu",
    "Windows OS": "The keyboard works in Windows OS",
}

export const VIVE = {
    "Pairing": "The headset has been paired and been given a device name",
    "Base Stations": "Each base station is operating on a unique channel"
}

export const PROJECTOR = {
    "Orientation": "The projector screen outputs in the correct orientation",
    "Network": "The Projectors IP address, subnet, gateway and DNS addresses are set according to the handover document",
    "Image": "The projectors' image is free of warps around the edges, signs of blur",
}

export const BITWARDEN = {
    "Steam Accounts": "The Steam accounts have complex passwords and is logged in Bitwarden under Collections: LLL Accounts > External Labs > [School]",
    "Family Pin": "Family mode PIN is unique and is logged in Bitwarden under Collections: LLL Accounts > External Labs > [School]",
    "Tablet Account": "LeadMe Labs Tablet Google account is unique, has a complex password and is logged in Bitwarden under Collections: LLL Accounts > External Labs > [School]",
}
