<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <table class="table">
          <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Created User</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="article in articles">
            <td>{{article.id}}</td>
            <td>{{article.title}}</td>
            <td>{{article.userId}}</td>
            <td>
              <router-link :to="'/articles/'+article.id">View</router-link>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  const fetchInitialData = store => {
    return store.dispatch(`getArticles`)
  }

  export default {
    prefetch: fetchInitialData,
    computed: {
      ...mapGetters({
        articles: 'getArticles'
      })
    },
    mounted () {
      if (this.articles.length === 0) {
        fetchInitialData(this.$store)
      }
    },
    beforeDestroy () {
      this.$store.dispatch(`clearArticles`)
    }
  }
</script>
