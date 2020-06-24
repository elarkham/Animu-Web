<template>
  <article id="seasonal">
    <section id="header">
      <button @click="change_season(-1)"><icon name="angle-left"/></button>
      <h1 v-text="current_season"></h1>
      <button :disabled="is_latest" @click="change_season(+1)"><icon name="angle-right"/></button>
    </section>
    <section id="content">
      <transition-group class="card-list" name="card-list" tag="section">
        <poster-card v-for="anime in current.anime" :anime="anime" :key="anime.id"></poster-card>
      </transition-group>
    </section>
  </article>
</template>

<script>
import poster_card from '@/components/poster_card.vue'
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
      anime: [],
      season: {},
      current: {
        year: null,
        cour: null,
        anime: null,
      },
    }
  },
  components: {
    'poster-card': poster_card
  },
  computed: {
    current_season() {
      const page = this;
      if(!page.current.cour || !page.current.year) {
        var today = new Date();
        page.current.cour = get_cour(today.getMonth());
        page.current.year = today.getFullYear();
      }
      return page.current.cour + " " + page.current.year;
    },
    is_latest(){
      const page = this;
      var today = new Date();
      return (page.current.cour == get_cour(today.getMonth()))
          && (page.current.year == today.getFullYear())
    },
  },
  watch: {
   // 'current.year': function(year){
   //   this.set_query('year', year)
   // },
   // 'current.cour': function(cour) {
   //   this.set_query('cour', cour)
   // }
  },
  methods: {
    set_query(key, value) {
      const pair = {[key]: value};
      const query = Object.assign({}, this.$route.query, pair);
      if (!value) {
        delete query[key];
      }
      router.push({query: query})
    },
    load_query(query) {
      const year = Number(query.year)
      const cour = cour;
      if (this.season[year] && year && query) {
        this.set_season(Number(query.year), query.cour);
      }
    },
    set_season(year, cour) {
      this.current.year = year;
      this.current.cour = cour;
      this.current.anime = this.season[year][cour];
    },
    change_season(next) {
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
      //cur.anime = page.season[cur.year][cur.cour];
      router.push({query: {year: cur.year, cour: cur.cour}})
    }
  },
  beforeRouteUpdate(to, _from, next) {
    if(!to.query.year || !to.query.cour) {
      const today = new Date();
      const year = today.getFullYear();
      const cour = get_cour(today.getMonth());
      next(`/seasonal?year=${year}&cour=${cour}`)
      //next({query: {year: year, cour: cour}})
      return
    }
    this.load_query(to.query)
    next()
  },
  beforeRouteEnter(to, _from, next) {
    next()
  },
  beforeCreate() {
    const query = this.$route.query;
    const success = (resp) => {
      console.log(resp);
      console.log(resp.data.anime);
      this.anime = resp.data.anime.reverse();

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

      for (var anime of this.anime) {
        var start = new Date(anime.start_date.split('-'));

        var end;
        if(anime.finished_airing_date != null) {
          end = new Date(anime.finished_airing_date.split('-'));
        } else {
          end = new Date();
        }

        var cours = get_cours(start, end);
        for (var c of cours) {
          var t = c.split('-');
          const year = t[0];
          const cour = t[1];

          if(this.season[year] && this.season[year][cour]) {
            this.season[year][cour].push(anime);
          } else {
            if (!this.season[year]) {
              this.season[year] = {};
              this.season[year][cour] = [];
              this.season[year][cour].push(anime);
            }
            else {
              this.season[year][cour] = [];
              this.season[year][cour].push(anime);
            }
          }
        }
      }
      router.replace({query: {year: this.current.year, cour: this.current.cour}})
      this.load_query(query)
    }

    const failure = (error) => {
      console.log(error)
    }

    animu
      .all_anime({params: {'order_by': 'start_date'}})
      .then(success)
      .catch(failure)
  }
}
</script>

<style lang="scss">
#seasonal {
  display: grid;
  grid-template-rows: 100px 1fr;
  place-content: stretch;
  background: white;

  border-radius: 12px;
  box-shadow: 0 6px 10px -4px rgba(0,0,0,0.15);

  margin-right:  5%;
  margin-left:   5%;
  margin-top: 20px;
  padding-bottom: 20px;

  #header {
    display: grid;
    grid-template-columns: 100px 1fr 100px;
    place-items: center;

    justify-content: space-between;
    align-content: space-around;

    border-bottom: 1px solid darken($grey, 10%);
    margin-bottom: 20px;
  }

  button {
    color: $black;
    font-size: 1.5rem;
    background-color: transparent;
    border: none;

    &:disabled {
      color: darken($grey, 20%);
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
