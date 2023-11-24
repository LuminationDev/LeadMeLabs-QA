import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router';
import { fullRoutes } from "./checkRoutes";

//Generic screens
import Welcome from '@renderer/src-qa/views/Welcome.vue';
import Settings from '@renderer/src-qa/views/Settings.vue';

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
            path: '/settings',
            name: 'settings',
            component: Settings,
        },
        ...fullRoutes, // Merge fullRoutes into the existing routes
    ]
});

export default router
