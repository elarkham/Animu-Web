<template>
  <div id="app">
    <navbar ref="navbar" v-show="$route.name != 'login'"/>
    <router-view class="viewport"/>
  </div>
</template>

<script>
import navbar from '@/components/navbar.vue'
import _ from 'lodash'

export default {
  name: 'app',
  components: {
    navbar
  },
}
</script>

<style lang="scss">
//@import "src/assets/css/main.scss";
#app {
  display: grid;
  grid-template-rows: 65px auto;
  padding-bottom: 40px;
  min-height: 100%;

  color: inherit;
  background: inherit;
  font-family: inherit;
  line-height: inherit;
}
</style>
