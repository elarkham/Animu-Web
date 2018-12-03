<template>
  <section id="login">
    <form id="login-form" @keyup.enter="submit" @submit="submit">
      <h2>Login</h2>

      <section id="login-input">
        <label for="username"> Username </label>
        <input name="username"
               v-model="username"
               id="username"
               type="text">

        <label for="password"> Password </label>
        <input name="password"
               v-model="password"
               id="password"
               type="password">

      </section>

      <section id="login-buttons">
        <button disabled>Register</button>
        <button>Submit</button>
      </section>

      <section id="login-response" :class="{enabled: msg}">
        <p>{{msg}}</p>
      </section>
    </form>
  </section>
</template>

<script>
import router from '@/router.js'

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
    submit: function (e){
      const login = this;

      // Disable Default Action
      e.preventDefault();

      // Gather Form Data
      const form_data = {
        "session": {
          "username": login.username,
          "password": login.password,
        }
      };

      // Submit Data
      const opts = {
        method: "POST",
        body: JSON.stringify(form_data),
        headers:
          { 'Accept': 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
          },
      };
      console.log(opts)

      fetch("/api/v1/session", opts)
        .then(function(resp) {
          console.log(resp)
          if(resp.ok) {
            return resp.json();
          } else {
            login.msg = "Incorrect Username or Password";
          }
        })
        .then(function(json) {
          console.log(json)
          let token = json.jwt;
          localStorage.setItem('token', token);
          router.push({name: 'home'});
        });
    }
  }
}
</script>

<style lang="scss">
#login {
  height: 100%;
  display: grid;
  justify-items: center;
  align-items: center;
  grid-row: span 2;
}

#login-form {
  background: $black;
  color: white;
  width: 400px;
  height: 300px;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr 0.8fr;
  align-items: center;

  h2 {
    margin-top: 10%;
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

#login-response {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: $grey;
  p {
    text-align: center;
    margin: 0;
  }
}

#login-response.enabled {
  background: $red;
  color: white;
}

</style>
