//Structure
//type
//  - page
//  - description
//  - category
//      - group
//          - checks
//          - description
//          - devices (software/appliances the check relates to)

import { CheckObject } from "../../tool-qa/interfaces/_routeItems";

/**
 * This file contains the titles and text for each of the Full Checks.
 */
//region HARDWARE SECTION
export const BATTERY: CheckObject = {
    "parent": "hardware",
    "page": "battery",
    "description": "Headsets, controllers, and tablets",
    "category": [
        {
            "Cabinet": {
                "checks": {
                    "Headsets": "All batteries are charging and capable of a full charge.",
                    "Controllers": "All controllers are charging and capable of a full charge."
                },
                "description": "The LeadMe Storage Cabinet",
                "devices": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                }
            }
        },
        {
            "Tablets": {
                "checks": {
                    "Tablets": "All tablets are charging and capable of a full charge."
                },
                "description": "Samsung Tablets",
                "devices": {
                    "station": false,
                    "tablet": true,
                    "nuc": false,
                    "cbus": false
                }
            }
        }
    ]
};

export const VIDEO_CABLES: CheckObject = {
    "parent": "hardware",
    "page": "video_cables",
    "description": "Cabling for projectors",
    "category": [
        {
            "HDMI": {
                "checks": {
                    "Video Cable": "A video cable is connected from the Graphics Card (not the motherboard) to HDMI 1 on the projector."
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                }
            },
        },
        {
            "Other": {
                "checks": {
                    "Additional Cables": "If additional cables are connected for Presentation mode, they are connected to a secondary display input."
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                }
            }
        }
    ]
};

export const PROJECTORS: CheckObject = {
    "parent": "hardware",
    "page": "projectors",
    "description": "Display quality and configuration",
    "category": [
        {
            "Visuals": {
                "checks": {
                    "Visual Quality": "Projector is displaying in the correct orientation, with no warping or blurriness."
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                }
            },
        },
        {
            "Network": {
                "checks": {
                    "Networking": "Unique ID, IP Address, Subnet, Gateway and DNS Addresses are set, and listed correctly in the handover document."
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": true,
                    "nuc": true,
                    "cbus": true
                }
            }
        }
    ]
};

export const KEYBOARD: CheckObject = {
    "parent": "hardware",
    "page": "keyboard",
    "description": "Keyboard connection to station",
    "category": [
        {
            "TODO": {
                "checks": {
                    "USB Receiver": "The keyboard has been paired with a USB receiver.",
                    "Recovery Mode": "The keyboard works in Windows Recovery Mode.",
                    "Windows": "The keyboard works in Windows OS.",
                    "BIOS Mode": "The keyboard works in BIOS menu."
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                }
            }
        }
    ]
};

export const BIOS_SETTINGS: CheckObject = {
    "parent": "hardware",
    "page": "bios_settings",
    "description": "Startup and reboot settings",
    "category": [
        {
            "TODO": {
                "checks": {
                    "Wake on LAN": "Wake on LAN is enabled.",
                    "Restore Power": "Restore Power after AC loss is set to 'Power On’."
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": false,
                    "nuc": true,
                    "cbus": false
                }
            }
        }
    ]
};

export const HARDWARE: CheckObject[] = [BATTERY, VIDEO_CABLES, PROJECTORS, KEYBOARD, BIOS_SETTINGS];
//endregion

//region NETWORK SECTION
//Contains two additional automatic checks
//  - IPv4 Settings
//  - Network Checks
export const MILESITE_ROUTER: CheckObject = {
    "parent": "network",
    "page": "milesite_router",
    "description": "Web interface and devices",
    "category": [
        {
            "TODO": {
                "checks": {
                    "Devices": "Device is viewable in the Milesight Router web interface.",
                    "IP Address": "Device has the correct IP address in the Milesight Router web interface.",
                    "Config File": "The master Config file is uploaded in the Milesight Router web interface.",
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": true,
                    "nuc": true,
                    "cbus": false
                }
            }
        }
    ]
};

export const CBUS: CheckObject = {
    "parent": "network",
    "page": "cbus",
    "description": "Configuration and connectivity",
    "category": [
        {
            "TODO": {
                "checks": {
                    "Scripts": "The CBUS template contains the necessary scripts and objects.",
                    "Keywords": "The keyword ‘sendToNuc’ has been added to all Lumination C-Bus objects."
                },
                "description": "Put something here later",
                "devices": {
                    "station": false,
                    "tablet": false,
                    "nuc": false,
                    "cbus": true
                }
            }
        }
    ]
};
export const NETWORK = [MILESITE_ROUTER, CBUS];
//endregion

//region WINDOWS SECTION
//Contains an additional automatic check
//  - Windows Settings
export const HANDOVER: CheckObject = {
    "parent": "windows",
    "page": "handover",
    "description": "Document Details for Handover",
    "category": [
        {
            "TODO": {
                "checks": {
                    "Hostname": "Hostname is set and recorded in the Lab Handover Doc.",
                    "MAC Address": "MAC Address is set and recorded in the Lab Handover Doc."
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": true,
                    "nuc": true,
                    "cbus": false
                }
            }
        }
    ]
};

export const DRIVERS: CheckObject = {
    "parent": "windows",
    "page": "drivers",
    "description": "Updates and Drivers",
    "category": [
        {
            "TODO": {
                "checks": {
                    "Windows": "Windows is up-to-date.",
                    "Devices": "Any device drivers with warning symbols have been resolved.",
                    "Motherboard": "The motherboard drivers and firmware are up to date.",
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": false,
                    "nuc": true,
                    "cbus": false
                }
            }
        },
        {
            "AMD": {
                "checks": {
                    "AMD Adrenalin": "AMD Adrenalin is set to only run recommended updates (not recommended + optional)."
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                }
            }
        }
    ]
};

export const EXECUTABLES: CheckObject = {
    "parent": "windows",
    "page": "executables",
    "description": "Launch on start up each time",
    "category": [
        {
            "TODO": {
                "checks": {
                    "Rebooting": "Station.exe & NUC.exe launch on start up each time after rebooting 3 times consecutively."
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": false,
                    "nuc": true,
                    "cbus": false
                }
            }
        }
    ]
};
export const WINDOWS = [HANDOVER, DRIVERS, EXECUTABLES];
//endregion

//region SECURITY SECTION
export const PASSWORDS: CheckObject = {
    "parent": "security",
    "page": "passwords",
    "description": "Passwords are sufficient and stored correctly",
    "category": [
        {
            "Projectors": {
                "checks": {
                    "Projector": "The projector's web interface password has been changed and is logged in Bitwarden."
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                }
            }
        },
        {
            "Router": {
                "checks": {
                    "MileSight Router": "The milesight router has a complex password and is logged in Bitwarden."
                },
                "description": "Put something here later",
                "devices": {
                    "station": false,
                    "tablet": false,
                    "nuc": true,
                    "cbus": false
                }
            }
        },
        {
            "Steam": {
                "checks": {
                    "Steam Account": "The Steam accounts have complex passwords and is logged in Bitwarden.",
                    "Family Mode PIN": "Family mode PIN is unique and is logged in Bitwarden."
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                }
            }
        },
        {
            "C-Bus": {
                "checks": {
                    "C-Bus": "The C-Bus has a complex password and is logged in Bitwarden."
                },
                "description": "Put something here later",
                "devices": {
                    "station": false,
                    "tablet": false,
                    "nuc": false,
                    "cbus": true
                }
            }
        }
    ]
};

export const LEADME_SECURITY: CheckObject = {
    "parent": "security",
    "page": "leadme_security",
    "description": "Passwords are sufficient and stored correctly",
    "category": [
        {
            "TODO": {
                "checks": {
                    "Tablet PIN": "LeadMe Tablet PIN is unique and is logged in Bitwarden.",
                    "Google Account": "LeadMe Tablet Google account is unique, has a complex password, and is logged in Bitwarden."
                },
                "description": "Put something here later",
                "devices": {
                    "station": false,
                    "tablet": true,
                    "nuc": false,
                    "cbus": false
                }
            }
        }
    ]
};

export const SECURITY = [PASSWORDS, LEADME_SECURITY];
//endregion

//region SOFTWARE SECTION
//Contains two additional automatic checks
//  - LeadMe Launcher
//  - Steam
export const STEAM: CheckObject = {
    "parent": "software",
    "page": "steam",
    "description": "Steam and SteamVR",
    "category": [
        {
            "TODO": {
                "checks": {
                    "Steam Guard": "Security settings: Steamguard is disabled.",
                    "Remote Play": "Remote Play: Disable all settings.",
                    "Broadcasting": "Broadcasting: Disable broadcasting."
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                }
            }
        }
    ]
};

export const SOFTWARE = [STEAM];
//endregion

//region IMVR SECTION
//Contains two additional automatic checks
//  - HTC Hardware
//  - VR Experiences
export const VIVE: CheckObject = {
    "parent": "imvr",
    "page": "vive",
    "description": "Hardware and Software",
    "category": [
        {
            "TODO": {
                "checks": {
                    "VIVE Wireless": "The display and power cables are plugged in at the back of the wireless unit.",
                    "Headsets": "The headset has been paired and been given a device name.",
                    "Base Stations": "Each base station is operating on a unique channel.",
                    "Hardware Condition": "There aren't signs of physical damage to the headsets or controllers.",
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                }
            }
        }
    ]
};

export const VIRTUAL_REALITY: CheckObject = {
    "parent": "imvr",
    "page": "virtual_reality",
    "description": "Functionality in VR (Tiltbush)",
    "category": [
        {
            "TODO": {
                "checks": {
                    "VR Room Setup": "The floor in-experience is the same height as the physical floor, and the headset experience faces the projector screen.",
                    "Boundary Perimeter": "The perimeter of the boundary is visible when moving around near the LED ring, and once outside the active experience is hidden.",
                    "Headset Tracking": "The headset doesn't drop out when moving around the play space.",
                    "Controller Tracking": "When the boundary is traced in Tiltbrush at low, mid and high heights, the end result shows a consistent brush stroke.",
                    "Headset Inactivity": "When an experience is left inactive for 5+ minutes, it can be picked up and resumed without the headset going blank."
                },
                "description": "Put something here later",
                "devices": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                }
            }
        }
    ]
};

export const IMVR = [VIVE, VIRTUAL_REALITY];
//endregion

//TODO TO BE COMPLETED - NEEDS NOTION SHEET UPDATE
//region LEADME SECTION

//endregion
