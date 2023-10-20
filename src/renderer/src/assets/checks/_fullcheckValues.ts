//Structure
//type
//  - page
//  - description
//  - category
//      - group
//          - checks
//          - description
//          - targets (software/appliances the check relates to)

import { CheckObject } from "../../tool-qa/interfaces/_routeItems";
import milesightSample from '../../assets/images/milesight-sample.png'

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
                    "Headsets' batteries": {
                        description: "All batteries are charging and capable of a full charge.",
                        guide: [
                            {
                                imageSource: milesightSample,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                    "Controllers": {
                        description: "All controllers are charging and capable of a full charge.",
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
                    "Tablets": {
                        description: "All tablets are charging and capable of a full charge.",
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
            },
        },
        {
            "Other": {
                "checks": {
                    "Additional Cables": {
                        description: "If additional cables are connected for Presentation mode, they are connected to a secondary display input.",
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
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                    "Networking": {
                        description: "Unique ID, IP Address, Subnet, Gateway and DNS Addresses are set, and listed correctly in the handover document.",
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
            "TODO": {
                "checks": {
                    "USB Receiver": {
                        description: "The keyboard has been paired with a USB receiver.",
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
                    "Recovery Mode": {
                        description: "The keyboard works in Windows Recovery Mode.",
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
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                    "BIOS Mode": {
                        description: "The keyboard works in BIOS menu.",
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

export const BIOS_SETTINGS: CheckObject = {
    "parent": "hardware",
    "page": "bios_settings",
    "description": "Startup and reboot settings",
    "category": [
        {
            "TODO": {
                "checks": {
                    "Wake on LAN": {
                        description: "Wake on LAN is enabled.",
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
                    "Restore Power": {
                        description: "Restore Power after AC loss is set to 'Power On’.",
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
                "description": "Put something here later",
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
                "description": "Put something here later",
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
            "TODO": {
                "checks": {
                    "Scripts": {
                        description: "The CBUS template contains the necessary scripts and objects.",
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
                    "Keywords": {
                        description: "The keyword ‘sendToNuc’ has been added to all Lumination C-Bus objects.",
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
            "TODO": {
                "checks": {
                    "Hostname": {
                        description: "Hostname is set and recorded in the Lab Handover Doc.",
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
                    "MAC Address": {
                        description: "MAC Address is set and recorded in the Lab Handover Doc.",
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
            "TODO": {
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

//region SECURITY SECTION
export const PASSWORDS: CheckObject = {
    "parent": "security",
    "page": "passwords",
    "description": "Passwords are sufficient and stored correctly",
    "category": [ // todo tablet google account
        {
            "Projectors": {
                "checks": {
                    "Projector": {
                        description: "The projector's web interface password has been changed and is logged in Bitwarden.",
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
                        description: "The Steam accounts have complex passwords and is logged in Bitwarden.",
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
            "C-Bus": {
                "checks": {
                    "C-Bus": {
                        description: "The C-Bus has a complex password and is logged in Bitwarden.",
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
            "TODO": {
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
                "description": "Put something here later",
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
            "TODO": {
                "checks": {
                    "Steam Guard": {
                        description: "Security settings: Steamguard is disabled.",
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
                                imageSource: null,
                                text: '<h3>Open Milesight portal</h3><p>Default IP address is 192.168.1.10</p>'
                            },
                            {
                                imageSource: null,
                                text: '<h3>Navigate to devices page</h3><p>Starting in the sidebar > Network > Interface > Settings</p>'
                            }
                        ]
                    },
                    "Broadcasting": {
                        description: "Broadcasting: Disable broadcasting.",
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
                    "VIVE Wireless": {
                        description: "The display and power cables are plugged in at the back of the wireless unit.",
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

export const VIRTUAL_REALITY: CheckObject = {
    "parent": "imvr",
    "page": "virtual_reality",
    "description": "Functionality in VR (Tiltbush)",
    "category": [
        {
            "TODO": {
                "checks": {
                    "VR Room Setup": {
                        description: "The floor in-experience is the same height as the physical floor, and the headset experience faces the projector screen.",
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
                    "Boundary Perimeter": {
                        description: "The perimeter of the boundary is visible when moving around near the LED ring, and once outside the active experience is hidden.",
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
                    "Headset Tracking": {
                        description: "The headset doesn't drop out when moving around the play space.",
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
                    "Controller Tracking": {
                        description: "When the boundary is traced in Tiltbrush at low, mid and high heights, the end result shows a consistent brush stroke.",
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
                    "Headset Inactivity": {
                        description: "When an experience is left inactive for 5+ minutes, it can be picked up and resumed without the headset going blank.",
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

export const IMVR = [VIVE, VIRTUAL_REALITY];
//endregion

//TODO TO BE COMPLETED - NEEDS NOTION SHEET UPDATE
//region LEADME SECTION

//endregion


//region EXECUTABLES SECTION
export const EXECUTABLES: CheckObject = {
    "parent": "programs",
    "page": "executables",
    "description": "Launch on start up each time",
    "category": [
        { // todo - ensure progress is saved before doing this, particularly if running on a nuc
            "TODO": {
                "checks": {
                    "Rebooting": {
                        description: "Station.exe & NUC.exe launch on start up each time after rebooting 3 times consecutively.",
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


export const ALL_VALUES = [HARDWARE, NETWORK, WINDOWS, SECURITY, SOFTWARE, IMVR, PROGRAMS]