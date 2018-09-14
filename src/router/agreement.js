export default {
  path: "agreement",
  name: "agreement",
  meta: { name: "平台转发管理", icon: "iconfont icon-xieyi" },
  component: () => import("@/views/manage/agreement/index.vue"),
  children: [
    {
      path: "agreement-808",
      name: "agreement-808",
      meta: { name: "808", icon: "iconfont icon-xieyi" },
      component: () => import("@/views/manage/agreement/eight/index.vue")
    },
    {
      path: "agreement-808vehicle",
      name: "agreement-808vehicle",
      meta: { name: "808分车", hidden: true },
      component: () => import("@/views/manage/agreement/eight/binding.vue")
    },
    {
      path: "agreement-809",
      name: "agreement-809",
      meta: { name: "809", icon: "iconfont icon-xieyi" },
      component: () => import("@/views/manage/agreement/nine/index.vue")
    },
    {
      path: "agreement-809vehicle",
      name: "agreement-809vehicle",
      meta: { name: "809分车", hidden: true },
      component: () => import("@/views/manage/agreement/nine/binding.vue")
    }
  ]
};
