export default {
  path: "product",
  name: "product",
  meta: { name: "订单管理", icon: "iconfont icon-order" },
  component: () => import("@/views/manage/product/index.vue"),
  children: [
    {
      path: "product",
      name: "product-product",
      meta: { name: "产品管理", icon: "iconfont icon-boxplot-fill" },
      component: () => import("@/views/manage/product/product/index.vue")
    },
    {
      path: "product-add",
      name: "product-add",
      meta: { name: "产品管理-添加", hidden: true },
      component: () => import("@/views/manage/product/product/add.vue")
    },
    {
      path: "product-update",
      name: "product-update",
      meta: { name: "产品管理-编辑", hidden: true },
      component: () => import("@/views/manage/product/product/update.vue")
    },
    {
      path: "user-select",
      name: "user-select",
      meta: { name: "用户查询", icon: "iconfont icon-boxplot-fill" },
      component: () => import("@/views/manage/product/user/index.vue")
    },
    {
      path: "recharge",
      name: "recharge",
      meta: { name: "充值管理", icon: "iconfont icon-chongzhi1" },
      component: () => import("@/views/manage/product/recharge/index.vue")
    },
    {
      path: "order",
      name: "order",
      meta: { name: "订单管理", icon: "iconfont icon-order" },
      component: () => import("@/views/manage/product/order/index.vue")
    }
  ]
};
