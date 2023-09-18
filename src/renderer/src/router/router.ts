import Welcome from '@renderer/views/_generic/Welcome.vue';
import Settings from '@renderer/views/_generic/Settings.vue';
import QuickCheck from "@renderer/views/QuickCheck.vue";
import FullCheck from "@renderer/views/FullCheck.vue";

import { createRouter, createWebHashHistory } from 'vue-router';
import TheNetwork from "../components/fullCheck/Network/TheNetwork.vue";
import TheWindows from "../components/fullCheck/Windows/TheWindows.vue";
import TheIMVR from "../components/fullCheck/IMVR/TheIMVR.vue";
import TheAppliances from "../components/fullCheck/Appliances/TheAppliances.vue";
import TheReport from "../components/reports/TheReport.vue";

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
            next: '/check/full/networking',
            prev: '/check/selection'
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
            next: '/check/full/appliances',
            prev: '/check/full/windows/bios'
        }
    },

    //Appliance Routes
    {
        path: '/check/full/appliances',
        name: 'full-appliances',
        component: TheAppliances,
        meta: {
            next: '/check/full/appliances/tcp',
            prev: '/check/full/windows/settings'
        }
    },
    {
        path: '/check/full/appliances/tcp',
        name: 'full-appliance-tcp',
        component: TheAppliances,
        meta: {
            next: '/check/full/appliances/list',
            prev: '/check/full/appliances'
        }
    },
    {
        path: '/check/full/appliances/list',
        name: 'full-appliance-list',
        component: TheAppliances,
        meta: {
            userInput: true, //Requires user input to proceed to the next page
            canSkip: true,
            next: '/check/full/imvr',
            prev: '/check/full/appliances/tcp'
        }
    },

    //IMVR Station Routes
    {
        path: '/check/full/imvr',
        name: 'full-stations',
        component: TheIMVR,
        meta: {
            next: '/check/full/imvr/tcp',
            prev: '/check/full/appliances/list'
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
                next: '/selection'
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
    ]
});

export default router
