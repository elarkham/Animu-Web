import { Model } from '@vuex-orm/core'
import Anime from '@/models/anime.js'

class GenreAnime extends Model {
  static entity = 'genre_anime'

  static primaryKey =  ['genre_slug', 'anime_slug']

  static fields () {
    return {
      genre_slug: this.attr(null),
      anime_slug: this.attr(null),
    }
  }
}

class Genre extends Model {
  static entity = 'genre'

  static primaryKey = 'slug'

  static fields () {
    return {
      id: this.attr(null),

      name: this.attr(null),
      slug: this.attr(null),
      nsfw: this.attr(null),

      description: this.attr(null),
      poster: this.attr(null),

      kitsu_id: this.attr(null),

      anime: this.belongsToMany(Anime, GenreAnime, 'genre_slug', 'anime_slug'),
    }
  }
}


export {Genre, GenreAnime}
