export default {
  path: "vehicle",
  name: "vehicle",
  meta: { name: "车辆管理", icon: "iconfont icon-car-fill" },
  component: () => import("@/views/manage/vehicle/index.vue"),
  children: [
    {
      path: "gghypt_vehicle",
      name: "gghypt_vehicle",
      meta: { name: "全国联动车辆管理", icon: "iconfont icon-guohui" },
      props: { is_enter: 1 }, //is_enter是否录入全国平台：1是，2否
      component: () => import("@/views/manage/vehicle/index.vue"),
      children: [
        {
          path: "new",
          name: "gghypt_vehicle_list_new",
          meta: { name: "新增车辆管理", icon: "iconfont icon-zongheguanli" },
          props: { is_enter: 1, state: 1 }, //is_enter是否录入全国平台：1是，2否
          component: () => import("@/views/manage/vehicle/new/index.vue")
        },
        {
          path: "position",
          name: "gghypt_vehicle_list_position",
          meta: { name: "定位车辆管理", icon: "iconfont icon-location-fill" },
          props: { is_enter: 1, state: 2 }, //is_enter是否录入全国平台：1是，2否
          component: () => import("@/views/manage/vehicle/new/index.vue")
        },
        {
          path: "timeout",
          name: "gghypt_vehicle_list_timeout",
          meta: {
            name: "到期车辆管理",
            icon: "iconfont icon-time-circle-fill"
          },
          props: { is_enter: 1, state: 3 }, //is_enter是否录入全国平台：1是，2否
          component: () => import("@/views/manage/vehicle/new/index.vue")
        },
        {
          path: "new/add",
          name: "gghypt_vehicle_add",
          meta: { name: "新增车辆管理-添加", hidden: true },
          props: { is_enter: 1, state: 1 },
          component: () => import("@/views/manage/vehicle/new/add.vue")
        },
        {
          path: "new/edit/",
          name: "gghypt_vehicle_edit",
          meta: { name: "新增车辆管理-编辑", hidden: true },
          props: { is_enter: 1, state: 1 },
          component: () => import("@/views/manage/vehicle/new/add.vue")
        }
      ]
    },
    {
      path: "other_vehicle",
      name: "other_vehicle",
      meta: { name: "自营车辆管理", icon: "iconfont icon-golden-fill" },
      props: { is_enter: 2 }, //根据is_enter区分普货和其他类型车辆
      component: () => import("@/views/manage/vehicle/index.vue"),
      children: [
        {
          path: "new",
          name: "other_vehicle_list_new",
          meta: { name: "新增车辆管理", icon: "iconfont icon-zongheguanli" },
          props: { is_enter: 1, state: 1 }, //is_enter是否录入全国平台：1是，2否
          component: () => import("@/views/manage/vehicle/new/index.vue")
        },
        {
          path: "position",
          name: "other_vehicle_list_position",
          meta: { name: "定位车辆管理", icon: "iconfont icon-location-fill" },
          props: { is_enter: 1, state: 2 }, //is_enter是否录入全国平台：1是，2否
          component: () => import("@/views/manage/vehicle/new/index.vue")
        },
        {
          path: "timeout",
          name: "other_vehicle_list_timeout",
          meta: {
            name: "到期车辆管理",
            icon: "iconfont icon-time-circle-fill"
          },
          props: { is_enter: 1, state: 3 }, //is_enter是否录入全国平台：1是，2否
          component: () => import("@/views/manage/vehicle/new/index.vue")
        },
        {
          path: "new/add",
          name: "other_vehicle_add",
          meta: { name: "新增车辆管理-添加", hidden: true },
          props: { is_enter: 1, state: 1 },
          component: () => import("@/views/manage/vehicle/new/add.vue")
        },
        {
          path: "new/edit",
          name: "other_vehicle_edit",
          meta: { name: "新增车辆管理-编辑", hidden: true },
          props: { is_enter: 1, state: 1 },
          component: () => import("@/views/manage/vehicle/new/add.vue")
        }
      ]
    },
    {
      path: "vehicle-repair",
      name: "vehicle-repair",
      meta: { name: "维修车辆管理", icon: "iconfont icon-wrench-fill" },
      component: () => import("@/views/manage/vehicle/index.vue")
    },
    {
      path: "vehicle-pcap",
      name: "vehicle-pcap",
      meta: { name: "车辆数据连接", icon: "iconfont icon-swap" },
      component: () => import("@/views/manage/vehicle/index.vue")
    }
  ]
};
