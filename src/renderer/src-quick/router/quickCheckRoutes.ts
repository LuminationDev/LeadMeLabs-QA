import Test from "../views/Test.vue";

export const quickCheckRoutes = [
    {
        path: '/quick-check/test',
        name: 'quick-check-test',
        component: Test,
        meta: {
            prev: '/',
            progress: 0
        }
    }
]
