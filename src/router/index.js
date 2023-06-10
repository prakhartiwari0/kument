import { createRouter, createWebHistory } from 'vue-router'

import VideoPageView from '../views/OtherViews/VideoPageView.vue'

import MainHomePageView from '../views/HomeViews/MainHomePageView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainHomePageView

    },
    {
      path: '/:videoID',
      component: VideoPageView,
      props: true,
    },
  ]
})

export default router
