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
      component: () => import(/* webpackChunkName: "seasonal" */ './pages/seasonal.vue')
    },
    {
      path: '/archive',
      name: 'archive',
      component: () => import(/* webpackChunkName: "archive" */ './pages/archive.vue')
    },
    {
      path: '/manage',
      name: 'manage',
      component: () => import(/* webpackChunkName: "manage" */ './pages/manage/index.vue')
    },
    {
      path: '/manage/series/:id',
      name: 'manage-series-id',
      component: () => import(/* webpackChunkName: "manage_series" */ './pages/manage/series/_id.vue')
    },
    {
      path: '/series/:id',
      name: 'series-id',
      component: () => import(/* webpackChunkName: "series" */ './pages/series/_id.vue')
    },
    {
      path: '/episode/:id',
      name: 'episode-id',
      component: () => import(/* webpackChunkName: "episode" */ './pages/episode/_id.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if ((token == null) && (to.name != 'login') && (from.name != 'login')) {
    next('login');
    return;
  }
  next();
})

export default router;
