import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      component: process.BROWSER ? () => System.import('../components/pages/Home.vue') : require('../components/pages/Home.vue')
    },
    {
      path: '/topics',
      component: process.BROWSER ? () => System.import('../components/pages/Topics.vue') : require('../components/pages/Topics.vue')
    },
    {
      path: '/counter',
      component: process.BROWSER ? () => System.import('../components/pages/Counter.vue') : require('../components/pages/Counter.vue')
    },
    {
      path: '/about',
      component: process.BROWSER ? () => System.import('../components/pages/About.vue') : require('../components/pages/About.vue')
    },
    {
      path: '/user/register',
      component: process.BROWSER ? () => System.import('../components/pages/user/Register.vue') : require('../components/pages/user/Register.vue')
    }
  ]
})

export default router
