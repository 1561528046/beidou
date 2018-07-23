import Vue from "vue";
import Router from "vue-router";
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
      path: "/manage",
      name: "manage",
      meta: { name: "运营管理" },
      component: () => import("./views/manage/index.vue"),
      children: [
        {
          path: "/vehicle",
          name: "vehicle",
          meta: { name: "车辆管理", icon: "iconfont icon-car-fill" },
          component: () => import("./views/manage/vehicle/index.vue"),
          children: [
            {
              path: "new",
              name: "new",
              meta: { name: "新增车辆管理" },
              component: () => import("./views/manage/vehicle/new/index.vue")
            },
            {
              path: "new/add",
              name: "new-add",
              meta: { name: "新增车辆管理-添加", hidden: true },
              component: () => import("./views/manage/vehicle/new/add.vue")
            },
            {
              path: "position",
              name: "position",
              meta: { name: "新增车辆管理" },
              component: () => import("./views/manage/vehicle/new/index.vue")
            }
          ]
        },
        {
          path: "device",
          name: "device",
          meta: { name: "终端管理", icon: "iconfont icon-boxplot-fill" },
          component: () => import("./views/manage/device/index.vue"),
          children: [
            {
              path: "device",
              name: "device-device",
              meta: { name: "设备管理", icon: "iconfont icon-boxplot-fill" },
              component: () => import("./views/manage/device/device/index.vue")
            }
          ]
        },
        {
          path: "user",
          name: "user",
          meta: { name: "用户管理", icon: "iconfont icon-team" }
        },
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
