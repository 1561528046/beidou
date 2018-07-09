import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/Home.vue"),
      meta: { name: "首页" }
    },
    {
      path: "/monitor",
      name: "monitor",
      component: () => import("./views/monitor/index.vue"),
      meta: { name: "地图监控" },
      children: [
        {
          path: "map",
          name: "map",
          meta: { name: "地图" }
          //component:()=>import('./views/Map.vue')
        }
      ]
    },
    {
      path: "/manage",
      name: "manage",
      meta: { name: "运营管理" },
      component: () => import("./views/manage/index.vue"),
      children: [
        {
          path: "/vehicle",
          name: "vehicle",
          meta: { name: "车辆管理" },
          component: () => import("./views/manage/vehicle/index.vue"),
          children: [
            {
              path: "newed",
              name: "newed",
              meta: { name: "新增车辆管理" },
              component: () => import("./views/manage/vehicle/newed/index.vue")
            },
            {
              path: "add",
              name: "add",
              meta: { name: "新增车辆管理-添加", hidden: true },
              component: () => import("./views/manage/vehicle/newed/add.vue")
            }
          ]
        },
        {
          path: "terminal",
          name: "terminal",
          meta: { name: "终端管理" }
        },
        {
          path: "user",
          name: "user",
          meta: { name: "用户管理" }
        },
        {
          path: "vehicle-setting",
          name: "vehicle-setting",
          meta: { name: "车辆参数设置" }
        },
        {
          path: "report",
          name: "report",
          meta: { name: "报表" }
        },
        {
          path: "server-state",
          name: "server-state",
          meta: { name: "服务器状态" }
        },
        {
          path: "product",
          name: "product",
          meta: { name: "订单管理" }
        }
      ]
    }
  ]
});
