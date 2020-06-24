<template>
  <article id="login">
    <section id="login-wrapper">
      <form id="login-form" @keyup.enter="submit" @submit="submit">
        <h2>Login</h2>

        <section id="login-input">
          <label for="username"> Username </label>
          <input name="username"
                 v-model="username"
                 id="username"
                 size="mini"
                 type="text">
          </input>

          <label for="password"> Password </label>
          <input name="password"
                 v-model="password"
                 id="password"
                 size="mini"
                 type="password">
          </input>

        </section>

        <section id="login-buttons">
          <button class="mu-button" disabled>Register</button>
          <button class="mu-button">Submit</button>
        </section>


      </form>
      <el-alert
        v-show="msg"
        type="error"
        class="response"
        :closable="false"
        :title="msg"
        show-icon>
      </el-alert>
    </section>
  </article>
</template>

<script>
export default {
  name: 'login',
  data: function () {
    return {
      username: "",
      password: "",
      msg: null,
    }
  },
  methods: {
    submit(e) {
      const login = this;

      // Disable Default Action
      e.preventDefault();

      animu
        .login(login.username, login.password)
        .then((resp) => {
          console.log(resp)
          router.push({name: 'home'});
        })
        .catch((error) => {
          console.log(error)
          login.msg = "Incorrect Username or Password";
        })
    }
  }
}
</script>

<style lang="scss">
#login {
  height: 100%;
  display: grid;
  place-content: center;
  place-items: center;
  grid-row: span 2;
}

#login-wrapper {
  height: 300px;
}

#login-form {
  background: $black;
  color: white;
  width: 400px;
  height: 230px;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  align-items: center;
  box-shadow: 0 6px 10px -4px rgba(0,0,0,0.15);
  border-radius: 12px;

  h2 {
    margin-top: 1rem;
    margin-left: 50px;
  }

}

#login-input {
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  grid-template-rows:    0.5fr 1fr;
  grid-column-gap: 10px;
  grid-row-gap: 10px;
  label {
    justify-self: end;
    text-align: right;
  }
  input {
    justify-self: start;
    width: 200px;
    color: black;
  }
}

#login-buttons {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-around;

  button {
    background: $grey;
    color: black;
    width: 100px;
  }

  button:hover {
    background: darken($black, 5%);
    color: white;
  }
}

.response {
  margin-top: 10px !important;
  width: 400px;
  height: 50px;
  background: $red !important;
  color: white !important;
  .el-alert__description {
    color: white !important;
  }
}


</style>
