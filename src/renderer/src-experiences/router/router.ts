import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router';
import { experienceRoutes } from "./experienceRoutes";

//Generic screens
import TheSettings from '../../screens/settings/TheSettings.vue';
import Welcome from "../views/Welcome.vue";

const router = createRouter(<RouterOptions>{
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'welcome',
            component: Welcome
        },
        {
            path: '/settings',
            name: 'settings',
            component: TheSettings,
        },
        ...experienceRoutes, // Merge fullRoutes into the existing routes
    ]
});

export default router
