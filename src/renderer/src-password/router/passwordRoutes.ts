import PasswordSkeleton from "../views/PasswordSkeleton.vue";

export const passwordRoutes = [
    {
        path: '/',
        name: 'password-main',
        component: PasswordSkeleton,
        meta: {
            prev: '/',
            progress: 0
        }
    },
    {
        path: '/password',
        name: 'password',
        component: PasswordSkeleton,
        meta: {
            prev: '/',
            progress: 0
        }
    }
]
