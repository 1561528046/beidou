import Vue from "vue";
import Router from "vue-router";
import user from "@/router/user.js";
import vehicle from "@/router/vehicle.js";
import device from "@/router/device.js";
Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/home.vue"),
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
      path: "/login",
      name: "login",
      meta: { name: "登陆", hidden: true },
      component: () => import("@/views/login.vue"),
      children: []
    },
    {
      path: "/manage",
      name: "manage",
      meta: { name: "运营管理" },
      component: () => import("./views/manage/index.vue"),
      children: [
        vehicle,
        user,
        device,
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
        },
        {
          path: "product",
          name: "product",
          meta: { name: "订单管理", icon: "iconfont icon-cluster" }
        }
      ]
    }
  ]
});
