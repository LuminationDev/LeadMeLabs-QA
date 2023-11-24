import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router';
import { configToolRoutes } from "./configRoutes";
import { fullRoutes } from "./checkRoutes";
import { diagnosticRoutes } from "../../src-network/router/diagnosticRoutes";

//Generic screens
import Welcome from '@renderer/views/Welcome.vue';
import Settings from '@renderer/views/Settings.vue';
import TheReport from "@renderer/tool-qa/components/handover/TheReport.vue";

const router = createRouter(<RouterOptions>{
    history: createWebHashHistory(import.meta.env.BASE_URL),
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
        ...fullRoutes, // Merge fullRoutes into the existing routes
        ...configToolRoutes, // Merge the config tool into the exiting routes
        ...diagnosticRoutes
    ]
});

export default router
