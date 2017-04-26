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
      component: process.BROWSER ? () => System.import('../components/pages/Articles.vue') : require('../components/pages/Articles.vue'),
      meta: {roles: ['user']}
    },
    {
      path: '/articles/:id',
      component: process.BROWSER ? () => System.import('../components/pages/Single.vue') : require('../components/pages/Single.vue'),
      meta: {roles: ['user']}
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

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.roles) {
    let loginPath = {path: '/auth/login'}
    let user = router.app.$store.state.user
    if (!user) {
      next(loginPath)
    } else {
      let roles = to.meta.roles
      let match = false
      for (let i = 0, l = user.roles.length; i < l; i++) {
        let role = user.roles[i]
        if (roles.indexOf(role) >= 0) {
          match = true
          break
        }
      }
      if (match) {
        next()
      } else {
        next(loginPath)
      }
    }
  } else {
    next()
  }
})

export default router
