export default {
  path: "user",
  name: "user",
  meta: { name: "用户管理", icon: "iconfont icon-team" },
  component: () => import("@/views/manage/user/index.vue"),
  children: [
    {
      path: "user_list",
      name: "user_list",
      meta: { name: "企业管理", icon: "iconfont icon-team" },
      component: () => import("@/views/manage/user/user/index.vue")
    },
    {
      path: "user_add",
      name: "user_add",
      meta: { name: "添加用户", hidden: true },
      component: () => import("@/views/manage/user/user/add.vue")
    },
    {
      path: "user_update/:user_id",
      name: "user_update",
      meta: { name: "编辑用户", hidden: true },
      component: () => import("@/views/manage/user/user/update.vue")
    },

    /**
     * 角色管理
     */
    {
      path: "role",
      name: "role",
      meta: { name: "角色管理", icon: "iconfont icon-jiaose" },
      component: () => import("@/views/manage/user/role/index.vue")
    },
    {
      path: "role_add",
      name: "role_add",
      meta: { name: "添加角色", hidden: true },
      component: () => import("@/views/manage/user/role/add.vue")
    },
    {
      path: "role_update/:role_id",
      name: "role_update",
      meta: { name: "编辑角色", hidden: true },
      component: () => import("@/views/manage/user/role/update.vue")
    }
  ]
};
