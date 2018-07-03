import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: ()=>import('./views/Home.vue')
    },
    {
          path:'/monitor',
          name:"地图监控",
          component: ()=>import('./views/Monitor.vue'),
          children:[
            {
              path:'map',
              name:"地图",
              //component:()=>import('./views/Map.vue')
            }
          ]
    },
    {
      path: '/about',
      name: 'about',
      component:  ()=>import('./views/About.vue')
    }
  ]
})
