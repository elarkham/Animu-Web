import Vue from 'vue'
import app from './app.vue'
import router from './router.js'
import store from './store.js'

import toggle_button from 'vue-js-toggle-button'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(app)
}).$mount('#app')

Vue.use(toggle_button)
