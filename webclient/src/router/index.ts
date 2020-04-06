import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Config from '../views/Config.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Config',
    component: Config,
  },
];

const router = new VueRouter({
  routes,
  mode: 'history',
});

export default router;
