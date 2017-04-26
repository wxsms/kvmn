<template>
  <section>
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" @click="showNavbar=!showNavbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link class="navbar-brand" role="button" to="/" exact>Home</router-link>
        </div>
        <div class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <router-link to="/articles" tag="li">
              <a role="button">Articles</a>
            </router-link>
          </ul>

          <ul class="nav navbar-nav navbar-right" v-if="user">
            <li><a role="button" @click="logout">
              <i class="glyphicon glyphicon-log-out"></i>
              Logout
            </a></li>
          </ul>
          <p class="navbar-text navbar-right" v-if="user">Signed in as {{user.displayName}}</p>
          <ul class="nav navbar-nav navbar-right" v-if="!user">
            <router-link to="/auth/login" tag="li">
              <a role="button">Login</a>
            </router-link>
            <router-link to="/auth/register" tag="li">
              <a role="button">Register</a>
            </router-link>
          </ul>
        </div>
      </div>
    </nav>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    components: {},
    data () {
      return {
        showNavbar: false
      }
    },
    computed: {
      ...mapGetters({
        user: 'getUser'
      })
    },
    methods: {
      logout () {
        this.$store.dispatch(`logout`)
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>

</style>
