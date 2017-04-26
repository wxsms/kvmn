<template>
  <section class="page">
    <router-view :key="$route.path"></router-view>
  </section>
</template>

<script>
  export default {}
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .page {
    margin-bottom: 50px; /* Height of footer*/
  }
</style>
