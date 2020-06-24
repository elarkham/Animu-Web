import { Model } from '@vuex-orm/core'
import {Season, SeasonAnime} from '@/models/season.js'
import {Genre, GenreAnime} from '@/models/genre.js'

export default class Anime extends Model {
  static entity = 'anime'

  static primaryKey = 'slug'

  static fields () {
    return {
      id: this.attr(null),

      name:     this.string(''),
      titles:   this.attr({}),
      synopsis: this.string(''),
      slug:     this.attr(null),

      directory: this.attr(null),

      cover_image:  this.attr({}),
      poster_image: this.attr({}),
      gallery:      this.attr({}),

      trailers: this.attr({}),
      tags:     this.attr({}),

      genres: this.belongsToMany(Genre, GenreAnime, 'anime_slug', 'genre_slug'),

      nsfw: this.attr(null),

      age_rating: this.attr(null),
      age_guide:  this.attr(null),

      // External Data

      kitsu_rating: this.attr(null),
      kitsu_id:     this.attr(null),

      mal_id:   this.attr(null),
      tvdb_id:  this.attr(null),
      anidb_id: this.attr(null),

      // Franchise Data

      franchise: this.attr(null),
      subtitle:  this.attr(null),
      subtype:   this.attr(null),
      number:    this.attr(null),

      // Episode Data

      episodes: this.attr([]),

      episode_count:  this.attr(null),
      episode_length: this.attr(null),

      // Augur Data

      augur:      this.attr(null),
      augured_at: this.attr(null),

      regex:     this.attr(null),
      rss_feed:  this.attr(null),
      subgroup:  this.attr(null),
      quality:   this.attr(null),

      // Time Data

      season: this.belongsToMany(Season, SeasonAnime, 'anime_slug', 'season_slug'),

      airing:     this.attr(null),
      airing_at:  this.attr(null),

      start_date: this.attr(null),
      end_date:   this.attr(null),

      updated_at:  this.attr(null),
      inserted_at: this.attr(null),
    }
  }
}
