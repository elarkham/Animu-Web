import util from './utility'
import {Socket, Channel} from '@/vendor/phoenix'

import jwt_decode from 'jwt-decode'
import axios from 'axios'
import qs from 'qs'

// Auth Token
const token = localStorage.getItem("token")

const base = "http://animu.org"

// HTTP Client
function getClientInstance() {
  const config = {}
  config.headers =
    { 'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': token
    }

  config.paramsSerializer = (params) => {
    return qs.stringify(params, {arrayFormat: 'brackets'})
  }

  config.transformRequest = [(data, headers) => {
    if (headers['Content-Type'] == 'application/json; charset=UTF-8') {
      return JSON.stringify(data);
    }
    if (headers['Content-Type'] == 'multipart/form-data') {
      return util.jsonToFormData(data);
    }
  }]

  return axios.create(config)
}

const _http = getClientInstance();

_http.interceptors.response.use((resp) => {
  return resp;
}, (error) => {
  let status = error.response.status;
  if((status == 403) || (status == 401)) {
    window.router.push("/login")
  }
  return Promise.reject(error);
})

// Socket Client
function init_socket(token) {
  return new Socket(base + '/api/socket', {params: {token: token}})
}

export default {

  // Token
  token_invalid() {
    const now = new Date();
    const exp = new Date(Number(localStorage.getItem('exp')));
    if (exp && (exp < now)) {
      return true;
    }
    return false;
  },

  clear_token() {
    // Websocket
    //this.socket.disconnect()

    // HTTP
    this.http.defaults.headers.Authorization = null;

    //Storage
    localStorage.removeItem('token');
    localStorage.removeItem('sub');
    localStorage.removeItem('exp');
    localStorage.removeItem('iat');
  },

  login(username, password) {
    const session = {
      "session": {
        "username": username,
        "password": password,
      }
    }
    return _http
      .post(base + "/api/session", session)
      .then((resp) => {
        let token = resp.data.jwt
        console.log(token)

        // Socket
        //if (this.socket.isConnected()) {
        //  this.socket.disconnect();
        //}
        //this.socket = init_socket(token)
        //this.socket.connect();

        // Http
        _http.defaults.headers.Authorization = token;

        // Storage
        let jwt = jwt_decode(resp.data.jwt);
        localStorage.setItem('token', token);
        localStorage.setItem('sub', jwt.sub)
        localStorage.setItem('exp', jwt.exp * 1000)
        localStorage.setItem('iat', jwt.iat * 1000)

        return resp
      });
  },

  // Socket
  //socket: init_socket(token),

  join(topic) {
    let channel = this.socket.channel(topic);
    channel.on("msg", msg => console.log("Got message", msg) )

    channel.join()
      .receive("ok", ({messages}) => console.log("catching up", messages) )
      .receive("error", ({reason}) => console.log("failed join", reason) )
      .receive("timeout", () => console.log("Networking issue. Still waiting..."))

    return channel;
  },

  join_anime() {
    let channel = this.socket.channel("anime:");
    channel.join()

    return channel;
  },

  // Http
  http: _http,
  get: _http.get,
  post: _http.post,
  patch: _http.patch,
  delete: _http.delete,


  get_user(id, config = {}) {
    return this.http.get(base + "/api/media/users/" + id, config);
  },

  get_anime(id, config = {}) {
    return this.http.get(base + "/api/media/anime/" + id, config);
  },

  get_season(id, config = {}) {
    return this.http.get(base + "/api/media/seasons/" + id, config);
  },

  get_genres(id, config = {}) {
    return this.http.get(base + "/api/media/genres/" + id, config);
  },

  get_franchise(id, config = {}) {
    return this.http.get(base + "/api/media/franchises/" + id, config);
  },

  get_episode(id, config = {}) {
    return this.http.get(base + "/api/media/episodes/" + id, config);
  },

  all_users(config = {}) {
    return this.http.get(base + "/api/media/users", config);
  },

  all_anime(config = {}) {
    return this.http.get(base + "/api/media/anime", config);
  },

  all_franchises(config = {}) {
    return this.http.get(base + "/api/media/franchises", config);
  },

  all_episodes(config = {}) {
    return this.http.get(base + "/api/media/episodes", config);
  },

  all_seasons(config = {}) {
    return this.http.get(base + "/api/media/seasons", config)
  },

  all_genres(config = {}) {
    return this.http.get(base + "/api/media/genres/", config);
  },
}
