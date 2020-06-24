<template>
<div id="manage_anime_profile">
  <article id="profile_meta">
    <h1> {{anime.canon_title}} </h1>
    <section id="anime_form">
     <!-- Info -->
      <section id="meta" class="form-group">
        <div class="title">
          <h2>Metadata</h2>
          <hr>
        </div>
        <img id="anime_image" :src="img_src" alt="orig">
        <div class="form-content">
          <v-input label="Canon Title" v-model="anime.canon_title"></v-input>
          <v-input label="Slug" v-model="anime.slug"></v-input>
          <v-input label="Age Rating" v-model="anime.age_rating"></v-input>

          <div class="switch-wrapper">
            <label>NSFW</label>
            <toggle-button class="toggle" :cssColors="true" :sync="true" v-model="anime.nsfw"/>
          </div>

          <v-input type="number" label="Season Number" v-model="anime.season_number"></v-input>

          <div>
            <label>Poster Image</label>
            <input id="poster-input"
                   accept="image/*"
                   type="file"
                   @change="filesChange($event.target.files)"
                   >
            </input>
          </div>
        </div>

        <div id="synopsis">
          <label for="synopsis">Synopsis</label>
          <br>
          <textarea v-model="anime.synopsis"></textarea>
        </div>
      </section>

      <!-- Kitsu -->
      <section id="kitsu" class="form-group">
        <div class="title">
          <h2>Kitsu</h2>
          <hr>
        </div>
        <div class="form-content">
          <v-input label="Kitsu Rating" v-model="anime.kitsu_rating"></v-input>
          <v-input label="Kitsu ID" v-model="anime.kitsu_id"></v-input>
        </div>
      </section>

      <!-- Augur -->
      <section id="augur" class="form-group">
        <div class="title">
          <h2>Augur</h2>
          <hr>
        </div>
        <div class="form-content">
          <v-input label="Regex" v-model="anime.regex"></v-input>
          <v-input label="RSS Feed" v-model="anime.rss_feed"></v-input>
          <v-input label="Subgroup" v-model="anime.subgroup"></v-input>
          <v-input label="Quality" v-model="anime.quality"></v-input>
          <div class="switch-wrapper">
            <label>Watch</label>
            <toggle-button class="toggle" :cssColors="true" :sync="true" v-model="anime.watch"/>
          </div>
        </div>
      </section>


      <!-- Filesystem -->
      <section id="filesystem" class="form-group">
        <div class="title">
          <h2>Filesystem</h2>
          <hr>
        </div>
        <div class="form-content">
          <v-input label="Directory" v-model="anime.directory"></v-input>
        </div>
      </section>

      <!-- Dates -->
      <section id="dates" class="form-group">
        <div class="title">
          <h2>Dates</h2>
          <hr>
        </div>
        <div class="form-content">
         <v-input :float="true" type="date" label="Start Date" v-model="anime.started_airing_date"></v-input>
         <v-input :float="true" type="date" label="End Date" v-model="anime.finished_airing_date"></v-input>
        </div>
      </section>

      <!-- Episode Meta -->
      <section id="episode-meta" class="form-group">
        <div class="title">
          <h2>Episode Meta</h2>
          <hr>
        </div>
        <div class="form-content">
          <v-input type="number" label="Episode Count" v-model="anime.episode_count"></v-input>
          <v-input type="number" label="Episode Length" v-model="anime.episode_length"></v-input>
        </div>
      </section>

      <!-- Submission -->
      <section id="submission">
        <div>
          <button class="mu-button" @click="submit('audit')">Audit</button>
          <button class="mu-button" @click="submit('spawn_episodes')">Spawn</button>
          <button class="mu-button" @click="submit('populate')">Populate</button>
          <button class="mu-button" @click="scan">Scan</button>
        </div>
        <button class="mu-button" id="submit" @click="submit(null)">Submit</button>
      </section>
      <section class="message" id="success" v-if="success">
        <h2 v-text="msg"></h2>
      </section>
      <section class="message" id="failure" v-else-if="success != null">
        <h2 v-text="msg"></h2>
      </section>

    </section>
  </article>
  <!-- Episodes -->
  <aside id="episodes">
    <h1>Episodes</h1>
    <table class="table">
      <thead>
        <th>#</th>
        <th>ID</th>
        <th>Title</th>
        <th></th>
      </thead>
      <tr v-for="(ep, index) in episodes">
        <td><div>{{pad_zero(ep.number)}}</div></td>
        <td><div>{{ep.id}}</div></td>
        <td><div>{{ep.title}}</div></td>
        <td class="table-buttons">
          <router-link :to="{name: 'episode-id', params: {id: ep.id}}">
            <button :disabled="!ep.video" class="mu-button watch">Watch</button>
          </router-link>
          <router-link :to="{name: 'manage-episode-id', params: {id: ep.id}}">
            <button class="mu-button edit">Edit</button>
          </router-link>
          <button class="mu-button delete" @click="delete_ep(ep, index)">Delete</button>
        </td>
      </tr>
    </table>
  </aside>
</div>
</template>

<script>
import input from '@/components/input'
import _ from 'lodash'

export default {
  name: 'manage-anime-id',
  components: {
    'v-input': input,
  },
  data: ()=> ({
    anime: {},
    poster: null,
    episodes: [],
    loading: true,
    msg: null,
    success: null,
  }),
  computed: {
    img_src: function()  {
      if (!this.anime.poster_image) {
        return "";
      }

      const img =
        "/assets/"
        + this.anime.directory + "/"
        + this.anime.poster_image.original
        +"?" + new Date().valueOf(); // forces image reload on re-compute

      return img;
    }
  },
  methods: {
    pad_zero: function(num) {
      return "00".substring(0, 2 - num.toString().length) + num;
    },
    getDataURL: function(file, callback) {
      const form = this;
      const reader  = new FileReader();
      reader.onload = function() {
        callback(reader.result);
      }
      reader.readAsDataURL(file);
    },
    filesChange: function(files) {
      if (!files.length) return;
      const file = files[0]
      this.poster = file;
    },
    get_form: function() {
      const anime = this.anime;

      // Gather Form Data
      var form_data = {
        //-- Meta
        /* TODO
        "titles": {
          "en":    "Gabriel DropOut"
          "en_jp": "Gabriel DropOut"
          "ja_jp": "ガヴリールドロップアウト"
        }, */
        "name": anime.name,     // string
        "season_number": anime.season_number, // string
        "slug": anime.slug,                   // string
        "synopsis": anime.synopsis,           // string
        "season_number": anime.season_number, // integer

        "age_rating": anime.age_rating, // string
        "nsfw": anime.nsfw,             // bolean

        //"tags": anime.tags,         // {:array, :string}, TODO
        //"genres": anime.genres,     // {:array, :string}, TODO
        //"trailers": anime.trailers, // {:array, :string}, TODO

        "poster_image": this.poster,
        //"poster_image": "https://media.kitsu.io/anime/poster_images/41459/original.jpg",
        /* TODO
        "poster_image": {
          "tiny":"images/poster/tiny.jpg",
          "small":"images/poster/small.jpg",
          "original":"images/poster/original.jpg",
          "medium":"images/poster/medium.jpg",
          "large":"images/poster/large.jpg"
        }, */
        //"cover_image": anime.cover_image, // {:array, :string}, TODO
        //"gallery": anime.gallery,         // {:map, :string},   TODO

        //-- Kitsu
        "kitsu_id": anime.kitsu_id,         // string
        "kitsu_rating": anime.kitsu_rating, // float

        //-- Augur
        "regex": anime.regex,       // string
        "rss_feed": anime.rss_feed,    // string
        "subgroup": anime.subgroup, // string
        "quality": anime.quality,   // string
        "watch": anime.watch,       // boolean, default: false

        //-- Filesystem
        "directory": anime.directory, // string

        //-- Dates
        "start_date": anime.start_date,  // date/string
        "end_date": anime.end_date,      // date/string

        //-- Episodes
        "episode_count": anime.episode_count,   // integer
        "episode_length": anime.episode_length, // integer
        //"episodes": [],

        //-- Options
        "audit": false,          // boolean
        "populate": false,       // boolean
        "spawn_episodes": false, // boolean
      };

      return form_data;
    },
    scan: function() {
      animu.scan();
    },
    submit: function (option){
      const form = this;

      // Hide Old Msg
      this.success = null;
      this.msg = null;

      // Get Form Data
      let data = {
        "anime": this.get_form(),
      };
      if(option) {
        data.anime[option] = true;
      }
      console.log(data.anime[option])
      console.log(data.anime)
      console.log(option + ": " + data.anime[option])

      // Submit Data
      const url = "http://sal:4005/api/media/anime/" + this.anime.id;
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      }
      const success = function(resp) {
        form.anime = resp.data.anime;
        form.episodes = resp.data.anime.episodes
        form.episodes.sort(function(ep1, ep2) {
          return ep1.number - ep2.number;
        });

        form.msg  = "Success"
        form.success = true;
      }
      const failure = function(resp) {
        console.log(resp)
        form.msg = resp.message;
        form.success = false;
      };

      // Patch
      animu.client
        .patch(url, data, config)
        .then(success)
        .catch(failure)
    },
    delete_ep: function(ep, index) {
      const form = this;
      const success = function(resp) {
        form.episodes = _.filter(form.episodes, (e) => {
          return e.id != ep.id
        });
      }
      animu.delete("/api/media/episodes/" + ep.id, {}, success)
    }
  },

  beforeCreate: function() {
    const id = this.$route.params.id;
    const profile = this;
    animu
      .get_anime(id)
      .then(function(resp) {
        profile.anime = resp.data.anime;
        profile.episodes = resp.data.anime.episodes;
        profile.episodes.sort(function(ep1, ep2) {
          return ep1.number - ep2.number;
        });
        profile.loading = false;
      })
      .catch((error) => {
        animu.login_check(error, profile.$router);
        console.log(error)
      })
  }
}
</script>


<style lang="scss">
#manage_anime_profile {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;

  justify-self: center;

  height: auto;
  max-width: 100%;
  padding-right: 30px;
  padding-left: 10px;
  margin-top: 20px;

  @media (max-width: 1300px), (orientation: portrait) {
    grid-template-columns: 1fr;
  }

  #profile_meta {
    justify-self: center;
    align-self: start;
    background-color: white;
    width: auto;

    border-radius: 12px;
    box-shadow: 0 6px 10px -4px rgba(0,0,0,0.15);
  }

  h1 {
    //padding: 10px 10px 10px 50px;
    padding: 10px 10px 10px 10px;
    border-bottom: 1px solid $black;
    //margin-bottom: 25px;
  }
  h2 {
    justify-self: start;
    margin-top: 10px;
  }

  hr {
    grid-area: hr;
    width: 100%;
    display: block;
    height: 0px;
    border: solid;
    border-color: lighten($black, 30%);
    border-width: thin 0 0 0;
    display: none;
  }

  label {
    color: lighten($black, 25%);
    text-size: 15px;
  }

  #meta {
    grid-template:
      "title title"
      "image form"
      "synop synop";


    @media (max-width: 900px), (orientation: portrait) {
      grid-template-columns: max-content;
      place-items: center;
      grid-template:
        "title"
        "image"
        "form"
        "synop";
    }

    .title {
      grid-area: title;
    }

    #synopsis {
      grid-area: synop;
      place-self: stretch;
      margin: 0px 5% 0px 5%;
      textarea {
        white-space: pre-line;
        resize: none;
        width: 100%;
        height: 120px;
      }
    }

    #anime_image {
      grid-area: image;
      height: 346px;
      width: auto;
      place-self: center;
      @media (max-width: 900px), (orientation: portrait) {
        place-self: center;
      }
    }

    .form-content {
      grid-area: form;
      grid-template-columns: 300px;
    }
  }


  .form-group {
    display: grid;
    grid-gap: 16px;

    margin-right: 20px;
    margin-left:  20px;

    .form-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto;

      grid-row-gap:    15px;
      grid-column-gap: 40px;

      @media (max-width: 1000px), (orientation: portrait) {
        grid-template-columns: 1fr 1fr;
      }

      button {
        justify-self: start;
      }

      .switch-wrapper {
        display: grid;
        grid-template-columns: max-content auto;
        justify-content: space-between;

        width: 100%;
      }

      .vue-js-switch {
        justify-self: start;
      }
    }
  }

  .message {
    display: grid;
    color: white;
    height: 50px;
    margin-right: 10px;
    h2 {
      margin-top: inherit;
      place-self: center;
    }
    &#success {
      background-color: $blue;
    }
    &#failure {
      background-color: $red;
    }
  }

  #submission {
    display: grid;
    grid-template-columns: 3fr 1fr;
    width: 100%;

    margin-top: 20px;
    border-top: 1px solid $black;
    padding-top: 10px;

    button {
      margin: 10px;
      place-self: center;
      width: 100px;
    }

    #submit {
      background-color: $blue;
      place-self: end;
      margin-right: 20px;
    }
  }

  #episodes{
    border-radius: 12px;
    box-shadow: 0 6px 10px -4px rgba(0,0,0,0.15);
    background-color: white;
    align-self: start;
    width: stretch;
    h1 {
      margin-bottom: 0;
      border-bottom: 1px solid $black;
    }
  }

  .table {
    background-color: white;
    min-width: 475px;
    width: 100%;
    font-size: 14px;
    color: $black;

    th,
    td {
      padding: 0.75rem;
      vertical-align: center;
      border-top: 1px solid $grey;
      width: max-content;
    }

    thead th {
      border-bottom: 1px solid $black;
      text-align: left;
    }

  	div {
  		overflow: hidden;
  	}

    .table-buttons {
      width: 100%;
      display: grid;
      grid-auto-flow: column dense;
      justify-content: end;
      justify-items: end;
      align-items: center;
      grid-column-gap: 5px;
      .delete {
        background: $red;
      }
      .edit {
        background: $blue;
      }
    }
  }

}
</style>
