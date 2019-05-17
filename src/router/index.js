import Vue from 'vue'
import Router from 'vue-router'

import login from '@/views/demo.vue'

Vue.use(Router)
let router = new Router({
    routes: [
      {
        path: '/',
        type: 'login',
        component: login
      }]
    });

    export default router