import { Model } from '@vuex-orm/core'
import Anime from '@/models/anime.js'

class SeasonAnime extends Model {
  static entity = 'season_anime'

  static primaryKey =  ['season_slug', 'anime_slug']

  static fields () {
    return {
      season_slug: this.attr(null),
      anime_slug: this.attr(null),
    }
  }
}

class Season extends Model {
  static entity = 'season'

  static primaryKey = 'slug'

  static fields () {
    return {
      id: this.attr(null),

      year: this.attr(null),
      cour: this.attr(null),

      name: this.attr(null),
      slug: this.attr(null),
      sort: this.attr(null),

      anime: this.belongsToMany(Anime, SeasonAnime, 'season_slug', 'anime_slug'),
    }
  }
}


export {Season, SeasonAnime}
