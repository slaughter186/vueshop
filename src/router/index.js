import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

const Login = () => import('../components/login')
const Home = () => import('../components/home')
const Users = () => import('../components/user/Users')
const aaa = () => import('../components/user/aaa')

const routes = [{
    path: '/',
    redirect: '/login'
},
    {
        path: '/login',
        component: Login
    },
    {
        path: '/aaa',
        component: aaa
    },
    {
        path: '/home',
        component: Home,
        children: [
            {
                path: '/users',
                component: Users
            }
        ]
    },

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

//设置路由导航守卫，原理到login页的都放行
//除了login页面的，必须要有token才方向
router.beforeEach((to, from, next) => {
    if (to.path === '/login') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    //如果没有token，就说明没有登陆，直接跳转到login页面，如果有token就放行
    if (!tokenStr) return next('/login')
    next()
})
export default router
