<template>
  <article id="seasonal">
    <section id="header">
      <button @click="change_page(+1)"><icon name="angle-left"/></button>
      <h1 v-text="current.name"></h1>
      <button :disabled="is_latest" @click="change_page(-1)"><icon name="angle-right"/></button>
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

export default {
  name: 'seasonal',
  data: function() {
    return {
      seasons: [{slug: '', anime: []}],
      current: {slug: '', anime: []},
      page: 0,
      created: false,
    }
  },
  components: {
    'poster-card': poster_card
  },
  computed: {
    is_latest() {
      return this.page == 0
    },
  },
  watch: {
    page: function(page) {
      this.update_current(page)
    },
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
      if (query.slug) {
        this.page = _.findIndex(this.seasons, ['slug', query.slug])
      }
    },
    change_page(next) {
      this.page += next
    },
    update_current(page) {
      this.current = this.seasons[page]
      animu
        .get_season(this.current.slug)
        .then((resp) => {_.assign(this.current, resp.data.season); this.$forceUpdate()})
        .catch((error) => console.log(error))

      this.set_query('slug', this.current.slug)
    }
  },
  beforeRouteUpdate(to, _from, next) {
    if (this.created) {
      this.load_query(to.query)
    }
    next()
  },
  beforeRouteEnter(to, _from, next) {
    next()
  },
  beforeCreate() {
    let query = this.$route.query
    const failure = (error) => {
      console.log(error)
    }
    const success = (resp) => {
      console.log(resp.data.seasons);
      this.seasons = _
        .chain(resp.data.seasons)
        .sortBy('sort')
        .reverse()
        .value();

      if (!query.slug) {
        router.replace({query: {slug: this.seasons[0].slug}})
      }
      this.load_query(query)
      this.update_current(this.page)
      this.created = true
    }
    animu
      .all_seasons()
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
