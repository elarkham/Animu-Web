<template>
<div class="manage">
  <article class="table">
    <section class="header">
      <h1>{{name}}</h1>
      <div class="header-buttons">
        <button class="mu-button">
          <icon name="plus"></icon>
          Add
        </button>
      </div>
    </section>
    <table>
      <thead>
        <th @click="sortBy('id')">ID</th>
        <th>Poster</th>
        <th @click="sortBy('augur')">Augur</th>
        <th @click="sortBy('name')">Title</th>
        <th class="filter">
          <v-input label="Filter" v-model="filter.search"/>
        </th>
      </thead>
      <tbody class="table-rows">
        <tr v-for="(item, index) in paginated" :key="item.id" :data-index="index">
          <td><div>{{item.id}}</div></td>
          <td><img :src="img_src(item)"/></td>
          <td><div>
              <toggle-button
                class="toggle"
                :cssColors="true"
                :sync="true"
                v-model="item.augur"
                @change="toggle_augur(item)"
                />
          </div></td>
          <td><div>{{item.name}}</div></td>
          <td>
            <div class="table-buttons">
              <router-link :to="{name: 'anime-id', params: {id: item.id}}">
                <button class="mu-button">View</button>
              </router-link>
              <router-link :to="{name: 'manage-anime-id', params: {id: item.id}}">
                <button class="mu-button edit">Edit</button>
              </router-link>
              <button class="mu-button delete">Delete</button>
          </div>
          </td>
        </tr>
      </tbody>
    </table>
    <section class="footer">
      <el-pagination
        :total.sync="filtered.length"
        :current-page.sync="paginate.page"
        :page-size.sync="paginate.page_size"
        :page-sizes="paginate.page_sizes"
        layout="sizes, prev, pager, next">
      </el-pagination>
    </section>
 </article>
</div>
</template>

<script>
import input from '@/components/input'

import index from '../index.js'
import '../_index.scss'

export default {
  name: 'anime-index',
  mixins: [index],
  components: {
    'v-input': input
  },
  data: () => ({
    name: "Anime",
    data: [],
    sort: {
      order: 'desc',
      field: 'augur',
    },
    filter: {
      search: "",
      field: 'name',
    },
    paginate: {
      page: 1,
      page_size: 10,
      page_sizes: [10, 25, 50, 100],
    },
  }),
  beforeCreate() {
    animu
      .all_anime({params: {'order_by':'id'}})
      .then((resp) => {
        console.log(resp.data.anime);
        this.data = resp.data.anime;
        this._sort();
      })
      .catch((error) => {
        console.log(error)
        animu.check_login(error, this.$router);
      })
  },
  methods: {
    img_src(anime)  {
      const img =
        "/assets/"
        + anime.directory + "/"
        + anime.poster_image.tiny;

      return img;
    },
    toggle_augur(anime) {
      const data = {
        "anime": {
          "audit": false,
          "populate": false,
          "spawn_episodes": false,
          "augur": anime.augur,
        }
      }
      const success = (resp) => {}
      const failure = (resp) => {
        anime.augur = !anime.augur;
      }
      animu.client
        .patch("/api/media/anime/" + anime.id, JSON.stringify(data))
        .then(success)
        .catch(failure)
    },
  },
}
</script>
