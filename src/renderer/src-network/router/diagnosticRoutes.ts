import NetworkSkeleton from "../views/NetworkSkeleton.vue";

export const diagnosticRoutes = [
    {
        path: '/network-diagnostic/device-selection',
        name: 'device-selection',
        component: NetworkSkeleton,
        meta: {
            prev: '/',
            progress: 0
        }
    }
]
