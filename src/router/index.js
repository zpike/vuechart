import Vue from 'vue'
import Router from 'vue-router'
const routerOptions = [
    { path: '/', component: 'LineChart' },
    { path: '/line', component: 'LineChart' },
    { path: '/dynamic', component: 'DynamicChart' },
    { path: '/guage', component: 'Guage' },
    { path: '*', component: 'NotFound' }
]
const routes = routerOptions.map(route => {
    return {
        ...route,
        component: () => import(`@/components/${route.component}.vue`)
    }
})
Vue.use(Router)
export default new Router({
    routes,
    mode: 'history'
})