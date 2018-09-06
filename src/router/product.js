export default {
  path: "product",
  name: "product",
  meta: { name: "订单管理", icon: "iconfont icon-dd" },
  component: () => import("@/views/manage/product/index.vue"),
  children: [
    {
      path: "product",
      name: "product-product",
      meta: { name: "产品管理", icon: "iconfont icon-chanpin" },
      component: () => import("@/views/manage/product/product/index.vue")
    },
    {
      path: "product-add",
      name: "product-add",
      meta: { name: "产品管理-添加", hidden: true },
      component: () => import("@/views/manage/product/product/add.vue")
    },
    {
      path: "product-update/:id",
      name: "product-update",
      meta: { name: "产品管理-编辑", hidden: true },
      component: () => import("@/views/manage/product/product/update.vue")
    },
    {
      path: "product-binding",
      name: "product-binding",
      meta: { name: "分配用户", hidden: true },
      component: () => import("@/views/manage/product/product/binding.vue")
    },
    {
      path: "order-select",
      name: "order-select",
      meta: {
        name: "订单查询",
        icon: "iconfont icon-dingdanchaxun"
      },
      component: () => import("@/views/manage/product/user/index.vue")
    },
    {
      path: "order-order/:id",
      name: "order-order",
      meta: {
        name: "订单查询-查询",
        hidden: true
      },
      component: () => import("@/views/manage/product/user/order.vue")
    },
    {
      path: "recharge",
      name: "recharge",
      meta: { name: "充值管理", icon: "iconfont icon-chongzhi" },
      component: () => import("@/views/manage/product/recharge/index.vue")
    },
    {
      path: "order",
      name: "order",
      meta: { name: "订单审核", icon: "iconfont icon-dingdanguanli" },
      component: () => import("@/views/manage/product/order/index.vue")
    }
  ]
};
