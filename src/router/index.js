import Vue from "vue";
import Router from "vue-router";
import user from "@/router/user.js";
import vehicle from "@/router/vehicle.js";
import device from "@/router/device.js";
import product from "@/router/product.js";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/views/home.vue"),
      meta: { name: "首页" }
    },
    {
      path: "/monitor",
      name: "monitor",
      component: () => import("@/views/monitor/index.vue"),
      meta: { name: "地图监控" },
      children: [
        {
          path: "map",
          name: "map",
          meta: { name: "地图" }
          //component:()=>import('@/views/Map.vue')
        }
      ]
    },
    {
      path: "/manage",
      name: "manage",
      meta: { name: "运营管理" },
      component: () => import("@/views/manage/index.vue"),
      children: [
        vehicle,
        user,
        device,
        product,
        {
          path: "vehicle-setting",
          name: "vehicle-setting",
          meta: { name: "车辆参数设置", icon: "iconfont icon-setting-fill" }
        },
        {
          path: "report",
          name: "report",
          meta: { name: "报表", icon: "iconfont icon-fund-fill" }
        },
        {
          path: "server-state",
          name: "server-state",
          meta: { name: "服务器状态", icon: "iconfont icon-sever-fill" }
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      meta: { name: "登陆", hidden: true, fullscreen: true },
      component: () => import("@/views/login.vue")
    },
    {
      path: "/404",
      meta: { hidden: true },
      component: () => import("@/views/404.vue")
    }
    // { path: "*", redirect: "/404", meta: { hidden: true, fullscreen: true } }
  ]
});
