import Vue from "vue";
import Router from "vue-router";
import user from "@/router/user.js";
import vehicle from "@/router/vehicle.js";
import device from "@/router/device.js";
import product from "@/router/product.js";
import report from "@/router/report.js";
import agreement from "@/router/agreement.js";
import store from "@/store";
import NProgress from "nprogress"; // progress bar
import { Message } from "element-ui";
import "nprogress/nprogress.css";
NProgress.configure({
  showSpinner: false
}); // 隐藏右上loading图标
Vue.use(Router);

var routers = [
  // {
  //   path: "/",
  //   name: "home",
  //   component: () => import("@/views/home.vue"),
  //   meta: { name: "首页" }
  // },
  {
    path: "/",
    name: "home",
    redirect: "/manage",
    component: () => import("@/views/home.vue"),
    meta: {
      name: "首页",
      hidden: true
    }
  },
  {
    path: "fence-platform",
    name: "fence-platform",
    meta: {
      name: "平台",
      hidden: true
    },
    component: () => import("@/views/monitor/components/area-platform.vue")
  },
  {
    path: "fence-vehicle",
    name: "fence-vehicle",
    meta: {
      name: "车机",
      hidden: true
    },
    component: () => import("@/views/monitor/components/area-machine.vue")
  },
  {
    path: "/monitor",
    name: "monitor",
    component: () => import("@/views/monitor/index.vue"),
    meta: {
      name: "地图监控"
    },
    children: [
      {
        path: "map",
        name: "map",
        meta: {
          name: "地图"
        }
        //component:()=>import('@/views/Map.vue')
      }
    ]
  },
  {
    path: "/manage",
    name: "manage",
    meta: {
      name: "运营管理"
    },
    component: () => import("@/views/manage/index.vue"),
    children: [
      vehicle,
      device,
      product,
      user,
      agreement,

      {
        path: "group_binding",
        name: "group_binding",
        meta: {
          p: "5-1-4,5-1-5",
          name: "车队分组/分车管理",
          icon: "iconfont icon-orderedlist"
        },
        component: () => import("@/views/manage/group/binding.vue")
      },
      {
        path: "server-state",
        name: "server-state",
        meta: {
          name: "服务器状态",
          icon: "iconfont icon-fuwuqi1"
        },
        component: () => import("@/views/manage/server/index.vue")
      },
      /**
       * 司机信息
       */
      {
        path: "driver",
        name: "driver",
        meta: {
          p: "6-1-4",
          name: "司机信息管理",
          icon: "iconfont icon-driver"
        },
        component: () => import("@/views/manage/driver/index.vue")
      },
      {
        path: "driver_add",
        name: "driver_add",
        meta: {
          name: "添加司机",
          hidden: true
        },
        component: () => import("@/views/manage/driver/add.vue")
      },
      {
        path: "driver_update/:driver_card_id",
        name: "driver_update",
        meta: {
          name: "编辑司机",
          hidden: true
        },
        component: () => import("@/views/manage/driver/update.vue")
      },
      report,
      {
        path: "warn",
        name: "warn",
        meta: {
          // p: "8-1-1",
          p: "7-1-1,7-1-2,7-1-3,7-1-4,7-1-5,7-1-6,7-1-7,7-1-8,7-1-9,7-1-10",
          name: "报警信息管理",
          icon: "iconfont icon-alert-fill"
        },
        component: () => import("@/views/manage/warn/index.vue")
      }
      // {
      //   path: "log",
      //   name: "log",
      //   meta: {
      //     name: "日志",
      //     icon: "iconfont icon-rizhi"
      //   },
      //   component: () => import("@/views/manage/log/index.vue")
      // },
      // {
      //   path: "analyze",
      //   name: "analyze",
      //   meta: {
      //     name: "视频图像分析",
      //     icon: "iconfont icon-weibiaoti1"
      //   },
      //   component: () => import("@/views/manage/analyze/index.vue"),
      //   children: [
      //     {
      //       path: "traffic",
      //       name: "traffic",
      //       meta: {
      //         name: "客流量统计",
      //         icon: "iconfont icon-tongji1"
      //       },
      //       component: () => import("@/views/manage/analyze/traffic/index.vue")
      //     },
      //     {
      //       path: "behavior",
      //       name: "behavior",
      //       meta: {
      //         name: "驾驶行为分析",
      //         icon: "iconfont icon-xingweifenxi"
      //       },
      //       component: () =>
      //         import("@/views/manage/analyze/behavior/index.vue"),
      //       children: [
      //         {
      //           path: "behavior_statistical",
      //           name: "behavior_statistical",
      //           meta: {
      //             name: "统计",
      //             icon: "iconfont icon-tongji1"
      //           },
      //           component: () =>
      //             import("@/views/manage/analyze/behavior/statistical/index.vue")
      //         },
      //         {
      //           path: "behavior_query",
      //           name: "behavior_query",
      //           meta: {
      //             name: "查询",
      //             icon: "el-icon-search"
      //           },
      //           component: () =>
      //             import("@/views/manage/analyze/behavior/query/index.vue")
      //         }
      //       ]
      //     }
      //   ]
      // },
      // {
      //   path: "resources",
      //   name: "resources",
      //   meta: {
      //     name: "音视频资源目录",
      //     icon: "iconfont icon-ziyuanmulu"
      //   },
      //   component: () => import("@/views/manage/resources/index.vue")
      // }
    ]
  },
  {
    path: "/login",
    name: "login",
    meta: {
      name: "登陆",
      hidden: true,
      fullscreen: true
    },
    component: () => import("@/views/login.vue")
  },
  {
    path: "/national",
    name: "national",
    meta: {
      name: "全国平台",
      hidden: true,
      fullscreen: true
    },
    component: () => import("@/views/validation.vue")
  },
  {
    path: "/404",
    meta: {
      hidden: true
    },
    component: () => import("@/views/404.vue")
  },
  {
    path: "*",
    redirect: "/404",
    meta: {
      hidden: true,
      fullscreen: true
    }
  }
];
permissions(routers);

function permissions(routers) {
  var userRights = store.state.user.rights;
  routers.map(router => {
    if (router.children) {
      permissions(router.children);
    }
    if (store.state.user.user_id == 1) {
      //管理员都为true
      router.meta.hasRights = true;
      return false;
    }
    var routerRights = router.meta.p;
    if (routerRights) {
      routerRights = routerRights.split(",");
    } else {
      router.meta.hasRights = true;
      return false;
    }
    router.meta.hasRights = false;
    routerRights.map(rights => {
      if (userRights.indexOf(rights) != -1) {
        router.meta.hasRights = true;
      }
    });
  });
}

var router = new Router({
  // mode: "history",
  routes: routers
});
router.beforeEach((to, from, next) => {
  NProgress.inc();
  if (store.getters.isLogin && localStorage.BEIDOU) {
    if (to.name == "login") {
      next({
        path: "/"
      });
    }
    next();
  } else {
    if (to.name != "login") {
      next({
        name: "login"
      });
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
