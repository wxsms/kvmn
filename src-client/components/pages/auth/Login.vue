<template>
  <section class="container">
    <div class="row">
      <div class="col-xs-12">
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <label class="control-label" for="username">Username</label>
            <input class="form-control" type="text" id="username" v-model="formData.username" required>
          </div>
          <div class="form-group">
            <label class="control-label" for="password">Password</label>
            <input class="form-control" type="password" id="password" v-model="formData.password" required>
          </div>
          <div class="form-group text-center">
            <button type="submit" class="btn btn-primary">Login</button>
            <span>&nbsp;or&nbsp;</span>
            <router-link to="/auth/register">Register</router-link>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    data () {
      return {
        formData: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      onSubmit () {
        this.$store.dispatch('login', this.formData)
          .then(() => {
            this.$router.push('/')
          })
          .catch(err => {
            console.log(err)
            window.alert('Error: Incorrect user name or password.')
          })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  form {
    max-width: 400px;
    margin: 0 auto;
  }
</style>
