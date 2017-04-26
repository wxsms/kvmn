<template>
  <section>
    <page-header></page-header>
    <page></page>
    <page-footer></page-footer>
  </section>
</template>

<script>
  import Page from './Page.vue'
  import PageFooter from './PageFooter.vue'
  import PageHeader from './PageHeader.vue'

  export default {
    components: {Page, PageHeader, PageFooter}
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>

</style>
