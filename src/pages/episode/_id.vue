<template>
  <section class="video-container">
    <div class="video-content">
      <video id="video"
             class="video-js vjs-animu-skin vjs-big-play-centered vjs-16-9">
      </video>
    </div>
  </section>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
import videojs_hotkeys from 'videojs-hotkeys'

import SubtitlesOctopus from '@/vendor/ass/subtitles-octopus.js'

const assPlugin = function(options) {
  if(!SubtitlesOctopus){
    return;
  }
  const player = this;

  // Configure ASS renderer
  const assOptions = {
    video: player.tech_.el(),
    subUrl: options.subUrl,
    fonts: options.fonts,
    workerUrl: '/assets/ass/subtitles-octopus-worker.js',
  };
  player.octopusInstance = new SubtitlesOctopus(assOptions);
}
videojs.registerPlugin('assPlugin', assPlugin);


export default {
  name: 'episode-id',
  data: function() {
    return {
      episode: {},
      player: {},
      loading: true,
    }
  },
  methods: {
    playerInitialize: function(){
      this.player = videojs('video', {
        controls: true,
        fluid: true,
        controlBar: {
          volumePanel: {
            inline: false
          },
          subtitlesButton: {
            default: true
          },
          children: [
            'playToggle',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'progressControl',
            'liveDisplay',
            'remainingTimeDisplay',
            'customControlsSpacer',
            'chaptersButton',
            'subtitlesButton',
            'captionsButton',
            'volumePanel',
            'fullscreenToggle'
          ]
        }
      });
    },
    playerDispose: function(){
      if(this.player) {
        this.player.dispose();
      }
    },
    playerSetSrc: function(url){
      this.player.src(url);
    }
  },
  mounted: function() {
    this.playerInitialize();
    this.player.ready(function(){
      this.hotkeys({
        volumeStep: 0.1,
        seekStep: 5,
        enableMute: true,
        enableFullscreen: true,
        enableNumbers: false,
        enableVolumeScroll: true,
        enableHoverScroll: true,
      });
    });

    const profile = this;
    const id = this.$route.params.id;
    const player = this.player

    const success = function(resp) {
      profile.episode = resp.data.episode;
      const ep = profile.episode;

      // Anime
      const assets = "/assets/";
      const anime_dir = assets + ep.anime.directory + "/";

      // Video
      const video_dir = anime_dir + ep.video.dir + "/";
      const video_file = video_dir + ep.video.filename;
      console.log("Video File: " + video_file);

      // Subtitles
      const subtitles = ep.video.subtitles;
      if(subtitles !== null) {
        const sub_dir = subtitles.dir + "/";
        const sub_file = anime_dir + sub_dir + subtitles.filename;

        // Fonts
        const font_dir = "/" + subtitles.font_dir + "/";
        const fonts = subtitles.fonts.map((f) => anime_dir + font_dir + f);

        //SubtitlesOctopus
        player.assPlugin({
          subUrl: sub_file,
          fonts: fonts,
          language: "Japanese",
          label: "Japanese",
        });
      }

      // Source
      profile.playerSetSrc(video_file);

      profile.loading = false;
    };
    const failure = function(error) {
      console.log(error);
      animu.check_login(error, profile.$router);
    };

    animu
      .get_episode(id)
      .then(success)
      .catch(failure)
  },
  beforeDestroy: function() {
    this.playerDispose();
  }
}
</script>


<style lang="scss">
//@import "../../assets/css/video/video-js.css";
.video-container {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  align-items: center;
  height: 95%;
  margin-top: 20px;
}

.video-content {
  width: 80%;
}

.video-js,
.vjs-control-bar,
.vjs-big-play-button,
.vjs-volume-vertical {
  background-color: #212121 !important;
}
</style>
