//is_enter是否录入全国平台：1是，2否
//state 车辆状态 1、新增车辆 2、定位车辆 3、到期车辆
//type 接入车辆类型：1普通货运车辆，2危险品车辆，3长途客运、班线车辆，4城市公共交通车辆，5校车，6出租车，7私家车，8警务车辆，9网约车，10其他车辆
export default {
  path: "vehicle",
  name: "vehicle",
  meta: { name: "车辆管理", icon: "iconfont icon-car-fill" },
  component: () => import("@/views/manage/vehicle/index.vue"),
  children: [
    // {
    //   path: "gghypt_vehicle",
    //   name: "gghypt_vehicle",
    //   meta: {
    //     name: "全国联动车辆管理",
    //     icon: "iconfont icon-guohui",
    //     p: "1-1-4"
    //   },
    //   props: { is_enter: 1 },
    //   component: () => import("@/views/manage/vehicle/index.vue"),
    //   children: [
    //     {
    //       path: "new",
    //       name: "gghypt_vehicle_list_new",
    //       meta: { name: "新增车辆管理", icon: "iconfont icon-zongheguanli" },
    //       props: { is_enter: 1, state: 1 },
    //       component: () => import("@/views/manage/vehicle/new/index.vue")
    //     },
    //     {
    //       path: "position",
    //       name: "gghypt_vehicle_list_position",
    //       meta: { name: "定位车辆管理", icon: "iconfont icon-location-fill" },
    //       props: { is_enter: 1, state: 2 },
    //       component: () => import("@/views/manage/vehicle/new/index.vue")
    //     },
    //     {
    //       path: "timeout",
    //       name: "gghypt_vehicle_list_timeout",
    //       meta: {
    //         name: "到期车辆管理",
    //         icon: "iconfont icon-time-circle-fill"
    //       },
    //       props: { is_enter: 1, state: 3 },
    //       component: () => import("@/views/manage/vehicle/new/index.vue")
    //     },
    //     {
    //       path: "new/add",
    //       name: "gghypt_vehicle_add",
    //       meta: { name: "新增车辆管理-添加", hidden: true },
    //       props: { is_enter: 1, state: 1 },
    //       component: () => import("@/views/manage/vehicle/new/add.vue")
    //     },
    //     {
    //       path: "new/edit/",
    //       name: "gghypt_vehicle_edit",
    //       meta: { name: "新增车辆管理-编辑", hidden: true },
    //       props: { is_enter: 1, state: 1, is_edit: true },
    //       component: () => import("@/views/manage/vehicle/new/add.vue")
    //     }
    //   ]
    // },
    {
      path: "other_vehicle",
      name: "other_vehicle",
      meta: { name: "车辆管理", icon: "iconfont  icon-car-fill", p: "1-1-4" },
      component: () => import("@/views/manage/vehicle/index.vue"),
      children: [
        {
          path: "new",
          name: "other_vehicle_list_new",
          meta: { name: "新增车辆管理", icon: "iconfont icon-zongheguanli" },
          props: { state: 1 },
          component: () => import("@/views/manage/vehicle/new/index.vue")
        },
        {
          path: "position",
          name: "other_vehicle_list_position",
          meta: { name: "定位车辆管理", icon: "iconfont icon-location-fill" },
          props: { state: 2 },
          component: () => import("@/views/manage/vehicle/new/index.vue")
        },
        {
          path: "timeout",
          name: "other_vehicle_list_timeout",
          meta: {
            name: "到期车辆管理",
            icon: "iconfont icon-time-circle-fill"
          },
          props: { state: 3 },
          component: () => import("@/views/manage/vehicle/new/index.vue")
        },
        {
          path: "new/add",
          name: "other_vehicle_add",
          meta: { name: "新增车辆管理-添加", hidden: true },
          props: {},
          component: () => import("@/views/manage/vehicle/new/add.vue")
        },
        {
          path: "new/edit/",
          name: "other_vehicle_edit",
          meta: { name: "新增车辆管理-编辑", hidden: true },
          props: { is_edit: true },
          component: () => import("@/views/manage/vehicle/new/add.vue")
        },
        {
          path: "position/edit/",
          name: "other_vehicle_position_edit",
          meta: { name: "定位车辆管理-编辑", hidden: true },
          props: { is_edit: true },
          component: () => import("@/views/manage/vehicle/new/add.vue")
        },
        {
          path: "timeout/edit/",
          name: "other_vehicle_timeout_edit",
          meta: { name: "到期车辆管理-编辑", hidden: true },
          props: { is_edit: true },
          component: () => import("@/views/manage/vehicle/new/add.vue")
        }
      ]
    },

    {
      path: "vehicle-repair",
      name: "vehicle-repair",
      meta: {
        name: "维修车辆管理",
        icon: "iconfont icon-wrench-fill",
        p: "1-2-3"
      },
      component: () => import("@/views/manage/vehicle/repair.vue")
    },
    // {
    //   path: "vehicle-pcap",
    //   name: "vehicle-pcap",
    //   meta: { name: "车辆数据连接", icon: "iconfont icon-swap" },
    //   component: () => import("@/views/manage/vehicle/index.vue")
    // },
    {
      path: "vehicle-setting",
      name: "vehicle-setting",
      meta: { name: "车辆参数设置", icon: "iconfont icon-setting-fill" },
      component: () => import("@/views/manage/vehicle/parameter/parameter.vue")
    }
  ]
};
