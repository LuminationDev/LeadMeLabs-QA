import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router';
import { diagnosticRoutes } from "./diagnosticRoutes";

//Generic screens
import Welcome from "../views/Welcome.vue";
import Settings from '../views/Settings.vue';

const router = createRouter(<RouterOptions>{
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'network',
            component: Welcome
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
