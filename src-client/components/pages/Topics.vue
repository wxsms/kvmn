<template>
  <div>
    <div v-for="topic in topics">
      <p>{{topic.title}}</p>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  const fetchInitialData = store => {
    return store.dispatch(`getTopics`)
  }

  export default {
    prefetch: fetchInitialData,
    computed: {
      ...mapGetters({
        topics: 'getTopics'
      })
    },
    mounted () {
      if (this.topics.length === 0) {
        fetchInitialData(this.$store)
      }
    },
    beforeDestroy () {
      this.$store.dispatch(`clearTopics`)
    }
  }
</script>
