import NetworkSkeleton from "../views/NetworkSkeleton.vue";

export const diagnosticRoutes = [
    {
        path: '/',
        name: 'network-diagnostic-main',
        component: NetworkSkeleton,
        meta: {
            prev: '/',
            progress: 0
        }
    },
    {
        path: '/network-diagnostic',
        name: 'network-diagnostic',
        component: NetworkSkeleton,
        meta: {
            prev: '/',
            progress: 0
        }
    }
]
