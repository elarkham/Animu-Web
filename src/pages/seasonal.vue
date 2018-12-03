<template>
  <article id="seasonal">
    <section id="header">
      <button @click="change_season(-1)">Prev</button>
      <h1 v-text="current_season"></h1>
      <button @click="change_season(+1)">Next</button>
    </section>
    <section id="content">
      <transition-group class="card-list" name="card-list" tag="section">
        <poster-card v-for="show in current.series" :show="show" :key="show.id"></poster-card>
      </transition-group>
    </section>
  </article>
</template>

<script>
import poster_card from '@/components/poster_card.vue'
import animu from '@/assets/js/animu.js'
import _ from 'lodash'

const get_cour = function(month) {
  const cour = {};
  // Winter
  cour[0] = "Winter"
  cour[1] = "Winter"
  cour[2] = "Winter"

  // Spring
  cour[3] = "Spring"
  cour[4] = "Spring"
  cour[5] = "Spring"

  // Summer
  cour[6] = "Summer"
  cour[7] = "Summer"
  cour[8] = "Summer"

  // Fall
  cour[9]  = "Fall"
  cour[10] = "Fall"
  cour[11] = "Fall"

  return cour[month];
}

const get_cour_index = function(c) {
  const cour = {};
  cour["Winter"] = 0
  cour["Spring"] = 3
  cour["Summer"] = 6
  cour["Fall"]   = 9
  return cour[c]
}

export default {
  name: 'seasonal',
  data: function() {
    return {
      series: [],
      season: {},
      current: {
        year: null,
        cour: null,
        series: null,
      },
    }
  },
  components: {
    'poster-card': poster_card
  },
  computed: {
    current_season: function() {
      const page = this;
      if(!page.current.cour || !page.current.year) {
        var today = new Date();
        page.current.cour = get_cour(today.getMonth());
        page.current.year = today.getFullYear();
      }
      return page.current.cour + " " + page.current.year;
    }
  },
  methods: {
    shuffle: function () {
      this.series = _.shuffle(this.series);
    },
    airdate: function () {
      this.series = _.sortBy(this.series, ['started_airing_date']).reverse();
    },
    change_season: function(next) {
      console.log("Next: " + next);
      const page = this;
      const cur  = this.current;

      var cour = get_cour_index(cur.cour);
      cour += next * 3;
      if(cour > 9) {
        cur.cour = "Winter";
        cur.year = cur.year + 1;
      }
      else if(cour < 0) {
        cur.cour = "Fall";
        cur.year = cur.year - 1;
      } else {
        cur.cour = get_cour(cour);
      }

      var today = new Date();
      if((cur.year < 1900) || (cur.year > today.getFullYear())) {
        page.current.cour = get_cour(today.getMonth());
        page.current.year = today.getFullYear();
      }

      if(!page.season[cur.year] || !page.season[cur.year][cur.cour]) {
        console.log(cur.cour + " " + cur.year);
        this.change_season(next);
        return;
      }
      cur.series = page.season[cur.year][cur.cour];
    }
  },
  beforeCreate: function() {
    const page = this;
    animu.all_series({'order_by': 'started_airing_date'}, function(json) {
      console.log(json.series);
      page.series = json.series.reverse();

      const get_cours = function(start, end) {
        const m1 = start.getMonth()
        const m2 = end.getMonth()

        var months = 12 * (end.getFullYear() - start.getFullYear());
        months -= m1;
        months += m2 + 1;

        var cours = [];
        for (var m = 0; m < months; m++) {
          var d = new Date(start);
          d.setMonth(m1 + m);
          var c = get_cour(d.getMonth());
          cours.push(d.getFullYear() + '-' + c);
        }
        return _.uniq(cours);
      }

      for (var show of page.series) {
        var start = new Date(show.started_airing_date.split('-'));

        var end;
        if(show.finished_airing_date != null) {
          end = new Date(show.finished_airing_date.split('-'));
        } else {
          end = new Date();
        }

        var cours = get_cours(start, end);
        for (var c of cours) {
          var t = c.split('-');
          const year = t[0];
          const cour = t[1];

          if(page.season[year] && page.season[year][cour]) {
            page.season[year][cour].push(show);
          } else {
            if (!page.season[year]) {
              page.season[year] = {};
              page.season[year][cour] = [];
              page.season[year][cour].push(show);
            }
            else {
              page.season[year][cour] = [];
              page.season[year][cour].push(show);
            }
          }
        }
        page.current.series = page.season[page.current.year][page.current.cour];
      }
    });
  }
}
</script>

<style lang="scss">
#seasonal {
  display: grid;
  grid-template-rows: 100px 1fr;
  place-content: stretch;
  background: white;

  margin-right:  5%;
  margin-left:   5%;
  padding-bottom: 30px;

  #header {
    display: grid;
    grid-template-columns: 100px 1fr 100px;
    place-items: center;

    justify-content: space-between;
    align-content: space-around;

    border-bottom: 2px solid $black;
    margin-bottom: 20px;
  }

  button {
    margin-left:   10px;
    margin-bottom: 10px;
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
    transition: all 0.5s;
  }

  .card-list-enter, .card-list-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }

  .card-list-enter-active {
    transition: all 0.5s;
  }

  .card-list-leave-active {
    display: none;
  }
}
</style>
