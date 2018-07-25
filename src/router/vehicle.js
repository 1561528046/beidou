export default {
  path: "/vehicle",
  name: "vehicle",
  meta: { name: "车辆管理", icon: "iconfont icon-car-fill" },
  component: () => import("@/views/manage/vehicle/index.vue"),
  children: [
    {
      path: "new",
      name: "new",
      meta: { name: "新增车辆管理" },
      component: () => import("@/views/manage/vehicle/new/index.vue")
    },
    {
      path: "new/add",
      name: "new-add",
      meta: { name: "新增车辆管理-添加", hidden: true },
      component: () => import("@/views/manage/vehicle/new/add.vue")
    },
    {
      path: "position",
      name: "position",
      meta: { name: "新增车辆管理" },
      component: () => import("@/views/manage/vehicle/new/index.vue")
    }
  ]
};
