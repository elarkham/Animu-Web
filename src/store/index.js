import Vue from 'vue'
import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'

import Anime from '@/models/anime'
import {Season, SeasonAnime} from '@/models/season'
import {Genre, GenreAnime} from '@/models/genre.js'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

// VuexORM
const database = new VuexORM.Database()

console.log("Registering")
database.register(SeasonAnime)
database.register(Season)

database.register(GenreAnime)
database.register(Genre)

database.register(Anime)
console.log("Done!")

window.Season = Season;
window.Genre  = Genre;
window.Anime  = Anime;

export default new Vuex.Store({
  plugins: [VuexORM.install(database)],
  strict: debug
})
