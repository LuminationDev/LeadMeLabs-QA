/**
 * This file contains the titles and text for each of the Full Checks.
 */
//region HARDWARE SECTION
export const BATTERY = {
    "Headsets": "All batteries are charging and capable of a full charge.",
    "Controllers": "All controllers are charging and capable of a full charge.",
    "Tablets": "All tablets are charging and capable of a full charge"
}

export const VIDEO_CABLES = {
    "Video Cable": "A video cable is connected from the Graphics Card (not the motherboard) to HDMI 1 on the projector.",
    "Additional Cables": "If additional cables are connected for Presentation mode, they are connected to a secondary display input."
}

export const PROJECTORS = {
    "Visual Quality": "Projector is displaying in the correct orientation, with no warping or blurriness.",
    "Networking": "Unique ID, IP Address, Subnet, Gateway and DNS Addresses are set, and listed correctly in the handover document."
}

export const KEYBOARD = {
    "USB Receiver": "The keyboard has been paired with a USB receiver.",
    "Recovery Mode": "The keyboard works in Windows Recovery Mode.",
    "Windows": "The keyboard works in Windows OS.",
    "BIOS Mode": "The keyboard works in BIOS menu."
}

export const BIOS_SETTINGS = {
    "Wake on LAN": "Wake on LAN is enabled.",
    "Restore Power": "Restore Power after AC loss is set to 'Power On’."
}
//endregion

//region NETWORK SECTION
//Contains two additional automatic checks
//  - IPv4 Settings
//  - Network Checks
export const MILESITE_ROUTER = {
    "Devices": "Device is viewable in the Milesight Router web interface.",
    "IP Address": "Device has the correct IP address in the Milesight Router web interface.",
    "Config File": "The master Config file is uploaded in the Milesight Router web interface.",
}

export const CBUS = {
    "Scripts": "The CBUS template contains the necessary scripts and objects.",
    "Keywords": "The keyword ‘sendToNuc’ has been added to all Lumination C-Bus objects."
}
//endregion

//region WINDOWS SECTION
//Contains an additional automatic check
//  - Windows Settings
export const HANDOVER = {
    "Hostname": "Hostname is set and recorded in the Lab Handover Doc.",
    "MAC Address": "MAC Address is set and recorded in the Lab Handover Doc."
}

export const DRIVERS = {
    "Windows": "Windows is up-to-date.",
    "Devices": "Any device drivers with warning symbols have been resolved.",
    "Motherboard": "The motherboard drivers and firmware are up to date.",
    "AMD Adrenalin": "AMD Adrenalin is set to only run recommended updates (not recommended + optional)."
}

export const EXECUTABLES = {
    "Rebooting": "Station.exe & NUC.exe launch on start up each time after rebooting 3 times consecutively."
}
//endregion

//region SECURITY SECTION
export const PASSWORDS = {
    "Projector": "The projector's web interface password has been changed and is logged in Bitwarden.",
    "MileSight Router": "The milesight router has a complex password and is logged in Bitwarden.",
    "C-Bus": "The C-Bus has a complex password and is logged in Bitwarden.",
    "Steam Account": "The Steam accounts have complex passwords and is logged in Bitwarden.",
    "Family Mode PIN": "Family mode PIN is unique and is logged in Bitwarden."
}

export const LEADME_SECURITY = {
    "Tablet PIN": "LeadMe Tablet PIN is unique and is logged in Bitwarden.",
    "Google Account": "LeadMe Tablet Google account is unique, has a complex password, and is logged in Bitwarden."
}
//endregion

//region SOFTWARE SECTION
//Contains two additional automatic checks
//  - LeadMe Launcher
//  - Steam
export const STEAM = {
    "Steam Guard": "Security settings: Steamguard is disabled.",
    "Remote Play": "Remote Play: Disable all settings.",
    "Broadcasting": "Broadcasting: Disable broadcasting."
}
//endregion

//region IMVR SECTION
//Contains two additional automatic checks
//  - HTC Hardware
//  - VR Experiences
export const VIVE = {
    "VIVE Wireless": "The display and power cables are plugged in at the back of the wireless unit.",
    "Headsets": "The headset has been paired and been given a device name.",
    "Base Stations": "Each base station is operating on a unique channel.",
    "Hardware Condition": "There aren't signs of physical damage to the headsets or controllers.",
}

export const VIRTUAL_REALITY = {
    "VR Room Setup": "The floor in-experience is the same height as the physical floor, and the headset experience faces the projector screen.",
    "Boundary Perimeter": "The perimeter of the boundary is visible when moving around near the LED ring, and once outside the active experience is hidden.",
    "Headset Tracking": "The headset doesn't drop out when moving around the play space.",
    "Controller Tracking": "When the boundary is traced in Tiltbrush at low, mid and high heights, the end result shows a consistent brush stroke.",
    "Headset Inactivity": "When an experience is left inactive for 5+ minutes, it can be picked up and resumed without the headset going blank."
}
//endregion

//TODO TO BE COMPLETED - NEEDS NOTION SHEET UPDATE
//region LEADME SECTION

//endregion