<template>
  <section class="container">
    <div class="row">
      <div class="col-xs-12">
        <h2 class="page-header">{{article.title}}</h2>
        <p>{{article.body}}</p>
      </div>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'

  const fetchInitialData = (store) => {
    return store.dispatch(`getArticleById`, store.state.route.params.id)
  }

  export default {
    prefetch: fetchInitialData,
    computed: {
      ...mapGetters({
        article: 'getArticle'
      })
    },
    mounted () {
      if (!this.article) {
        fetchInitialData(this.$store)
      }
    },
    beforeDestroy () {
      this.$store.dispatch(`clearArticle`)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

</style>
