<template>
  <section class="container">
    <div class="row">
      <div class="col-xs-12">
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <label class="control-label" for="firstName">First Name</label>
            <input class="form-control" type="text" id="firstName" v-model="formData.firstName" required>
          </div>
          <div class="form-group">
            <label class="control-label" for="lastName">Last Name</label>
            <input class="form-control" type="text" id="lastName" v-model="formData.lastName" required>
          </div>
          <div class="form-group">
            <label class="control-label" for="email">Email</label>
            <input class="form-control" type="email" id="email" v-model="formData.email" required>
          </div>
          <div class="form-group">
            <label class="control-label" for="username">Username</label>
            <input class="form-control" type="text" id="username" v-model="formData.username" required>
          </div>
          <div class="form-group">
            <label class="control-label" for="password">Password</label>
            <input class="form-control" type="password" id="password" v-model="formData.password" required>
          </div>
          <div class="form-group text-center">
            <button type="submit" class="btn btn-primary">Register</button>
            <span>&nbsp;or&nbsp;</span>
            <router-link to="/auth/login">Login</router-link>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        formData: {
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          password: ''
        }
      }
    },
    methods: {
      onSubmit () {
        axios.post('/api/auth/register', this.formData)
          .then(response => {
            this.$router.push('/auth/login')
          })
          .catch(err => {
            if (err.response && err.response.data) {
              window.alert(`Error: ${err.response.data.msg}`)
            }
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
