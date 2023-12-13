import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router';
import { passwordRoutes } from "./passwordRoutes";

//Generic screens
import Settings from '../views/Settings.vue';
import NetworkSkeleton from "../views/PasswordSkeleton.vue";
import PasswordSkeleton from "../views/PasswordSkeleton.vue";

const router = createRouter(<RouterOptions>{
    history: createWebHashHistory(),
    routes: [
        {
            path: '/password',
            name: 'password',
            component: PasswordSkeleton,
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
        ...passwordRoutes
    ]
});

export default router
