<template>
  <router-link class="poster-card" :to="{name: 'anime-id', params: {id: anime.id}}">
    <img :src="img_src" class="image-field"></img>
    <div class="title">
      <h4>{{anime.name}}</h4>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'poster-card',
  props: {
    anime: {
      type: Object,
      required: true,
    },
    size: {
      type: String,
      default: "medium"
    }
  },
  computed: {
    img_src() {
      const img =
        "/assets/"
        + this.anime.directory + "/"
        + this.anime.poster_image[this.size];

      return img;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.poster-card {
  //padding: 20px;
  //background-color: white;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;

  .image-field {
    box-shadow: 0 6px 10px -4px rgba(0,0,0,0.15);
    border-radius: 12px;
    height: 300px;
    width: 211px;
    grid-column: 1;
    grid-row: 1 / 5;
  }

  &:hover .title {
    display: grid;
    padding: 5px;
    height: 60px;
  }

  .title {
    grid-column: 1;
    grid-row: 4;

    display: grid;

    transition-property: all;
    transition-duration: 0.3s;
    transition-timing-function: cubic-bezier(0, 1, 0.5, 1);

    justify-content: center;
    align-content: center;

    color: white;
    background-color: #00000080;

    //border-bottom-right-radius: 12px;
    //border-bottom-left-radius: 12px;
    border-radius: 12px;

    height: 0px;
    overflow: hidden;

    h4 {
      font-size: 0.9rem;
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    justify-self: stretch;
    align-self: end;
  }

  &.hide {
    display: none;
  }

  &.show {
    display: block;
  }
}

//.poster-card {
//  display: block;
//  margin: 1rem;
//
//  height: 200px;
//
////  border-bottom: 10px solid transparent;
//  padding-bottom: 8px;
//
////  &:hover {
////    border-bottom: 5px solid #fff;
////  }
//
//  img {
//    border-radius: 25px;
//    width: 100%;
//    height: 100%;
//  }
//}
</style>
