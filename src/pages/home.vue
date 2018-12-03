<template>
  <section class="home">
    <button v-on:click="shuffle">Shuffle</button>
    <button v-on:click="airdate">Airdate</button>
    <transition-group class="card-list" name="card-list" tag="section">
      <poster-card v-for="show in series" :show="show" :key="show.id"></poster-card>
    </transition-group>
  </section>
</template>

<script>
import poster_card from '@/components/poster_card.vue'
import animu from '@/assets/js/animu.js'
import _ from 'lodash'

export default {
  name: 'home',
  data: function() {
    return {
      series: []
    }
  },
  components: {
    'poster-card': poster_card
  },
  methods: {
    shuffle: function () {
      this.series = _.shuffle(this.series);
    },
    airdate: function () {
      this.series = _.sortBy(this.series, ['started_airing_date']).reverse();
    },
  },
  beforeCreate: function() {
    const home = this;
    animu.all_series({'order_by':'started_airing_date'}, function(json) {
      console.log(json.series);
      home.series = json.series.reverse();
    });
  }
}
</script>

<style lang="scss">
.home {
  button {
    margin-left:   10px;
    margin-bottom: 10px;
  }
}
.card-list {
  display: grid;

  grid-template-columns: repeat(auto-fill, 211px);
  grid-auto-flow: row;
  grid-auto-rows: 300px;

  justify-items: center;
  justify-content: space-evenly;
  align-content: space-around;

  grid-column-gap:5px;
  grid-row-gap: 20px;
}

.card-list-move {
  transition: transform 0.8s;
}
</style>
