<template>
  <section id="navbar">
    <div class="l-nav-left">
      <router-link to="/">
        <h1 class="logo">ANIMU</h1>
      </router-link>
      <!--
      <div class="filter">
        <select name="Sort By" class="filter-sort">
          <option value="canon_title">Title</option>
          <option value="inserted_at">Date Added</option>
        </select>
      </div>
      <input type="search" class="filter-bar"></input>
      -->
    </div>

    <div class="l-nav-right">
      <nav class="navigate">
        <router-link class="nav" to="/seasonal">
          <h3>Seasonal</h3>
        </router-link>
        <router-link class="nav" to="/archive">
          <h3>Archive</h3>
        </router-link>

        <popper
          trigger="click"
          :visible-arrow="false"
          :options="dropdown_options">
          <div class="dropdown">
            <router-link class="nav" to="/manage/anime">
              <h3>Anime</h3>
            </router-link>
            <router-link class="nav" to="/manage/franchise">
              <h3>Franchises</h3>
            </router-link>
            <router-link class="nav" to="/manage/episode">
              <h3>Episodes</h3>
            </router-link>
            <router-link class="nav" to="/manage/user">
              <h3>Users</h3>
            </router-link>
          </div>

          <div class="nav" slot="reference">
            <h3>Manage</h3>
          </div>
        </popper>

      </nav>
    </div>
  </section>
</template>

<script>
import Popper from 'vue-popperjs';

export default {
  name: 'navbar',
  components: {
    'popper': Popper
  },
  data: () => ({
		dropdown_options: {
			placement: 'bottom',
      modifiers: {
				offset: { offset: '0,5px' },
			 	computeStyle: {
			 			gpuAcceleration: false
			 	},
			},
  	}
	})
}
</script>

<style lang="scss" scoped>
#navbar {
  // Grid
  display: grid;
  grid-template-columns: 150px 1fr;
  align-items: center;

  // Layout
  justify-content: space-between;
  padding: {
    left: 5%;
    right: 5%;
  }
  margin-bottom: 10px;
  height: 65px;

  // Color
  background: $black;
  user-select: none;
  box-shadow: 0 6px 10px -4px rgba(0,0,0,0.5);

  // Children
  .l-nav-right {
    display: grid;
    align-items: center;
    justify-items: end;
    justify-self: end;

    height: 100%;
    width: 100%;
  }
  .l-nav-left {
    display: grid;
    grid-template-columns: 150px;
    justify-self: start;
    align-items: center;
    height: 100%;
  }
}

.navigate {
  display: grid;
  grid-template-columns: 100px 100px 100px;

  height: 100%;

  .dropdown {
    display: grid;
    align-items: center;
    justify-content: stretch;
    width: 120px;

    // Should pretty much always be on top
    z-index: 5;

    border-radius: 12px;
    background-clip: padding-box;
    box-shadow: 0 6px 10px -4px rgba(0,0,0,1.5);
    .nav {
      justify-content: center;
      background: $black;
      padding: 10px;
      //box-shadow: 0 6px 0 -4px rgba(0,0,0,1.5);
      &:nth-child(1) {
        border-radius: 12px 12px 0 0;
      }

      &:nth-last-child(1) {
        border-radius: 0 0 12px 12px;
        //box-shadow: 0 6px 10px -4px rgba(0,0,0,1.5);
      }
    }
  }

  .nav {
    color: white;

    display: flex;
    align-items: center;
    justify-content: center;

    font: {
      size: 1.0rem;
      family: "Rubik", sans-serif;
     weight: 400;
    }
    color: $grey;
    height: 100%;

    h3 {
      font: inherit;
    }
    &:hover{
      background: lighten($black, 10%);
      cursor: pointer;
    }

  }
}

.logo {
  color: #fff;
  text-transform: uppercase;

  font: {
    family: 'Nunito', sans-serif;
    transform: uppercase;
    size: 2.7rem;
    weight: 900;
  }
}

//.logo {
//  color: #fff;
//  letter-spacing: -1px;
//  font-size: 3.5em;
//  text-align: center;
//  text-transform: uppercase;
//  font-family: 'Righteous', Helvetica,Arial,sans-serif;
//}

</style>
