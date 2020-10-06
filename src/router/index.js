import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push

VueRouter.prototype.push = function push (location) {

    return originalPush.call(this, location).catch(err => err)

}
const routes = [
    {
        path: '/',

        redirect:'/login'
    },

    {
        path:'/login',
        name:'login',
        component:()=>import(/* webpackChunkName: "about" */ '@/components/Login.vue')
    },
    // {path:'/tt',name:'tt',component:()=>import('@/components/report/tt.vue')},
    {
        path:'/home',

        component:()=>import(/* webpackChunkName: "about" */ '@/components/Home.vue'),
        redirect:'/welcome',
        children:[
            {path:'/welcome',component:()=>import('@/components/Welcome.vue') ,name:'welcome',  meta: {title: '首页', icon: 'product'}, },
            {path:'/users',component:()=>import('@/components/User.vue'),name:'users',  meta: {title: '首页1', icon: 'product'}  },
            {path:'/rights',component:()=>import('@/components/power/Rights.vue'),name:'rights',  meta: {title: '首页2', icon: 'product'}  },
            {path:'/roles',component:()=>import('@/components/power/Roles.vue') ,name:'roles',  meta: {title: '首页3', icon: 'product'} },
            {path:'/categories',component:()=>import('@/components/goods/Cate.vue'),name:'categories',  meta: {title: '首页4', icon: 'product'}},
            {path:'/params',component:()=>import('@/components/goods/Parmas.vue'), name:'params', meta: {title: '首页5', icon: 'product'}},
            {path:'/goods',component:()=>import('@/components/goods/List.vue'), name:'goods', meta: {title: '首页6', icon: 'product'}},
            {path:'/goods/add',component:()=>import('@/components/goods/Add.vue'),name:'add',  meta: {title: '增加', icon: 'product'}},
            {path:'/orders',component:()=>import('@/components/order/Order.vue'), name:'orders', meta: {title: '订单', icon: 'product'}},

        ]
    }

]

const router = new VueRouter({
    mode:'history',
    routes
})
let hasMenus = false
router.beforeEach((to,from,next)=>{
    if(to.path==='/login') return next();

    const tokenStr=window.sessionStorage.getItem('token');
    if(!tokenStr) return next('/login');
    if(hasMenus){
        next()
    }else{
        incer()
        hasMenus =true
        next({path:to.path})
    }

    next()


})

export function incer() {
    let rr=router.options.routes
    rr[2].children.push( {path:'/reports',component:()=>import('@/components/report/Report.vue')})
    rr.push({path:'/ttt',component:()=>import('@/components/report/tt.vue')})
    router.addRoutes(rr)
    console.log(router)
}

export default router
