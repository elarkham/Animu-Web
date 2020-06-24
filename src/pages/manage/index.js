import Velocity from 'velocity-animate'
import _ from 'lodash'

export default {
  computed: {
    filtered() {
      return this.data.filter((item) => {
        const search = this.filter.search.toLowerCase();
        const value  = item[this.filter.field].toString().toLowerCase();
        return value.indexOf(search) > -1
      })
    },
    paginated(){
      const p = this.paginate
      const page = p.page - 1;
      const start = page * p.page_size;
      const end   = (page + 1) * p.page_size;
      return this.filtered.slice(start, end)
   }
  },
	methods: {
    _sort() {
      this.data = _.sortBy(this.data, [this.sort.field, "id"]);
      if (this.sort.order == "desc") {
        this.data.reverse();
      }
    },
    sortBy(field) {
      this.data = _.sortBy(this.data, [field, "id"]);
      if (this.sort.order == "asc" && this.sort.field == field) {
        this.sort.order = "desc";
        this.data = this.data.reverse();
      } else {
        this.sort.order = "asc";
      }
      this.sort.field = field;
    },
		beforeEnter(el) {
			let divs = el.querySelectorAll("div");
			for (let i = 0; i < divs.length; i++) {
				divs[i].style.maxHeight = "0px";
			}
		},
		enter(el, done) {
			let divs = el.querySelectorAll("div");
			Velocity(
				divs,
				{ maxHeight: "40px"},
				{ duration: 540, complete: done }
			);
		},
		leave(el, done) {
			let divs = el.querySelectorAll("div");
			Velocity(
				divs,
				{ maxHeight: "0px"},
				{ duration: 540, complete: done }
			);
		},
  },
}
