import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router';
import { diagnosticRoutes } from "./diagnosticRoutes";

//Generic screens
import Settings from '../views/Settings.vue';
import NetworkSkeleton from "../views/NetworkSkeleton.vue";

const router = createRouter(<RouterOptions>{
    history: createWebHashHistory(),
    routes: [
        {
            path: '/network-diagnostic/device-selection',
            name: 'device-selection',
            component: NetworkSkeleton,
            meta: {
                prev: '/',
                progress: 0
            }
        },
        {
            path: '/settings',
            name: 'settings',
            component: Settings,
        },
        ...diagnosticRoutes
    ]
});

export default router
