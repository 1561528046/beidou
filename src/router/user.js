export default {
  path: "user",
  name: "user",
  meta: { name: "用户管理", icon: "iconfont icon-team", p: "4-1-4,4-2-4" },
  component: () => import("@/views/manage/user/index.vue"),
  children: [
    {
      path: "user_list",
      name: "user_list",
      meta: { name: "用户管理", icon: "iconfont icon-team", p: "4-1-4" },
      component: () => import("@/views/manage/user/user/index.vue")
    },
    {
      path: "product_update/:id",
      name: "product_update",
      meta: { name: "产品编辑", hidden: true },
      component: () =>
        import("@/views/manage/user/user/product/update-product.vue")
    },
    {
      path: "user_distribution/:id",
      name: "user_distribution",
      meta: { name: "用户分车", hidden: true },
      component: () => import("@/views/manage/user/user/binding.vue")
    },
    {
      path: "user_add/:id",
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
      meta: { name: "角色管理", icon: "iconfont icon-jiaose", p: "4-2-4" },
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
