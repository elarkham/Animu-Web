<template>
  <div class="manage">
    <table class="table">
      <thead>
        <th @click="sortBy('id')" class="clickable">ID</th>
        <th @click="sortBy('watch')" class="clickable">Watch</th>
        <th @click="sortBy('canon_title')" class="clickable">Title</th>
        <th class="filter">
          Filter:
          <input type="search" v-model="search"></input>
        </th>
      </thead>
      <transition-group
				class="table-rows"
				name="table-rows"
				tag="tbody"
				:css="false"
				@before-enter="beforeEnter"
				@enter="enter"
				@leave="leave"
				>
        <tr v-for="(show, index) in filtered" :key="show.id" :data-index="index">
          <td><div>{{show.id}}</div></td>
          <td><div>
              <toggle-button
                class="toggle"
                :cssColors="true"
                :sync="true"
                v-model="show.watch"
                @change="toggle_watch(show)"
                />
          </div></td>
          <td><div>{{show.canon_title}}</div></td>
          <td class="table-buttons">
           <router-link :to="{name: 'manage-series-id', params: {id: show.id}}">
              <button class="edit">Edit</button>
            </router-link>
            <button class="delete">Delete</button>
          </td>
        </tr>
      </transition-group>
    </table>
  </div>
</template>

<script>
import animu from '@/assets/js/animu.js'
import Velocity from 'velocity-animate'
import _ from 'lodash'

export default {
  name: 'manage',
  data: function() {
    return {
      series: [],
      search: "",
      order: "desc",
      sortField: "watch",
    }
  },
  computed: {
    filtered: function () {
			const vm = this;
      return vm.series.filter(function (show) {
        const search = vm.search.toLowerCase();
        const title  = show.canon_title.toLowerCase();
        return title.indexOf(search) > -1
      })
    },
  },
	methods: {
    toggle_watch: function(show) {
      const data = {
        "series": {
          "audit": false,
          "populate": false,
          "spawn_episodes": false,
          "watch": show.watch,
        }
      }
      const success = (resp) => {
        this.sort();
      }
      const failure = (resp) => {
        show.watch = !show.watch;
      }
      animu.patch("/api/v1/series/" + show.id, data, success, {})
    },
    sort: function() {
      this.series = _.sortBy(this.series, [this.sortField, "id"]);
      if (this.order == "desc") {
        this.series.reverse();
      }
    },
    sortBy: function(field) {
      this.series = _.sortBy(this.series, [field, "id"]);
      if (this.order == "asc" && this.sortField == field) {
        this.order = "desc";
        this.series = this.series.reverse();
      } else {
        this.order = "asc";
      }
      this.sortField = field;
    },
		beforeEnter: function (el) {
			let divs = el.querySelectorAll("div");
			for (let i = 0; i < divs.length; i++) {
				divs[i].style.maxHeight = "0px";
			}
		},
		enter: function (el, done) {
			let divs = el.querySelectorAll("div");
			Velocity(
				divs,
				{ maxHeight: "40px"},
				{ duration: 240, complete: done }
			);
		},
		leave: function (el, done) {
			let divs = el.querySelectorAll("div");
			Velocity(
				divs,
				{ maxHeight: "0px"},
				{ duration: 240, complete: done }
			);
		}
	},
  beforeCreate: function() {
    const index = this;
    animu.all_series({'order_by':'id'}, function(json) {
      console.log(json.series);
      index.series = json.series;
      index.sort();
    });
  }
}
</script>

<style lang="scss">
.manage {
  display: grid;

  .clickable {
    cursor: pointer;
  }

  .table {
    justify-self: center;
    align-self: start;

    margin-bottom: 1rem;
    background-color: white;
    min-width: 60%;

    th,
    td {
      padding: 0.75rem;
      vertical-align: center;
      border-top: 1px solid $grey;
    }

    thead th {
      vertical-align: bottom;
      border-bottom: 2px solid $black;
      text-align: left;
    }

    tbody + tbody {
      border-top: 2px solid $grey;
    }

    .filter {
      text-align: right;
    }

  	div {
  		overflow: hidden;
  	}
  }

  .table-buttons {
    display: grid;
    grid-auto-flow: column dense;
    justify-content: end;
    justify-items: end;
    align-items: center;
    grid-column-gap: 5px;
    //.vue-js-switch {
    //  align-self: center;
    //  margin-right: 5px;
    //}
    .delete {
      background: $red;
    }
    .edit {
      background: $blue;
    }
  }
}
</style>
