import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router';
import { quickCheckRoutes } from "./quickCheckRoutes";

//Generic screens
import Welcome from "../views/Welcome.vue";
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
            path: '/settings',
            name: 'settings',
            component: Settings,
        },
        ...quickCheckRoutes
    ]
});

export default router
