import { createRouter, createWebHistory } from 'vue-router'
import MainHomePageView from '../views/HomeViews/MainHomePageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainHomePageView

    },
  ]
})

export default router
