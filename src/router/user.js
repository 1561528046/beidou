export default {
  path: "user",
  name: "user",
  meta: { name: "用户管理", icon: "iconfont icon-team" },
  component: () => import("@/views/manage/user/index.vue"),
  children: [
    {
      path: "user_company",
      name: "user_company",
      meta: { name: "公司用户管理", icon: "iconfont icon-team" },
      component: () => import("@/views/manage/user/index.vue")
    }
  ]
};
