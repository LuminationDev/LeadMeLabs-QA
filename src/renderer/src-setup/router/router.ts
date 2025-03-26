import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router';
import { configToolRoutes } from "./configRoutes";
import WelcomeView from "../views/WelcomeView.vue";
import Settings from "../views/Settings.vue";

const router = createRouter(<RouterOptions>{
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'welcome',
            component: WelcomeView,
            meta: {
                next: '/config/checklist',
                progress: 0
            }
        },
        {
            path: '/settings',
            name: 'settings',
            component: Settings,
        },
        ...configToolRoutes
    ]
});

export default router
