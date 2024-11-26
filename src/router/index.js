// @ts-ignore
import {createRouter, createWebHashHistory} from "vue-router"

// @ts-ignore
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/home',
        },
        {
            path: '/home',
            // @ts-ignore
            component: () => import('../views/HomePage.vue'),
            meta: {title: 'Home'}
        },
        {
            path: '/play',
            // @ts-ignore
            component: () => import('../views/PlayingPage.vue'),
            meta: {title: 'Playing'}
        },
        {
            path: '/login',
            // @ts-ignore
            component: () => import('../views/LoginPage.vue'),
            meta: {title: 'Login'}
        },
        {
            path: '/settings',
            // @ts-ignore
            component: () => import('../views/SettingsPage.vue'),
            meta: {title: 'Settings'}
        },
        {
            path: '/profile',
            // @ts-ignore
            component: () => import('../views/ProfilePage.vue'),
            meta: {title: 'Profile'}
        },
    ]
})

export {router}
