import Vue from "vue";
import Router from "vue-router";
import user from "@/router/user.js";
import vehicle from "@/router/vehicle.js";
import device from "@/router/device.js";
import product from "@/router/product.js";
import report from "@/router/report.js";
import store from "@/store";
import NProgress from "nprogress"; // progress bar
import { Message } from "element-ui";
import "nprogress/nprogress.css";
NProgress.configure({ showSpinner: false }); // 隐藏右上loading图标
Vue.use(Router);

var router = new Router({
  mode: "history",
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
        device,
        product,
        user,
        {
          path: "group_binding",
          name: "group_binding",
          meta: {
            name: "车队分组/分车管理",
            icon: "iconfont icon-orderedlist"
          },
          component: () => import("@/views/manage/group/binding.vue")
        },
        /**
         * 司机信息
         */
        {
          path: "driver",
          name: "driver",
          meta: { name: "司机信息管理", icon: "iconfont icon-driver" },
          component: () => import("@/views/manage/driver/index.vue")
        },
        {
          path: "driver_add",
          name: "driver_add",
          meta: { name: "添加司机", hidden: true },
          component: () => import("@/views/manage/driver/add.vue")
        },
        {
          path: "driver_update/:driver_card_id",
          name: "driver_update",
          meta: { name: "编辑司机", hidden: true },
          component: () => import("@/views/manage/driver/update.vue")
        },
        report,
        {
          path: "server-state",
          name: "server-state",
          meta: {
            name: "服务器状态",
            icon: "iconfont icon-fuwuqi1"
          }
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
    },
    { path: "*", redirect: "/404", meta: { hidden: true, fullscreen: true } }
  ]
});
router.beforeEach((to, from, next) => {
  NProgress.inc();
  if (store.getters.isLogin && localStorage.BEIDOU) {
    if (to.name == "login") {
      next({ path: "/" });
    }
    next();
  } else {
    if (to.name != "login") {
      next({ name: "login" });
      Message({
        showClose: true,
        message: "请重新登录！",
        type: "error"
      });
    }
    next();
  }
  NProgress.done();
});
router.afterEach(() => {
  NProgress.done(); // finish progress bar
});
export default router;
