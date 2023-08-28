import Home from '@renderer/views/Home.vue'
import TcpTest from '@renderer/views/TcpTest.vue'
import Settings from '@renderer/views/Settings.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/settings',
            name: 'settings',
            component: Settings
        },
        {
            path: '/tcp',
            name: 'tcp',
            component: TcpTest
        }
    ]
})

export default router
