import Vue from 'vue'
import app from './app'
import router from './router'
import store from './store'

// Network
import animu from '@/api/animu'
window.router = router
window.animu = animu

if (!animu.token_invalid()) {
  //animu.socket.connect();
}

// Storage
import Anime  from '@/models/anime'
import {Season} from '@/models/season'
import {Genre} from '@/models/genre'

// Plugins
import '@/vendor/plugins'

// Style
import './style/_main.scss'

Vue.config.productionTip = false
new Vue({
  router,
  store,
  async beforeCreate() {
    const anime_success = (resp) => {
      console.log(resp.data.anime)
      Anime.insert({data: resp.data.anime})
      console.log("Loaded Anime!")
    }

    const season_success = (resp) => {
      console.log(resp.data.seasons)
      Season.insert({data: resp.data.seasons})
      console.log("Loaded Seasons!")
    }

    const genre_success = (resp) => {
      console.log(resp.data.genres)
      Genre.insert({data: resp.data.genres})
      console.log("Loaded Genres!")
    }

    const failure = (error) => {
      console.log(error)
    }

    const season_p =
      animu
      .all_seasons()
      .then(season_success)
      .catch(failure)

    const genre_p =
      animu
      .all_genres()
      .then(genre_success)
      .catch(failure)

    const anime_p =
      animu
      .all_anime()
      .then(anime_success)
      .catch(failure)

    await Promise.all([
      season_p,
      genre_p,
      anime_p,
    ])

    this.$mount('#app')
  },
  render: h => h(app)
})


