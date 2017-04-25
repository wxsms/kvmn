<template>
  <div id="app">
    <img src="./assets/logo.png">
    <ul>
      <li>
        <router-link to="/" exact>Home</router-link>
      </li>
      <li>
        <router-link to="/topics">Topics</router-link>
      </li>
      <li>
        <router-link to="/counter">Counter</router-link>
      </li>
      <li>
        <router-link to="/about">About</router-link>
      </li>
    </ul>
    <router-view class="view"></router-view>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="less">
  body {
    font-family: Helvetica, sans-serif;
  }

  .router-link-active {
    color: red;
  }
</style>
