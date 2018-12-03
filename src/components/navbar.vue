<template>
  <section id="navbar">
    <div class="l-nav-left">
      <router-link to="/">
        <h1 class="logo">ANIMU</h1>
      </router-link>
      <nav class="navigate">
        <router-link to="/seasonal">
          <h3>Seasonal</h3>
        </router-link>
        <router-link to="/archive">
          <h3>Archive</h3>
        </router-link>
        <router-link to="/manage">
          <h3>Manage</h3>
        </router-link>
      </nav>
    </div>
    <div class="l-nav-right">
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
  </section>
</template>

<script>
export default {
  name: 'navbar'
}
</script>

<style lang="scss" scoped>
#navbar {
  // Aligning
  justify-content: space-between;
  align-items: center;
  padding: {
    left: 5%;
    right: 5%;
  }
  margin-bottom: 10px;

  // Sizing
  height: 65px;

  // Background
  background: $black;

  // Grid
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;

  // Children
  .l-nav-left {
    display: grid;
    grid-template-columns: 150px 320px;
    grid-column-gap: 20px;
    justify-self: start;
    align-items: center;
    height: 100%;
  }
  .l-nav-right {
    display: grid;
    justify-self: end;
    align-items: center;
    height: 100%;
  }
}

.navigate {
  display: grid;
  grid-template-columns: auto auto auto;

  height: 100%;
  width: 100%;

  > a {
    color: white;

    display: flex;
    align-items: center;
    justify-content: center;

    &:hover{
      background: lighten($black, 10%);
    }

    > h3 {
      font: {
        size: 1.0em;
        family: "Rubik", sans-serif;
       weight: 400;
      }
      color: $grey;
    }
  }
}

.logo {
  color: #fff;
  text-transform: uppercase;

  font: {
    family: 'Nunito', sans-serif;
    transform: uppercase;
    size: 2.7em;
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
