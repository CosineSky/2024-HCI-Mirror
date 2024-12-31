// @ts-ignore
import {createRouter, createWebHashHistory} from "vue-router"

// @ts-ignore
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/home',
            // @ts-ignore
            component: () => import('../views/HomePage.vue'),
            meta: {title: 'Home'}
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
        {
            path: '/manage',
            // @ts-ignore
            component: () => import('../views/ManagePage.vue'),
            meta: {title: 'Manage'}
        },
        // {
        //     path: '/test',
        //     // @ts-ignore
        //     component: () => import('../views/a.vue'),
        //     meta: {title: 'test'}
        //
        // }
    ]
})

router.beforeEach((to, _, next) => {
    const token = sessionStorage.getItem('token');
    console.log(token)

    if (to.meta.title) {
        document.title = to.meta.title
    }

    if ( token == null) {
        if(to.path !== '/login'){
            next('/login')
        }else {
            next()
        }
    }else {
        next()
    }
})

export {router}
