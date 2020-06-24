<template>
<div id="manage_series_profile">
  <article id="profile_meta">
    <h1> {{show.canon_title}} </h1>
    <section id="series_form">
     <!-- Info -->
      <section id="meta" class="form-group">
        <h2>Metadata</h2>
        <img id="series_img" :src="img_src" alt="orig">
        <div class="form-content">
          <label>Canon Title: </label>
          <el-input size="small" type="text" v-model="show.canon_title"></el-input>

          <label>Slug: </label>
          <el-input size="small" type="text" v-model="show.slug"></el-input>

          <label>Age Rating: </label>
          <el-input size="small" type="text" v-model="show.age_rating"></el-input>

          <label>NSFW: </label>
          <toggle-button class="toggle" :cssColors="true" :sync="true" v-model="show.nsfw"/>

          <label>Season Number: </label>
          <el-input size="small" type="number" v-model="show.season_number"></el-input>

          <label>Poster Image: </label>
          <input id="poster-input"
                 accept="image/*"
                 type="file"
                 @change="filesChange($event.target.files)"
                 >
          </input>
        </div>

        <div id="synopsis">
          <label for="synopsis">Synopsis: </label>
          <br>
          <textarea v-model="show.synopsis"></textarea>
        </div>
      </section>

      <!-- Kitsu -->
      <section id="kitsu" class="form-group">
        <h2>Kitsu</h2>
        <div class="form-content">
          <label>Kitsu Rating: </label>
          <el-input size="small" type="text" v-model="show.kitsu_rating"></el-input>

          <label>Kitsu ID: </label>
          <el-input size="small" type="number" v-model="show.kitsu_id"></el-input>
        </div>
      </section>

      <!-- Augur -->
      <section id="augur" class="form-group">
        <h2>Augur</h2>
        <div class="form-content">
          <label>Regex: </label>
          <el-input size="small" type="text" v-model="show.regex"></el-input>

          <label>RSS Feed: </label>
          <el-input size="small" type="text" v-model="show.rss_feed"></el-input>

          <label>Subgroup: </label>
          <el-input size="small" type="text" v-model="show.subgroup"></el-input>

          <label>Quality: </label>
          <el-input size="small" type="text" v-model="show.quality"></el-input>

          <label>Watch: </label>
          <toggle-button class="toggle" :cssColors="true" :sync="true" v-model="show.watch"/>

        </div>
      </section>


      <!-- Filesystem -->
      <section id="filesystem" class="form-group">
        <h2>Filesystem</h2>
        <div class="form-content">
          <label>Directory: </label>
          <el-input size="small" type="text" v-model="show.directory"></el-input>
        </div>
      </section>

      <!-- Dates -->
      <section id="dates" class="form-group">
        <h2>Dates</h2>
        <div class="form-content">
          <label>Start Date: </label>
          <el-input size="small" type="date" v-model="show.started_airing_date"></el-input>

          <label>End Date: </label>
          <el-input size="small" type="date" v-model="show.finished_airing_date"></el-input>
        </div>
      </section>

      <!-- Episode Meta -->
      <section id="episode-meta" class="form-group">
        <h2>Episode Meta</h2>
        <div class="form-content">
          <label>Episode Count: </label>
          <el-input-number size="small" v-model="show.episode_count" :min="1"></el-input-number>

          <label>Episode Length: </label>
          <el-input size="small" type="number" v-model="show.episode_length"></el-input>
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
import _ from 'lodash'

export default {
  name: 'manage-series-id',
  data: function() {
    return {
      show: {},
      poster: null,
      episodes: [],
      loading: true,
      form: {},
      msg: null,
      success: null,
    }
  },
  computed: {
    img_src: function()  {
      if (!this.show.poster_image) {
        return "";
      }

      const img =
        "/assets/"
        + this.show.directory + "/"
        + this.show.poster_image.original
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
      const show = this.show;

      // Gather Form Data
      var form_data = {
        //-- Meta
        /* TODO
        "titles": {
          "en":    "Gabriel DropOut"
          "en_jp": "Gabriel DropOut"
          "ja_jp": "ガヴリールドロップアウト"
        }, */
        "canon_title": show.canon_title,     // string
        "season_number": show.season_number, // string
        "slug": show.slug,                   // string
        "synopsis": show.synopsis,           // string
        "season_number": show.season_number, // integer

        "age_rating": show.age_rating, // string
        "nsfw": show.nsfw,             // bolean

        //"tags": show.tags,         // {:array, :string}, TODO
        //"genres": show.genres,     // {:array, :string}, TODO
        //"trailers": show.trailers, // {:array, :string}, TODO

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
        //"cover_image": show.cover_image, // {:array, :string}, TODO
        //"gallery": show.gallery,         // {:map, :string},   TODO

        //-- Kitsu
        "kitsu_id": show.kitsu_id,         // string
        "kitsu_rating": show.kitsu_rating, // float

        //-- Augur
        "regex": show.regex,       // string
        "rss_feed": show.rss_feed,    // string
        "subgroup": show.subgroup, // string
        "quality": show.quality,   // string
        "watch": show.watch,       // boolean, default: false

        //-- Filesystem
        "directory": show.directory, // string

        //-- Dates
        "started_airing_date": show.started_airing_date,    // date/string
        "finished_airing_date": show.finished_airing_date,  // date/string

        //-- Episodes
        "episode_count": show.episode_count,   // integer
        "episode_length": show.episode_length, // integer
        //"episodes": [],

        //-- Options
        "audit": false,          // boolean
        "populate": false,       // boolean
        "spawn_episodes": false, // boolean
      };

      this.form = form_data;
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
      this.get_form();
      const data = {
        "series": form.form,
      };
      if(option) {
        data.series[option] = true;
      }

      // Submit Data
      const url = "/api/series/" + this.show.id;
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      const success = function(resp) {
        form.show = resp.data.series;
        form.episodes = resp.data.series.episodes
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

      if(option) {
        data.series[option] = false;
      }
    },
    delete_ep: function(ep, index) {
      const form = this;
      const success = function(resp) {
        form.episodes = _.filter(form.episodes, (e) => {
          return e.id != ep.id
        });
      }
      //animu.delete("/api/episodes/" + ep.id, {}, success)
    }
  },

  beforeCreate: function() {
    const id = this.$route.params.id;
    const profile = this;
    animu.get_series(id, function(resp) {
      profile.show = resp.data.series;
      profile.episodes = resp.data.series.episodes;
      profile.episodes.sort(function(ep1, ep2) {
        return ep1.number - ep2.number;
      });
      profile.loading = false;
    });
  }
}
</script>


<style lang="scss">
#manage_series_profile {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px;

  justify-self: center;

  height: auto;
  max-width: 100%;
  padding-right: 30px;
  padding-left: 10px;

  @media (max-width: 1300px), (orientation: portrait) {
    grid-template-columns: 1fr;
  }

  #profile_meta {
    justify-self: center;
    align-self: start;
    background-color: white;
    padding-left: 10px;
    width: auto;

    border-radius: 12px;
    box-shadow: 0 6px 10px -4px rgba(0,0,0,0.15);
  }

  h1 {
    //padding: 10px 10px 10px 50px;
    padding: 10px 10px 10px 10px;
    border-bottom: 1px solid $black;
    margin-bottom: 25px;
  }
  h2 {
    justify-self: start;
    margin-top: 10px;
  }

  #synopsis {
    place-self: stretch;
    margin: 0px 5% 0px 5%;
    textarea {
      white-space: pre-line;
      resize: none;
      width: 100%;
      height: 120px;
      border: 1px solid $black;
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

  #series_img {
    height: 346px;
    width: auto;
    place-self: end;
    @media (max-width: 900px), (orientation: portrait) {
      place-self: center;
    }
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

    h2 {
      grid-area: title;
    }

    #synopsis {
      grid-area: synop;
    }

    #series_image {
      grid-area: image;
    }

    .form-content {
      grid-template-columns: max-content 200px;
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

  .form-group {
    display: grid;
    place-items: start;
    grid-gap: 16px;

    margin-right: 20px;
    margin-left:  20px;

    .form-content {
      display: grid;
      grid-template-columns: max-content 200px max-content 200px;
      grid-template-rows: auto;
      grid-gap: 15px;

      @media (max-width: 1000px), (orientation: portrait) {
        grid-template-columns: 1fr 1fr;
      }

      label {
        text-align: right;
        justify-self: right;
        width: max-content;
      }

      input,
      button {
        justify-self: start;
      }

      .vue-js-switch {
        justify-self: start;
      }
    }
  }

}
</style>
