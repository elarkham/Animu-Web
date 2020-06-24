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
        <th @click="sortBy('anime.canon_title')">Anime</th>
        <th @click="sortBy('number')">#</th>
        <th @click="sortBy('canon_title')">Title</th>
        <th class="filter">
          <v-input label="Filter" v-model="filter.search"/>
        </th>
      </thead>
      <tbody class="table-rows">
        <tr v-for="(item, index) in paginated" :key="item.id" :data-index="index">
          <td><div>{{item.id}}</div></td>
          <td><div>{{item.anime.canon_title}}</div></td>
          <td><div>{{item.number}}</div></td>
          <td><div>{{item.title}}</div></td>
          <td>
            <div class="table-buttons">
              <router-link :to="{name: 'episode-id', params: {id: item.id}}">
                <button class="mu-button">View</button>
              </router-link>
              <router-link :to="{name: 'manage-episode-id', params: {id: item.id}}">
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
  name: 'episode-index',
  mixins: [index],
  components: {
    'v-input': input
  },
  data: () => ({
    name: "Episodes",
    data: [],
    sort: {
      order: 'desc',
      field: 'id',
    },
    filter: {
      search: "",
      field: 'id',
    },
    paginate: {
      page: 1,
      page_size: 10,
      page_sizes: [10, 25, 50, 100],
    },
  }),
  beforeCreate() {
    animu
      .all_episodes({params: {'order_by':'id'}})
      .then((resp) => {
        console.log(resp.data.episodes);
        this.data = resp.data.episodes;
        this._sort();
      })
      .catch((error) => {
        console.log(error)
        animu.check_login(error, this.$router);
      })
  },
}
</script>
