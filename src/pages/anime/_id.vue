<template>
  <article id="anime_profile">
    <section id="poster">
      <img id="anime_img" :src="img_src(anime)" alt="alt">
    </section>

    <section id="meta">
      <h1 id="anime_title">{{anime.name}}</h1>
      <p id="anime_synopsis">{{anime.synopsis}}</p>
    </section>

    <section id="episodes">
      <table id="episode_table">
        <tr class="ep_entry" v-for="ep in episodes">
          <td class="ep_name">Episode {{ep.number}}</td>
          <td class="ep_watch" :class="{video_null: !ep.video}">
            <router-link :to="{ name: 'episode-id', params: { id: ep.id }}">
              <img class="ep_thumb" :src="ep_thumb(ep)"></img>
            </router-link>
          </td>
        </tr>
      </table>
    </section>
  </article>
</template>

<script>
export default {
  name: 'anime-id',
  data: function() {
    return {
      anime: {},
      episodes: [],
      loading: true,
    }
  },
  methods: {
    img_src(anime)  {
      if (this.loading) {
        return "";
      }

      const img =
        "/assets/"
        + anime.directory + "/"
        + anime.poster_image.large;

      return img;
    },
    ep_thumb(ep)  {
      if (this.loading) {
        return "";
      }
      if (!ep.video || !ep.video.thumbnail) {
        return "fallback_thumbnail.png";
      }

      const img =
        "/assets/"
        + this.anime.directory + "/"
        + ep.video.thumbnail.medium;

      return img;
    },
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
      .catch(function(error) {
        console.log(error)
        animu.check_login(error, profile.$router)
      })
  }
}
</script>


<style lang="scss">
#anime_profile {
  display: grid;
  grid-template-columns: minmax(min-content, 1fr) minmax(min-content, 1fr) minmax(min-content, 1fr);
  @media (max-width: 900px), (orientation: portrait) {
    grid-template-columns: 1fr;
    grid-gap: 15px;
  }
  max-width: 90%;
  height: 100%;

  background-color: white;
  border-radius: 12px;
  box-shadow: 0 6px 10px -4px rgba(0,0,0,0.15);

  justify-self: center;
  align-self: center;
  justify-items: center;
  align-items: center;

  margin-top: 50px;

  #poster {

    #anime_img {
      height: 520px;
      width: auto;
      border-radius: 12px;
    }
  }

  #meta {

    @media (max-width: 900px), (orientation: portrait) {
      margin-left:  5%;
      margin-right: 5%;
    }

    #anime_title {
      font-size: 1.65em;
    }

    #anime_synopsis {
      display: block;
      white-space: pre-line;
    }
  }

  #episodes {

    #episode_table {
      .ep_entry {
        //height: 35px;
      }
      .ep_name  {
        padding-right: 10px;
      }
      .ep_thumb {
        width: 100px;
      }
    }
  }
}
</style>
