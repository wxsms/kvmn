<template>
  <section id="app">
    <page-wrapper></page-wrapper>
  </section>
</template>

<script>
  import PageWrapper from './components/architecture/PageWrapper.vue'
  export default {
    components: {PageWrapper}
  }
</script>

<style lang="less">
  @import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
  @import './assets/css/core';
</style>
