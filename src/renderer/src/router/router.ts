import Welcome from '@renderer/views/_generic/Welcome.vue';
import ToolSelection from '@renderer/views/_generic/ToolSelection.vue';
import Settings from '@renderer/views/_generic/Settings.vue';
import QuickCheck from "@renderer/views/QuickCheck.vue";
import FullCheck from "@renderer/views/FullCheck.vue";

import Appliances from '@renderer/views/Appliances.vue';
import { createRouter, createWebHashHistory } from 'vue-router';

/**
 * Routes used for the Quick Lab Check
 */
const quickRoutes = [
    {
        path: '/check/quick',
        name: 'quick-setup',
        component: QuickCheck,
        meta: {
            userInput: true, //Requires user input to proceed to the next page
            next: '/check/quick/tcp',
            prev: '/selection'
        }
    },
    {
        path: '/check/quick/tcp',
        name: 'quick-tcp',
        component: QuickCheck,
        meta: {
            userInput: true, //Requires user input to proceed to the next page
            next: '/check/quick/request',
            prev: '/check/quick'
        }
    },
    {
        path: '/check/quick/request',
        name: 'quick-request',
        component: QuickCheck,
        meta: {
            prev: '/check/quick/tcp'
        }
    }
];

/**
 * Routes used for the Full Lab Check
 */
const fullRoutes = [
    {
        path: '/check/full',
        name: 'full-setup',
        component: FullCheck,
        meta: {
            userInput: true, //Requires user input to proceed to the next page
            next: '/check/full/tcp',
            prev: '/selection'
        }
    },
    {
        path: '/check/full/tcp',
        name: 'full-tcp',
        component: FullCheck,
        meta: {
            userInput: true, //Requires user input to proceed to the next page
            next: '/check/full/request',
            prev: '/check/full'
        }
    },
    {
        path: '/check/full/request',
        name: 'full-request',
        component: FullCheck,
        meta: {
            prev: '/check/full/tcp'
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
                next: '/selection'
            }
        },
        {
            path: '/selection',
            name: 'selection',
            component: ToolSelection,
            meta: {
                prev: '/'
            }
        },
        {
            path: '/appliances',
            name: 'appliances',
            component: Appliances
        },
        {
            path: '/settings',
            name: 'settings',
            component: Settings
        },
        ...quickRoutes, // Merge quickRoutes into the existing routes
        ...fullRoutes, // Merge fullRoutes into the existing routes
    ]
});

export default router
