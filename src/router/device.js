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
      path: "add",
      name: "device-add",
      meta: { name: "设备管理-添加", hidden: true },
      component: () => import("@/views/manage/device/device/add.vue")
    },
    {
      path: "update/:device_id",
      name: "device-update",
      meta: { name: "设备管理-编辑", hidden: true },
      component: () => import("@/views/manage/device/device/update.vue")
    },
    {
      path: "repair",
      name: "device-repair",
      meta: {
        name: "维修设备管理",
        icon: "iconfont icon-wrench-fill"
      },
      component: () => import("@/views/manage/device/repair/index.vue")
    },
    {
      path: "repair-device-add",
      name: "repair-add",
      meta: { name: "维修设备管理-添加", hidden: true },
      component: () => import("@/views/manage/device/repair/add.vue")
    },
    {
      path: "repair-device-update",
      name: "repair-update",
      meta: { name: "维修设备管理-编辑", hidden: true },
      component: () => import("@/views/manage/device/repair/update.vue")
    },
    {
      path: "sim",
      name: "sim",
      meta: {
        name: "SIM卡管理",
        icon: "iconfont icon-sim"
      },
      component: () => import("@/views/manage/device/sim/index.vue")
    },
    {
      path: "sim-add",
      name: "sim-add",
      meta: { name: "SIM卡管理-添加", hidden: true },
      component: () => import("@/views/manage/device/sim/add.vue")
    },
    {
      path: "sim-update/:sim_no",
      name: "sim-update",
      meta: { name: "SIM卡管理-编辑", hidden: true },
      component: () => import("@/views/manage/device/sim/update.vue")
    },
    {
      path: "company",
      name: "device-company",
      meta: {
        name: "终端厂商管理",
        icon: "iconfont icon-company"
      },
      component: () => import("@/views/manage/device/company/index.vue")
    },
    {
      path: "company-device-add",
      name: "company-add",
      meta: { name: "终端厂商管理-添加", hidden: true },
      component: () => import("@/views/manage/device/company/add.vue")
    },
    {
      path: "company-device-update/:company_id",
      name: "company-update",
      meta: { name: "终端厂商管理-编辑", hidden: true },
      component: () => import("@/views/manage/device/company/update.vue")
    }
  ]
};
