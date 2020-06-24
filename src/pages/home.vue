<template>
  <article class="home">
    <section class="controls">
      <div class="control-buttons">
        <button class="mu-button" v-on:click="shuffle">Shuffle</button>
        <button class="mu-button" v-on:click="airdate">Airdate</button>
      </div>

      <div class="control-pagination">
        <el-pagination
          @size-change="cache_size"
          class="paginate"
          :total.sync="anime.length"
          :current-page.sync="paginate.page"
          :page-size.sync="paginate.page_size"
          :page-sizes="paginate.page_sizes"
          background
          layout="sizes, prev, pager, next">
        </el-pagination>
      </div>

      <div class="control-search">
        <el-input
          placeholder="Search"
          prefix-icon="el-icon-search"
          size="small"
          v-model:value="filter.search"
          />
      </div>
    </section>

    <carousel
      :per-page="1"
      :mouseDrag="false"
      :paginationEnabled="false"
      :navigateTo="pageIndex">
      <slide v-for="page in paginated">
        <div class="card-list">
          <poster-card v-for="anime in page" :anime="anime" :key="anime.id"></poster-card>
        </div>
      </slide>
    </carousel>

  </article>
</template>

<script>
import poster_card from '@/components/poster_card.vue'
import input from '@/components/input.vue'
import Anime from '@/models/anime.js'
import {Season} from '@/models/season.js'
import _ from 'lodash'

const cached_size = function(def) {
  const local = localStorage.getItem('page_size');
  if (!local) {
    return def;
  }
  return Number(local);
}

export default {
  name: 'home',
  data: () => ({
    //anime: [],
    paginate: {
      page: 1,
      page_size: cached_size(50),
      page_sizes: [10, 25, 50, 100, 200],
    },
    filter: {
      field:  'name',
      search: '',
    }
  }),
  components: {
     'poster-card': poster_card,
     'v-input': input,
  },
  computed: {
    anime() {
      return Anime.query().orderBy('start_date', 'desc').get()
    },
    filtered() {
      return this.anime.filter((item) => {
        const f = this.filter;
        const search = f.search.toLowerCase();
        const value  = item[f.field].toString().toLowerCase();
        return value.indexOf(search) > -1
      })
    },
    paginated() {
      return _.chunk(this.filtered, this.paginate.page_size)
    },
    pageIndex() {
      return this.paginate.page - 1;
    }
  },
  watch: {
    'paginate.page': function(page) {
      this.set_query('page', page);
    },
    'filter.search': function(search) {
      this.set_query('search', search);
    }
  },
  methods: {
    shuffle() {
      this.anime = _.shuffle(this.anime);
    },
    airdate() {
      this.anime = _.sortBy(this.anime, ['start_date']).reverse();
    },
    cache_size(size) {
      localStorage.setItem('page_size', size);
    },
    set_query(key, value) {
      const pair = {[key]: value};
      const query = Object.assign({}, this.$route.query, pair);
      if (!value) {
        delete query[key];
      }
      router.push({query: query})
    },
    load_query(query) {
      if (query.page) {
        this.paginate.page = Number(query.page)
      } else {
        this.paginate.page = 1;
      }

      if(query.search) {
        this.filter.search = query.search
      } else {
        this.filter.search = '';
      }
    }
  },
  beforeRouteUpdate(to, _from, next) {
    this.load_query(to.query)
    next()
  },
}
</script>

<style lang="scss">
.home {
  display: flex;
  flex: 1 1 0;
  flex-flow: column;

  width: 100vw;

  // for scrollbar
  padding-right: 10px;

  .controls {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;

    height: 50px;
    margin-bottom: 15px;

    background-color: lighten($black, 9%);
    box-shadow: 0 8px 6px -6px rgba(0,0,0,0.5);

    .control-buttons {
      button {
        margin-left:   10px;
      }
    }
    .control-pagination {
      place-self: center;
      justify-content: center;
      .paginate {
        //box-shadow: 0 6px 10px -4px rgba(0, 0, 0, 0.15);
        //border-radius: 12px;
        //background-color: white;
        width: max-content;
        margin-right: 120px;
        .active {
          background-color: $black !important;
        }
      }
    }
    .control-search {
      justify-self: end;
      .el-input {
        width: 300px;
        margin-right: 40px;
      }
    }
  }
}
.card-list {
  display: grid;

  grid-template-columns: repeat(auto-fill, 211px);

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
