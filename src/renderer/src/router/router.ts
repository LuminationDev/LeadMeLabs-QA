import { createRouter, createWebHashHistory } from 'vue-router';
import { configToolRoutes } from "./configRoutes";
import { fullRoutes, quickRoutes } from "./checkRoutes";

//Generic screens
import Welcome from '@renderer/views/Welcome.vue';
import Settings from '@renderer/views/Settings.vue';
import TheReport from "@renderer/tool-qa/components/reports/TheReport.vue";

const router = createRouter({
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
        ...quickRoutes, // Merge quickRoutes into the existing routes
        ...fullRoutes, // Merge fullRoutes into the existing routes
        ...configToolRoutes // Merge the config tool into the exiting routes
    ]
});

export default router
