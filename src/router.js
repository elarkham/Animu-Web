import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/home.vue'
import Login from './pages/login.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/seasonal',
      name: 'seasonal',
      component: () =>
      import(/* webpackChunkName: "seasonal" */
             './pages/seasonal3.vue')
    },
    {
      path: '/archive',
      name: 'archive',
      component: () =>
      import(/* webpackChunkName: "archive" */
             './pages/archive.vue')
    },
    {
      path: '/manage/user',
      name: 'manage-user',
      component: () =>
      import(/* webpackChunkName: "manage_user" */
             './pages/manage/user/index.vue')
    },
    {
      path: '/manage/user/:id',
      name: 'manage-user-id',
      component: () =>
      import(/* webpackChunkName: "manage_user_id" */
             './pages/manage/user/_id.vue')
    },
    {
      path: '/manage/anime',
      name: 'manage-anime',
      component: () =>
      import(/* webpackChunkName: "manage_anime" */
             './pages/manage/anime/index.vue')
    },
    {
      path: '/manage/anime/:id',
      name: 'manage-anime-id',
      component: () =>
      import(/* webpackChunkName: "manage_anime_id" */
             './pages/manage/anime/_id.vue')
    },
    {
      path: '/manage/franchise',
      name: 'manage-franchise',
      component: () =>
      import(/* webpackChunkName: "manage_franchise" */
              './pages/manage/franchise/index.vue')
    },
    {
      path: '/manage/franchise/:id',
      name: 'manage-franchise-id',
      component: () =>
      import(/* webpackChunkName: "manage_franchise_id" */
              './pages/manage/franchise/_id.vue')
    },
    {
      path: '/manage/episode',
      name: 'manage-episode',
      component: () =>
      import(/* webpackChunkName: "manage_episode" */
             './pages/manage/episode/index.vue')
    },
    {
      path: '/manage/episode/:id',
      name: 'manage-episode-id',
      component: () =>
      import(/* webpackChunkName: "manage_episode_id" */
             './pages/manage/episode/_id.vue')
    },
    {
      path: '/anime/:id',
      name: 'anime-id',
      component: () =>
      import(/* webpackChunkName: "anime" */
             './pages/anime/_id.vue')
    },
    {
      path: '/episode/:id',
      name: 'episode-id',
      component: () =>
      import(/* webpackChunkName: "episode" */
             './pages/episode/_id.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  if ( animu.token_invalid()
    && (to.name != 'login')
    && (from.name != 'login')) {

    console.log('Token Expired')
    animu.clear_token();

    next('login')
    return
  }
  next();
})

export default router;
