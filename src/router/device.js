export default {
  path: "device",
  name: "device",
  meta: { name: "终端管理", icon: "iconfont icon-boxplot-fill" },
  component: () => import("@/views/manage/device/index.vue"),
  children: [
    {
      path: "device",
      name: "device-device",
      meta: { name: "设备管理", icon: "iconfont icon-boxplot-fill" },
      component: () => import("@/views/manage/device/device/index.vue")
    },
    {
      path: "device/Add",
      name: "device-add",
      meta: { name: "设备管理-添加", hidden: true },
      component: () => import("@/views/manage/device/device/add.vue")
    },
    {
      path: "device/Update",
      name: "device-update",
      meta: { name: "设备管理-编辑", hidden: true },
      component: () => import("@/views/manage/device/device/update.vue")
    },
    {
      path: "device",
      name: "device-repair",
      meta: {
        name: "维修设备管理",
        icon: "iconfont icon-wrench-fill"
      },
      component: () => import("@/views/manage/device/repair/index.vue")
    },
    {
      path: "device",
      name: "device-sim",
      meta: {
        name: "SIM卡管理",
        icon: "iconfont icon-boxplot-fill"
      },
      component: () => import("@/views/manage/device/sim/index.vue")
    },
    {
      path: "device",
      name: "device-company",
      meta: {
        name: "终端厂商管理",
        icon: "iconfont icon-boxplot-fill"
      },
      component: () => import("@/views/manage/device/company/index.vue")
    }
  ]
};
