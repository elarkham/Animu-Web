<template>
  <div id="app">
    <navbar v-show="$route.name != 'login'"/>
    <router-view/>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
export default {
  name: 'app',
  components: {
    navbar
  }
}
</script>

<style lang="scss">
@import "src/assets/css/main.scss";
#app {
  display: grid;
  grid-template-rows: 75px auto;
  padding-bottom: 40px;
  min-height: 100%;
}
</style>
