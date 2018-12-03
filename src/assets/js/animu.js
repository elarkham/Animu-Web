"use strict";

const animu = (function() {

  const handle_errors = function(response) {
    if(!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  const request = function(url, opts, success, failure) {
    const token = localStorage.getItem("token")
    opts.headers =
      { 'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': token
      }

    return fetch(url, opts)
      .then(handle_errors)
      .then((resp) => resp.json())
      .then(success)
      .catch(failure)
  };

  const sleep = function (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  const scan = function() {

    // RPC
    const recache = {
      method: "POST",
      body: JSON.stringify({
        "augur": {
          "exec": "rebuild_cache"
        }
      })
    };

    const scan = {
      method: "POST",
      body: JSON.stringify({
        "augur": {
          "exec": "scan"
        }
      })
    };

    // WIP, not pretty
    request("/api/v1/rpc", recache, {}, {});
    sleep(3000).then(() => {
      request("/api/v1/rpc", scan, {}, {});
    });
  };

  const post = function(url, data, success, failure) {
    const opts = {
      method: "POST",
      body: JSON.stringify(data),
    };

    return request(url, opts, success, failure);
  };

  const patch = function(url, data, success, failure) {
    const opts = {
      method: "PATCH",
      body: JSON.stringify(data),
    };

    return request(url, opts, success, failure);
  };

  const serializeParams = function(obj) {
    const encURI = encodeURIComponent;
    const params = Object.keys(obj);
    const qs =
      params
      .map((key) => encURI(key) + "=" + encURI(obj[key]))
      .join("&");

    return (params.length && "?" + qs) || "";
  }

  const delete_ = function(url, params, callback) {
    const opts = { method: "DELETE" };
    url  = url + serializeParams(params);

    return request(url, opts, {}, callback);
  };

  const get = function(url, params, callback) {
    const opts = { method: "GET" };
    url  = url + serializeParams(params);

    const failure = function(error) {
      console.log("Animu Request Failed: " + error.message);
    }
    return request(url, opts, callback, failure);
  };

  const get_series = function(id, callback) {
    return get("/api/v1/series/" + id, {}, callback);
  };

  const all_series = function(query, callback) {
    return get("/api/v1/series", query, callback);
  };

  const get_episode = function(id, callback) {
    return get("/api/v1/episodes/" + id, {}, callback);
  };

  const test = function() {
    console.log("Animu Module Loaded");
  };

  return {
    sleep: sleep,
    scan:  scan,
    post:  post,
    patch: patch,
    delete: delete_,
    get:   get,
    get_series:  get_series,
    all_series:  all_series,
    get_episode: get_episode,
    test: test,
  }
})();

export default animu;
