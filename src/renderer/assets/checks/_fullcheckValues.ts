//Structure
//type
//  - page
//  - description
//  - category
//      - group
//          - checks
//          - description
//          - targets (software/appliances the check relates to)

import { CheckObject } from "../../src-qa/interfaces/_routeItems";
import remotePlay from '../guidesImages/RemotePlay.png'
import steamSettings from '../guidesImages/SteamSettings.png'
import leadMeLibrary from '../guidesImages/LeadMeLibrary.jpg'
import ipConfigAll from '../guidesImages/IpConfigAll.png'
import hostname from '../guidesImages/Hostname.png'
import batteryScreenshot from '../guidesImages/BatteryScreenshot.jpg'
import windowsRecovery from '../guidesImages/WindowsRecovery.png'
import batteryFourBars from '../guidesImages/batteryFourBars.jpg'
import epsonRemote from '../guidesImages/epsonRemote.jpg'
import BroadcastSetting from '../guidesImages/BroadcastSetting.png'
import CbusScripts from '../guidesImages/CbusScripts.png'
import SendToNUC from '../guidesImages/SendToNUC.png'
import ControllersCharge from '../guidesImages/ControllersCharge.jpg'
import EpsonAccessIpSettings from '../guidesImages/EpsonAccessIpSettings.jpg'
import EpsonNetwork from '../guidesImages/EpsonNetwork.jpg'

/**
 * This file contains the titles and text for each of the Full Checks.
 */
//region HARDWARE SECTION
export const BATTERY: CheckObject = {
    "parent": "hardware",
    "page": "battery",
    "description": "Headsets and controllers",
    "category": [
        {
            "Cabinet": {
                "checks": {
                    "Headsets' batteries": {
                        description: "All batteries are charging and capable of a full charge.",
                        guide: [
                            {
                                imageSource: batteryFourBars,
                                text: '<h3>Charge batteries</h3><p>After charging, check that batteries can reach 4 bars</p>'
                            }
                        ]
                    },
                    "Controllers": {
                        description: "All controllers are charging and capable of a full charge.",
                        guide: [
                            {
                                imageSource: ControllersCharge,
                                text: '<h3>Charge controllers</h3><p>After charging, check the controllers battery level using LeadMe</p>'
                            }
                        ]
                    }
                },
                "description": "The LeadMe Storage Cabinet",
                "targets": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                },
                "devices": {}
            }
        },
        {
            "Tablets": {
                "checks": {
                    "Charging": {
                        description: "All tablets are charging and capable of a full charge.",
                        guide: [
                            {
                                imageSource: batteryScreenshot,
                                text: '<h3>For each tablet</h3><p>Swipe down from the top and check that the charging symbol is shown. Check that each tablet can reach 100%</p>'
                            }
                        ]
                    }
                },
                "description": "Samsung Tablets",
                "targets": {
                    "station": false,
                    "tablet": true,
                    "nuc": false,
                    "cbus": false
                },
                "devices": {}
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
                    "Video Cable": {
                        description: "A video cable is connected from the Graphics Card (not the motherboard) to HDMI 1 on the projector.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>For each computer</h3><p>Check that the HDMI cable is in the correct slot following the image above</p>'
                            }
                        ]
                    }
                },
                "description": "HDMI to graphics card",
                "targets": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                },
                "devices": {}
            },
        },
        {
            "Other": {
                "checks": {
                    "Additional Cables": {
                        description: "If additional cables are connected for Presentation mode, they are connected to a secondary display input.",
                        guide: [
                        ]
                    }
                },
                "description": "Cabling",
                "targets": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                },
                "devices": {}
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
            "Projectors": {
                "checks": {
                    "Visual Quality": {
                        description: "Projector is displaying in the correct orientation, with no warping or blurriness.",
                        guide: [
                            {
                                imageSource: null, // todo image of projection edges
                                text: '<h3>Check edges</h3><p>Check that there is no overlap between the edges of each projection</p>'
                            },
                            {
                                imageSource: null, // todo image of blurry projection
                                text: '<h3>Check blurriness</h3><p>Check that the image is crisp</p>'
                            }
                        ]
                    },
                    "Networking": {
                        description: "Unique ID, IP Address, Subnet, Gateway and DNS Addresses are set, and listed correctly in the handover document.",
                        guide: [
                            {
                                imageSource: epsonRemote,
                                text: '<h3>Pair the remote with the projector</h3><p>Hold the ID button and press the number of the projector</p>'
                            },
                            {
                                imageSource: epsonRemote,
                                text: '<h3>Open settings</h3><p>Press the settings button on the remote</p>'
                            },
                            {
                                imageSource: EpsonAccessIpSettings,
                                text: '<h3>Navigate to the network settings</h3><p>Open Wired Lan Info and then open IP Settings</p>'
                            }
                        ]
                    }
                },
                "description": "Projector configuration",
                "targets": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                },
                "devices": {}
            },
        }
    ]
};

export const KEYBOARD: CheckObject = {
    "parent": "hardware",
    "page": "keyboard",
    "description": "Keyboard connection to station",
    "category": [
        {
            "Keyboard": {
                "checks": {
                    // "USB Receiver": {
                    //     description: "The keyboard has been paired with a USB receiver.",
                    //     guide: [
                    //         {
                    //             imageSource: null,
                    //             text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                    //         },
                    //         {
                    //             imageSource: null,
                    //             text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                    //         }
                    //     ]
                    // },
                    // "Recovery Mode": {
                    //     description: "The keyboard works in Windows Recovery Mode.",
                    //     guide: [
                    //         {
                    //             imageSource: null,
                    //             text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                    //         },
                    //         {
                    //             imageSource: null,
                    //             text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                    //         }
                    //     ]
                    // },
                    "Bluetooth": {
                        description: "The keyboard is paired via bluetooth.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                    "Windows OS": {
                        description: "The keyboard works in Windows OS.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Use the keyboard</h3><p>Does it work?</p>'
                            }
                        ]
                    }
                    // "BIOS Mode": {
                    //     description: "The keyboard works in BIOS menu.",
                    //     guide: [
                    //         {
                    //             imageSource: null,
                    //             text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                    //         },
                    //         {
                    //             imageSource: null,
                    //             text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                    //         }
                    //     ]
                    // }
                },
                "description": "Keyboard connectivity",
                "targets": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                },
                "devices": {}
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
            "BIOS": {
                "checks": {
                    "Wake on LAN": {
                        description: "Wake on LAN is enabled.",
                        guide: [
                            {
                                imageSource: windowsRecovery,
                                text: '<h3>Open the BIOS</h3><p>Windows Settings > Update & Security > Recovery > Advanced Setup > Restart Now > Troubleshoot</p>'
                            }
                        ]
                    },
                    "Restore Power": {
                        description: "Restore Power after AC loss is set to 'Power On’.",
                        guide: [
                            {
                                imageSource: windowsRecovery,
                                text: '<h3>Open the BIOS</h3><p>Windows Settings > Update & Security > Recovery > Advanced Setup > Restart Now > Troubleshoot</p>'
                            }
                        ]
                    }
                },
                "description": "Ensure BIOS is setup for power states",
                "targets": {
                    "station": true,
                    "tablet": false,
                    "nuc": true,
                    "cbus": false
                },
                "devices": {}
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
export const MILESIGHT_ROUTER: CheckObject = {
    "parent": "network",
    "page": "milesight_router",
    "description": "Web interface and devices",
    "category": [
        {
            "Milesight configuration": {
                "checks": {
                    "Devices": {
                        description: "Device is viewable in the Milesight Router web interface.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                    "IP Address": {
                        description: "Device has the correct IP address in the Milesight Router web interface.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    }
                },
                "description": "Devices successfully connected",
                "targets": {
                    "station": true,
                    "tablet": true,
                    "nuc": true,
                    "cbus": true
                },
                "devices": {}
            },
        },
        {
            "Milesight config file": {
                "checks": {
                    "Config File": {
                        description: "The master Config file is uploaded in the Milesight Router web interface.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                },
                "description": "Config file",
                "targets": {
                    "station": false,
                    "tablet": false,
                    "nuc": true,
                    "cbus": false
                },
                "devices": {}
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
            "CBus": {
                "checks": {
                    "Scripts": {
                        description: "The CBUS template contains the necessary scripts and objects.",
                        guide: [
                            {
                                imageSource: CbusScripts,
                                text: '<h3>Navigate to Cbus Scripts</h3><p>In the scripts tab in CBus, ensure that Identify and SendToNuc are present</p>'
                            }
                        ]
                    },
                    "Keywords": {
                        description: "The keyword ‘sendToNuc’ has been added to all Lumination C-Bus objects.",
                        guide: [
                            {
                                imageSource: SendToNUC,
                                text: '<h3>Navigate to CBus objects</h3><p>In the CBus objects page, ensure all objects that are expected to be controller have the "sendToNuc" keyword</p>'
                            }
                        ]
                    }
                },
                "description": "CBus for LeadMe",
                "targets": {
                    "station": false,
                    "tablet": false,
                    "nuc": false,
                    "cbus": true
                },
                "devices": {}
            }
        }
    ]
};
export const NETWORK = [MILESIGHT_ROUTER, CBUS];
//endregion

//region WINDOWS SECTION
//Contains an additional automatic check
//  - Windows Settings
export const HANDOVER: CheckObject = {
    "parent": "windows",
    "page": "handover",
    "description": "Document Details for Handover",
    "category": [ // todo - we should be able to display the hostname etc on this page to help out
        {
            "Handover details": {
                "checks": {
                    "Hostname": {
                        description: "Hostname is set and recorded in the Lab Handover Doc.",
                        guide: [
                            {
                                imageSource: hostname,
                                text: '<h3>Open Command Prompt</h3><p>Type <code>hostname</code> and press enter. Record the result</p>'
                            }
                        ]
                    },
                    "MAC Address": {
                        description: "MAC Address is set and recorded in the Lab Handover Doc.",
                        guide: [
                            {
                                imageSource: ipConfigAll,
                                text: '<h3>Open Command Prompt</h3><p>Once open, type <code>ipconfig /all</code> and press enter</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Record physical address</h3><p>Record the physical address of the ethernet adapter</p>'
                            }
                        ]
                    }
                },
                "description": "Document details",
                "targets": {
                    "station": true,
                    "tablet": true,
                    "nuc": true,
                    "cbus": false
                },
                "devices": {}
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
            "Windows Updates": {
                "checks": {
                    "Windows": {
                        description: "Windows is up-to-date.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                    "Device Warnings": {
                        description: "Any device drivers with warning symbols have been resolved.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                    "Motherboard": {
                        description: "The motherboard drivers and firmware are up to date.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                },
                "description": "Put something here later",
                "targets": {
                    "station": true,
                    "tablet": false,
                    "nuc": true,
                    "cbus": false
                },
                "devices": {}
            }
        },
        {
            "AMD": {
                "checks": {
                    "AMD Adrenalin": {
                        description: "AMD Adrenalin is set to only run recommended updates (not recommended + optional).",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    }
                },
                "description": "Put something here later",
                "targets": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                },
                "devices": {}
            }
        }
    ]
};
export const WINDOWS = [HANDOVER, DRIVERS];
//endregion

//region CONFIGURATION SECTION
export const CONFIGURATION = [];
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
                    "Projector": {
                        description: "The projector's web interface password has been changed and is logged in Bitwarden.",
                        guide: [
                            {
                                imageSource: epsonRemote,
                                text: '<h3>Pair the remote with the projector</h3><p>Hold the ID button and press the number of the projector</p>'
                            },
                            {
                                imageSource: epsonRemote,
                                text: '<h3>Open settings</h3><p>Press the settings button on the remote</p>'
                            },
                            {
                                imageSource: EpsonNetwork,
                                text: '<h3>Navigate to the network settings</h3><p>Select "web control password" and change the password and record in bitwarden</p>'
                            }
                        ]
                    }
                },
                "description": "Put something here later",
                "targets": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                },
                "devices": {}
            }
        },
        {
            "Router": {
                "checks": {
                    "MileSight Router": {
                        description: "The milesight router has a complex password and is logged in Bitwarden.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    }
                },
                "description": "Put something here later",
                "targets": {
                    "station": false,
                    "tablet": false,
                    "nuc": true,
                    "cbus": false
                },
                "devices": {}
            }
        },
        {
            "Steam": {
                "checks": {
                    "Steam Account": {
                        description: "The Steam account passwords are logged in Bitwarden.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                    "Family Mode PIN": {
                        description: "Family mode PIN is unique and is logged in Bitwarden.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    }
                },
                "description": "Steam security details",
                "targets": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                },
                "devices": {}
            }
        },
        {
            "C-Bus": {
                "checks": {
                    "C-Bus": {
                        description: "The C-Bus password is logged in Bitwarden.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    }
                },
                "description": "C-Bus security details",
                "targets": {
                    "station": false,
                    "tablet": false,
                    "nuc": false,
                    "cbus": true
                },
                "devices": {}
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
            "Tablet Security": {
                "checks": {
                    "Tablet PIN": {
                        description: "LeadMe Tablet PIN is unique and is logged in Bitwarden.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                    "Google Account": {
                        description: "LeadMe Tablet Google account is unique, has a complex password, and is logged in Bitwarden.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    }
                },
                "description": "Tablet security details",
                "targets": {
                    "station": false,
                    "tablet": true,
                    "nuc": false,
                    "cbus": false
                },
                "devices": {}
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
            "Manual Steam Settings": {
                "checks": {
                    "Steam Guard": {
                        description: "Security settings: Steam guard is disabled.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                    "Remote Play": {
                        description: "Remote Play: Disable all settings.",
                        guide: [
                            {
                                imageSource: steamSettings,
                                text: '<h3>Open Steam Settings</h3><p>Open Steam and open settings</p>'
                            },
                            {
                                imageSource: remotePlay,
                                text: '<h3>Disable Remote Play</h3><p>Navigate to remote play in the side menu. Disable all settings on the page</p>'
                            }
                        ]
                    },
                    "Broadcasting": {
                        description: "Broadcasting: Disable broadcasting.",
                        guide: [
                            {
                                imageSource: steamSettings,
                                text: '<h3>Open Steam Settings</h3><p>Open Steam and open settings</p>'
                            },
                            {
                                imageSource: BroadcastSetting,
                                text: '<h3>Disable Broadcasting</h3><p>Navigate to broadcast in the sidemenu and set the privacy setting to "Broadcasting disabled"</p>'
                            }
                        ]
                    }
                },
                "description": "Manual steam settings",
                "targets": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                },
                "devices": {}
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
            "Headset Hardware": {
                "checks": {
                    "Headset cables": {
                        description: "The display and power cables are plugged in at the back of the wireless unit.",
                        guide: [
                        ]
                    },
                    "Headsets": {
                        description: "The headset has been paired and been given a device name.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                    "Base Stations": {
                        description: "Each base station is operating on a unique channel.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                    "Hardware Condition": {
                        description: "There aren't signs of physical damage to the headsets or controllers.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                },
                "description": "Headset hardware setup",
                "targets": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                },
                "devices": {}
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
            "Virtual Reality": {
                "checks": {
                    "VR Room Setup": {
                        description: "The floor in-experience is the same height as the physical floor, and the headset experience faces the projector screen.",
                        guide: [
                            {
                                imageSource: leadMeLibrary,
                                text: '<h3>Launch Tilt Brush</h3><p>Using LeadMe Labs, launch Tilt Brush</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Place a controller on the floor</h3><p>Confirm that the controller in-experience is resting on the floor</p>'
                            }
                        ]
                    },
                    "Boundary Perimeter": {
                        description: "The perimeter of the boundary is visible when moving around near the LED ring, and once outside the active experience is hidden.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Put on the headset</h3><p>Navigate the edges of the LED ring and confirm that the boundary is visible</p>'
                            }
                        ]
                    },
                    "Headset Tracking": {
                        description: "The headset doesn't drop out when moving around the play space.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Put on the headset</h3><p>Move around the play space and monitor for any dropouts</p>'
                            }
                        ]
                    },
                    "Controller Tracking": {
                        description: "When the boundary is traced in Tiltbrush at low, mid and high heights, the end result shows a consistent brush stroke.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Launch Tilt Brush</h3><p>Trace the boundary with a brush by holding the trigger on the controller. Look for any gaps in the painting.</p>'
                            }
                        ]
                    },
                    "Headset Inactivity": {
                        description: "When an experience is left inactive for 5+ minutes, it can be picked up and resumed without the headset going blank.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Leave headset on stand</h3><p>Wait... wait a bit more... pick it up. Does it work?</p>'
                            }
                        ]
                    }
                },
                "description": "Manual headset checks",
                "targets": {
                    "station": true,
                    "tablet": false,
                    "nuc": false,
                    "cbus": false
                },
                "devices": {}
            }
        }
    ]
};

export const IMVR = [VIVE, VIRTUAL_REALITY];
//endregion


//region EXECUTABLES SECTION
export const EXECUTABLES: CheckObject = {
    "parent": "programs",
    "page": "executables",
    "description": "Launch on start up each time",
    "category": [
        { // todo - ensure progress is saved before doing this, particularly if running on a nuc
            "Executables": {
                "checks": {
                    "Rebooting": {
                        description: "Station.exe & NUC.exe launch on start up each time after rebooting 3 times consecutively.",
                        guide: [
                            {
                                imageSource: null,
                                text: '<h3>Save if needed</h3><p>If running this software on a station or NUC, save and exit.</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Reboot 3 times</h3><p>Use the LeadMe tablet to reboot the lab 3 times</p>'
                            }
                        ]
                    }
                },
                "description": "Rebooting",
                "targets": {
                    "station": true,
                    "tablet": false,
                    "nuc": true,
                    "cbus": false
                },
                "devices": {}
            }
        }
    ]
};

export const PROGRAMS = [EXECUTABLES];
//endregion


export const ALL_VALUES = [HARDWARE, NETWORK, WINDOWS, CONFIGURATION, SECURITY, SOFTWARE, IMVR, PROGRAMS]