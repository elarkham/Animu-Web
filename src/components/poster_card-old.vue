<template>
  <div class="poster-card">
    <router-link :to="{name: 'series-id', params: {id: show.id}}">
      <img :src="img_src" class="image-field"></img>
      <div></div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'poster-card',
  props: ['show'],
  computed: {
    img_src() {
      const img =
        "/assets/"
        + this.show.directory + "/"
        + this.show.poster_image.small;

      return img;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.poster-card {
  //padding: 20px;

  .image-field {
    height: 300px;
    width: 211px;
    border-radius: 12px;
    box-shadow: 0 6px 10px -4px rgba(0,0,0,0.15);
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
