import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router';
import { configToolRoutes } from "../../src-setup/router/configRoutes";
import { diagnosticRoutes } from "../../src-network/router/diagnosticRoutes";
// import { quickCheckRoutes } from "../../src-quick/router/quickCheckRoutes";
import { passwordRoutes } from "../../src-password/router/passwordRoutes";
import { fullRoutes } from "../../src-qa/router/checkRoutes";

//Generic screens
import Welcome from '../views/Welcome.vue';
import Settings from '../views/Settings.vue';

const router = createRouter(<RouterOptions>{
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'welcome',
            component: Welcome
        },
        {
            path: '/check/selection',
            name: 'check-selection',
            component: Welcome,
            meta: {
                prev: '/welcome'
            }
        },
        {
            path: '/settings',
            name: 'settings',
            component: Settings,
        },
        ...fullRoutes, // Merge fullRoutes into the existing routes
        ...configToolRoutes, // Merge the config tool into the exiting routes
        ...diagnosticRoutes,
        ...passwordRoutes
    ]
});

export default router
