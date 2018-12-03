<template>
  <article id="series_profile">
    <section id="poster">
      <img id="series_img" :src="img_src(show)" alt="alt">
    </section>

    <section id="meta">
      <h1 id="series_title">{{show.canon_title}}</h1>
      <p id="series_synopsis">{{show.synopsis}}</p>
    </section>

    <section id="episodes">
      <table id="episode_table">
        <tr class="ep_entry" v-for="ep in episodes">
          <td class="ep_name">Episode {{ep.number}}</td>
          <td>
            <router-link :to="{ name: 'episode-id', params: { id: ep.id }}">
              <button :disabled="!ep.video" class="ep_link" >Watch</button>
            </router-link>
          </td>
        </tr>
      </table>
    </section>
  </article>
</template>

<script>
import animu from '@/assets/js/animu.js'

export default {
  name: 'series-id',
  data: function() {
    return {
      show: {},
      episodes: [],
      loading: true,
    }
  },
  methods: {
    img_src: function(show)  {
      if (this.loading) {
        return "";
      }

      const img =
        "/assets/"
        + show.directory + "/"
        + show.poster_image.large;

      return img;
    },
  },
  beforeCreate: function() {
    const id = this.$route.params.id;
    const profile = this;
    animu.get_series(id, function(json) {
      profile.show = json.series;
      profile.episodes = json.series.episodes;
      profile.episodes.sort(function(ep1, ep2) {
        return ep1.number - ep2.number;
      });
      profile.loading = false;
    });
  }
}
</script>


<style lang="scss">
#series_profile {
  display: grid;
  grid-template-columns: minmax(min-content, 1fr) minmax(min-content, 1fr) minmax(min-content, 1fr);
  @media (max-width: 900px), (orientation: portrait) {
    grid-template-columns: 1fr;
    grid-gap: 15px;
  }
  justify-items: center;
  align-items: center;
  height: 100%;

  #poster {

    #series_img {
      height: 520px;
      width: auto;
    }
  }

  #meta {

    @media (max-width: 900px), (orientation: portrait) {
      margin-left:  5%;
      margin-right: 5%;
    }

    #series_title {
      font-size: 1.65em;
    }

    #series_synopsis {
      display: block;
      white-space: pre-line;
    }
  }

  #episodes {

    #episode_table {
      .ep_entry { height: 35px; }
      .ep_name  { padding-right: 10px; }
    }
  }
}
</style>
