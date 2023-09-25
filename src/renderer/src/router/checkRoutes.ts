import QuickCheck from "@renderer/tool-qa/screens/QuickCheck.vue";
import FullCheck from "@renderer/tool-qa/screens/FullCheck.vue";
import TheNetwork from "@renderer/tool-qa/components/fullCheck/screens/TheNetwork.vue";
import TheWindows from "@renderer/tool-qa/components/fullCheck/screens/TheWindows.vue";
import TheSoftware from "@renderer/tool-qa/components/fullCheck/screens/TheSoftware.vue";
import ThePhysical from "@renderer/tool-qa/components/fullCheck/screens/ThePhysical.vue";
import TheSecurity from "@renderer/tool-qa/components/fullCheck/screens/TheSecurity.vue";
import TheAppliances from "@renderer/tool-qa/components/fullCheck/Appliances/TheAppliances.vue";
import TheReport from "@renderer/tool-qa/components/fullCheck/Report/TheReport.vue";

/**
 * Routes used for the Quick Lab Check
 */
export const quickRoutes = [
    {
        path: '/check/quick',
        name: 'quick-setup',
        component: QuickCheck,
        meta: {
            prev: '/check/selection'
        }
    },
    {
        path: '/check/quick/auto',
        name: 'quick-auto',
        component: QuickCheck,
        meta: {
            prev: '/check/quick'
        }
    }
];

/**
 * Routes used for the Full Lab Check
 */
export const fullRoutes = [
    {
        path: '/check/full',
        name: 'full-description',
        component: FullCheck,
        meta: {
            next: '/check/full/appliances',
            nextText: 'Start Test',
            prev: '/check/selection'
        }
    },

    //Appliance Route
    {
        path: '/check/full/appliances',
        name: 'full-appliance',
        component: TheAppliances,
        meta: {
            addComment: true,
            userInput: true, //Requires user input to proceed to the next page
            canSkip: true,
            next: '/check/full/networking',
            prev: '/check/full',
            progress: 0
        }
    },

    //Networking Routes
    {
        path: '/check/full/networking',
        name: 'full-networking',
        component: TheNetwork,
        meta: {
            next: '/check/full/networking/cabling',
            prev: '/check/full',
            progress: 0
        }
    },
    {
        path: '/check/full/networking/cabling',
        name: 'full-cabling',
        component: TheNetwork,
        meta: {
            addComment: true,
            userInput: true,
            canSkip: true, //The user can skip the page but requires a comment
            next: '/check/full/networking/network',
            prev: '/check/full/networking',
            progress: 10,
            trackerName: "CABLING" //Name of the key in the object tracker to save skip messages/comments to
        }
    },
    {
        path: '/check/full/networking/network',
        name: 'full-network',
        component: TheNetwork,
        meta: {
            addComment: true,
            userInput: true,
            canSkip: true,
            next: '/check/full/networking/cbus',
            prev: '/check/full/networking/cabling',
            progress: 20,
            trackerName: "NETWORK"
        }
    },
    {
        path: '/check/full/networking/cbus',
        name: 'full-cbus-options',
        component: TheNetwork,
        meta: {
            addComment: true,
            userInput: true,
            canSkip: true,
            next: '/check/full/networking/report',
            prev: '/check/full/networking/network',
            progress: 30,
            trackerName: "CBUS"
        }
    },
    {
        path: '/check/full/networking/report',
        name: 'full-network-report',
        component: TheNetwork,
        meta: {
            next: '/check/full/windows',
            prev: '/check/full/networking/cbus',
            progress: 30,
            nextText: 'Proceed'
        }
    },

    //Windows Routes
    {
        path: '/check/full/windows',
        name: 'full-windows',
        component: TheWindows,
        meta: {
            next: '/check/full/windows/bios',
            prev: '/check/full/networking/cbus',
            progress: 30
        }
    },
    {
        path: '/check/full/windows/bios',
        name: 'full-bios',
        component: TheWindows,
        meta: {
            addComment: true,
            userInput: true,
            canSkip: true,
            next: '/check/full/windows/settings',
            prev: '/check/full/windows',
            progress: 40,
            trackerName: "BIOS"
        }
    },
    {
        path: '/check/full/windows/settings',
        name: 'full-windows-settings',
        component: TheWindows,
        meta: {
            addComment: true,
            userInput: true,
            canSkip: true,
            next: '/check/full/windows/report',
            prev: '/check/full/windows/bios',
            progress: 50,
            trackerName: "WINDOWS"
        }
    },
    {
        path: '/check/full/windows/report',
        name: 'full-windows-report',
        component: TheWindows,
        meta: {
            next: '/check/full/software',
            prev: '/check/full/windows/settings',
            progress: 50,
            nextText: 'Proceed'
        }
    },

    //Windows Routes
    {
        path: '/check/full/software',
        name: 'full-software',
        component: TheSoftware,
        meta: {
            next: '/check/full/software/steam',
            prev: '/check/full/windows/settings',
            progress: 50
        }
    },
    {
        path: '/check/full/software/steam',
        name: 'full-steam',
        component: TheSoftware,
        meta: {
            addComment: true,
            userInput: true,
            canSkip: true,
            next: '/check/full/software/report',
            prev: '/check/full/software',
            progress: 60,
            trackerName: "STEAM"
        }
    },
    {
        path: '/check/full/software/report',
        name: 'full-software-report',
        component: TheSoftware,
        meta: {
            next: '/check/full/physical',
            prev: '/check/full/software/steam',
            progress: 60,
            nextText: 'Proceed'
        }
    },

    //Physical routes
    {
        path: '/check/full/physical',
        name: 'full-physical',
        component: ThePhysical,
        meta: {
            next: '/check/full/physical/keyboard',
            prev: '/check/full/software/steam',
            progress: 60
        }
    },
    {
        path: '/check/full/physical/keyboard',
        name: 'full-keyboard',
        component: ThePhysical,
        meta: {
            addComment: true,
            userInput: true,
            canSkip: true,
            next: '/check/full/physical/vive',
            prev: '/check/full/physical',
            progress: 70,
            trackerName: "KEYBOARD"
        }
    },
    {
        path: '/check/full/physical/vive',
        name: 'full-vive',
        component: ThePhysical,
        meta: {
            addComment: true,
            userInput: true,
            canSkip: true,
            next: '/check/full/physical/projector',
            prev: '/check/full/physical/keyboard',
            progress: 80,
            trackerName: "VIVE"
        }
    },
    {
        path: '/check/full/physical/projector',
        name: 'full-projector',
        component: ThePhysical,
        meta: {
            addComment: true,
            userInput: true,
            canSkip: true,
            next: '/check/full/physical/report',
            prev: '/check/full/physical/vive',
            progress: 90,
            trackerName: "PROJECTOR"
        }
    },
    {
        path: '/check/full/physical/report',
        name: 'full-physical-report',
        component: ThePhysical,
        meta: {
            next: '/check/full/security',
            prev: '/check/full/physical/projector',
            progress: 90,
            nextText: 'Proceed'
        }
    },

    //Security routes
    {
        path: '/check/full/security',
        name: 'full-security',
        component: TheSecurity,
        meta: {
            next: '/check/full/security/bitwarden',
            prev: '/check/full/physical/projector',
            progress: 90
        }
    },
    {
        path: '/check/full/security/bitwarden',
        name: 'full-bitwarden',
        component: TheSecurity,
        meta: {
            addComment: true,
            userInput: true,
            canSkip: true,
            next: '/check/full/security/report',
            prev: '/check/full/security',
            progress: 100,
            trackerName: "BITWARDEN"
        }
    },
    {
        path: '/check/full/security/report',
        name: 'full-security-report',
        component: TheSecurity,
        meta: {
            next: '/check/full/report',
            prev: '/check/full/security/bitwarden',
            progress: 100,
            nextText: 'Proceed'
        }
    },

    //Basic report preview
    {
        path: '/check/full/report',
        name: 'full-report',
        component: TheReport,
        meta: {
            prev: '/check/full/security/report',
            progress: 100
        }
    }
];
