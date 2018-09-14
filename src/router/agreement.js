export default {
  path: "agreement",
  name: "agreement",
  meta: { name: "设备管理", icon: "iconfont icon-boxplot-fill" },
  component: () => import("@/views/manage/device/index.vue"),
  children: [
    {
      path: "agreement-808",
      name: "agreement-808",
      meta: { name: "808", icon: "iconfont icon-xieyi" },
      component: () => import("@/views/manage/agreement/eight/index.vue")
    },
    {
      path: "agreement-809",
      name: "agreement-809",
      meta: { name: "809", icon: "iconfont icon-xieyi" },
      component: () => import("@/views/manage/agreement/nine/index.vue")
    }
  ]
};
