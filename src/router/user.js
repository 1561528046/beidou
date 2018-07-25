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
      props: { user_type: 1 },
      component: () => import("@/views/manage/user/user/index.vue")
    },
    {
      path: "user_add",
      name: "user_add",
      meta: { name: "添加用户", hidden: true },
      props: { user_type: 1 },
      component: () => import("@/views/manage/user/user/add.vue")
    }
  ]
};
