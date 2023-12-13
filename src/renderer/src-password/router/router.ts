import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router';
import { passwordRoutes } from "./passwordRoutes";

//Generic screens
import Settings from '../views/Settings.vue';
import PasswordSkeleton from "../views/PasswordSkeleton.vue";

const router = createRouter(<RouterOptions>{
    history: createWebHashHistory(),
    routes: [
        {
            path: '/password-login',
            name: 'password-login-main',
            component: PasswordSkeleton,
            meta: {
                next: '/password-generation'
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
