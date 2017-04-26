<template>
  <section>
    <nav class="navbar navbar-default">
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
            <router-link to="/topics" tag="li">
              <a role="button">Topics</a>
            </router-link>
            <router-link to="/counter" tag="li">
              <a role="button">Counter</a>
            </router-link>
            <router-link to="/about" tag="li">
              <a role="button">About</a>
            </router-link>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <router-link to="/login" tag="li">
              <a role="button">Login</a>
            </router-link>
            <router-link to="/user/register" tag="li">
              <a role="button">Register</a>
            </router-link>
          </ul>
        </div>
      </div>
    </nav>
  </section>
</template>

<script>
  export default {
    components: {},
    data () {
      return {
        showNavbar: false
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>

</style>
