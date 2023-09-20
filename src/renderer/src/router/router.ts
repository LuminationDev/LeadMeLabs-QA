import { createRouter, createWebHashHistory } from 'vue-router';

//Generic screens
import Welcome from '@renderer/views/Welcome.vue';
import Settings from '@renderer/views/Settings.vue';

//QA Tool screens
import QuickCheck from "@renderer/tool-qa/screens/QuickCheck.vue";
import FullCheck from "@renderer/tool-qa/screens/FullCheck.vue";
import TheNetwork from "@renderer/tool-qa/components/fullCheck/Network/TheNetwork.vue";
import TheWindows from "@renderer/tool-qa/components/fullCheck/Windows/TheWindows.vue";
import TheIMVR from "@renderer/tool-qa/components/fullCheck/IMVR/TheIMVR.vue";
import TheAppliances from "@renderer/tool-qa/components/fullCheck/Appliances/TheAppliances.vue";
import TheReport from "@renderer/tool-qa/components/reports/TheReport.vue";

//Config Tool screens
import WelcomeScreen from "@renderer/tool-config/screens/WelcomeScreen.vue";
import ChecklistScreen from "@renderer/tool-config/screens/ChecklistScreen.vue";
import LightScreen from "@renderer/tool-config/screens/LightScreen.vue";
import RoomScreen from "@renderer/tool-config/screens/RoomScreen.vue";
import BlindScreen from "@renderer/tool-config/screens/BlindScreen.vue";
import ProjectorScreen from "@renderer/tool-config/screens/ProjectorScreen.vue";
import SplicerScreen from "@renderer/tool-config/screens/SplicerScreen.vue";
import LedRingScreen from "@renderer/tool-config/screens/LedRingScreen.vue";
import StationScreen from "@renderer/tool-config/screens/StationScreen.vue";
import SceneScreen from "@renderer/tool-config/screens/SceneScreen.vue";
import FinalScreen from "@renderer/tool-config/screens/FinalScreen.vue";

/**
 * Routes used for the Config tool
 */
const configToolRoutes = [
    {
        path: '/config/welcome',
        name: 'config-welcome',
        component: WelcomeScreen,
        meta: {
            next: '/config/checklist',
            prev: '/selection',
            progress: 0
        }
    },
    {
        path: '/config/checklist',
        name: 'checklist',
        component: ChecklistScreen,
        meta: {
            next: '/config/rooms',
            prev: '/config/welcome',
            progress: 10
        }
    },
    {
        path: '/config/rooms',
        name: 'rooms',
        component: RoomScreen,
        meta: {
            next: '/config/lights',
            prev: '/config/checklist',
            progress: 20
        }
    },
    {
        path: '/config/lights',
        name: 'lights',
        component: LightScreen,
        meta: {
            next: '/config/blinds',
            prev: '/config/rooms',
            progress: 30
        }
    },
    {
        path: '/config/blinds',
        name: 'blinds',
        component: BlindScreen,
        meta: {
            next: '/config/projectors',
            prev: '/config/lights',
            progress: 40
        }
    },
    {
        path: '/config/projectors',
        name: 'projectors',
        component: ProjectorScreen,
        meta: {
            next: '/config/splicers',
            prev: '/config/blinds',
            progress: 50
        }
    },
    {
        path: '/config/splicers',
        name: 'splicers',
        component: SplicerScreen,
        meta: {
            next: '/config/ledRings',
            prev: '/config/projectors',
            progress: 60
        }
    },
    {
        path: '/config/ledRings',
        name: 'ledRings',
        component: LedRingScreen,
        meta: {
            next: '/config/stations',
            prev: '/config/splicers',
            progress: 70
        }
    },
    {
        path: '/config/stations',
        name: 'stations',
        component: StationScreen,
        meta: {
            next: '/config/scenes',
            prev: '/config/ledRings',
            progress: 80
        }
    },
    {
        path: '/config/scenes',
        name: 'scenes',
        component: SceneScreen,
        meta: {
            next: '/config/final',
            prev: '/config/ledRings',
            progress: 90
        }
    },
    {
        path: '/config/final',
        name: 'final',
        component: FinalScreen,
        meta: {
            prev: '/config/scenes',
            progress: 100
        }
    }
]

/**
 * Routes used for the Quick Lab Check
 */
const quickRoutes = [
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
const fullRoutes = [
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
            userInput: true, //Requires user input to proceed to the next page
            canSkip: true,
            next: '/check/full/networking',
            prev: '/check/full'
        }
    },

    //Networking Routes
    {
        path: '/check/full/networking',
        name: 'full-networking',
        component: TheNetwork,
        meta: {
            next: '/check/full/networking/cabling',
            prev: '/check/full'
        }
    },
    {
        path: '/check/full/networking/cabling',
        name: 'full-cabling',
        component: TheNetwork,
        meta: {
            userInput: true, //Requires user input to proceed to the next page
            canSkip: true, //The user can skip the page but requires a comment
            next: '/check/full/networking/network',
            prev: '/check/full/networking'
        }
    },
    {
        path: '/check/full/networking/network',
        name: 'full-network',
        component: TheNetwork,
        meta: {
            userInput: true, //Requires user input to proceed to the next page
            canSkip: true,
            next: '/check/full/networking/cbus',
            prev: '/check/full/networking/cabling'
        }
    },
    {
        path: '/check/full/networking/cbus',
        name: 'full-cbus',
        component: TheNetwork,
        meta: {
            userInput: true, //Requires user input to proceed to the next page
            canSkip: true,
            next: '/check/full/networking/security',
            prev: '/check/full/networking/network'
        }
    },
    {
        path: '/check/full/networking/security',
        name: 'full-security',
        component: TheNetwork,
        meta: {
            userInput: true, //Requires user input to proceed to the next page
            canSkip: true,
            next: '/check/full/windows',
            prev: '/check/full/networking/cbus'
        }
    },

    //Windows Routes
    {
        path: '/check/full/windows',
        name: 'full-windows',
        component: TheWindows,
        meta: {
            next: '/check/full/windows/bios',
            prev: '/check/full/networking/cbus'
        }
    },
    {
        path: '/check/full/windows/bios',
        name: 'full-bios',
        component: TheWindows,
        meta: {
            userInput: true, //Requires user input to proceed to the next page
            canSkip: true,
            next: '/check/full/windows/settings',
            prev: '/check/full/windows'
        }
    },
    {
        path: '/check/full/windows/settings',
        name: 'full-windows-settings',
        component: TheWindows,
        meta: {
            userInput: true, //Requires user input to proceed to the next page
            canSkip: true,
            next: '/check/full/imvr',
            prev: '/check/full/windows/bios'
        }
    },

    //IMVR Station Routes
    {
        path: '/check/full/imvr',
        name: 'full-stations',
        component: TheIMVR,
        meta: {
            next: '/check/full/imvr/tcp',
            prev: '/check/full/windows/settings'
        }
    },
    {
        path: '/check/full/imvr/tcp',
        name: 'full-imvr-tcp',
        component: TheIMVR,
        meta: {
            userInput: true, //Requires user input to proceed to the next page
            next: '/check/full/imvr/stations',
            prev: '/check/full/imvr'
        }
    },
    {
        path: '/check/full/imvr/stations',
        name: 'full-station-comparison',
        component: TheIMVR,
        meta: {
            prev: '/check/full/imvr/tcp'
        }
    }
];

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'welcome',
            component: Welcome,
            meta: {
                userInput: true, //Requires user input to proceed to the next page
                noComment: true, //No comment is required to skip
                canSkip: true, //Can skip the current scene
                next: '/selection',
                nextText: 'Get Started'
            }
        },
        {
            path: '/selection',
            name: 'selection',
            component: Welcome,
            meta: {
                prev: '/'
            }
        },
        {
            path: '/check/selection',
            name: 'check-selection',
            component: Welcome,
            meta: {
                prev: '/selection'
            }
        },
        {
            path: '/report',
            name: 'report-handover',
            component: TheReport,
            meta: {
                prev: '/selection'
            }
        },
        {
            path: '/settings',
            name: 'settings',
            component: Settings,
        },
        ...quickRoutes, // Merge quickRoutes into the existing routes
        ...fullRoutes, // Merge fullRoutes into the existing routes
        ...configToolRoutes // Merge the config tool into the exiting routes
    ]
});

export default router
