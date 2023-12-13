import PasswordSkeleton from "../views/PasswordSkeleton.vue";

export const passwordRoutes = [
    {
        path: '/',
        name: 'password-login',
        component: PasswordSkeleton,
        meta: {
            next: '/password-generation'
        }
    },
    {
        path: '/password-generation',
        name: 'password-generation',
        component: PasswordSkeleton,
        meta: {
            prev: '/password-login'
        }
    }
]
