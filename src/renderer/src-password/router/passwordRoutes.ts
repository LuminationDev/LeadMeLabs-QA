import PasswordSkeleton from "../views/PasswordSkeleton.vue";

export const passwordRoutes = [
    {
        path: '/password-login',
        name: 'password-login',
        component: PasswordSkeleton,
        meta: {
            prev: '/',
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
