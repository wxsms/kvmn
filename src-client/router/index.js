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
      path: '/articles',
      component: process.BROWSER ? () => System.import('../components/pages/Articles.vue') : require('../components/pages/Articles.vue')
    },
    {
      path: '/articles/:id',
      component: process.BROWSER ? () => System.import('../components/pages/Single.vue') : require('../components/pages/Single.vue')
    },
    {
      path: '/auth/register',
      component: process.BROWSER ? () => System.import('../components/pages/auth/Register.vue') : require('../components/pages/auth/Register.vue')
    },
    {
      path: '/auth/login',
      component: process.BROWSER ? () => System.import('../components/pages/auth/Login.vue') : require('../components/pages/auth/Login.vue')
    }
  ]
})

export default router
