import Test from "../views/Test.vue";

export const diagnosticRoutes = [
    {
        path: '/network-diagnostic/test',
        name: 'diagnostic-test',
        component: Test,
        meta: {
            prev: '/',
            progress: 0
        }
    }
]
