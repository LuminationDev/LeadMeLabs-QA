import NetworkSkeleton from "../views/NetworkSkeleton.vue";

export const diagnosticRoutes = [
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
