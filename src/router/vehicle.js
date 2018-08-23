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
      props: { vehicle_type: 1 }, //根据vehicle_type区分普货和其他类型车辆
      component: () => import("@/views/manage/vehicle/index.vue"),
      children: [
        {
          path: "new",
          name: "gghypt_vehicle_list_new",
          meta: { name: "新增车辆管理", icon: "iconfont icon-zongheguanli" },
          props: { vehicle_type: 1, state: 1 }, //根据vehicle_type区分普货和其他类型车辆 state: 1新增车辆 2定位车辆 3到期车辆
          component: () => import("@/views/manage/vehicle/new/index.vue")
        },
        {
          path: "position",
          name: "gghypt_vehicle_list_position",
          meta: { name: "定位车辆管理", icon: "iconfont icon-location-fill" },
          props: { vehicle_type: 1, state: 2 }, //根据vehicle_type区分普货和其他类型车辆 state: 1新增车辆 2定位车辆 3到期车辆
          component: () => import("@/views/manage/vehicle/new/index.vue")
        },
        {
          path: "timeout",
          name: "gghypt_vehicle_list_timeout",
          meta: {
            name: "到期车辆管理",
            icon: "iconfont icon-time-circle-fill"
          },
          props: { vehicle_type: 1, state: 3 }, //根据vehicle_type区分普货和其他类型车辆 state: 1新增车辆 2定位车辆 3到期车辆
          component: () => import("@/views/manage/vehicle/new/index.vue")
        },
        {
          path: "new/add",
          name: "gghypt_vehicle_add",
          meta: { name: "新增车辆管理-添加", hidden: true },
          props: { vehicle_type: 1, state: 1 },
          component: () => import("@/views/manage/vehicle/new/add.vue")
        },
        {
          path: "new/edit",
          name: "gghypt_vehicle_edit",
          meta: { name: "新增车辆管理-编辑", hidden: true },
          props: { vehicle_type: 1, state: 1 },
          component: () => import("@/views/manage/vehicle/new/add.vue")
        }
      ]
    },
    {
      path: "other_vehicle",
      name: "other_vehicle",
      meta: { name: "自营车辆管理", icon: "iconfont icon-golden-fill" },
      props: { vehicle_type: 2 }, //根据vehicle_type区分普货和其他类型车辆
      component: () => import("@/views/manage/vehicle/index.vue"),
      children: [
        {
          path: "new",
          name: "other_vehicle_list_new",
          meta: { name: "新增车辆管理", icon: "iconfont icon-zongheguanli" },
          props: { vehicle_type: 1, state: 1 }, //根据vehicle_type区分普货和其他类型车辆 state: 1新增车辆 2定位车辆 3到期车辆
          component: () => import("@/views/manage/vehicle/new/index.vue")
        },
        {
          path: "position",
          name: "other_vehicle_list_position",
          meta: { name: "定位车辆管理", icon: "iconfont icon-location-fill" },
          props: { vehicle_type: 1, state: 2 }, //根据vehicle_type区分普货和其他类型车辆 state: 1新增车辆 2定位车辆 3到期车辆
          component: () => import("@/views/manage/vehicle/new/index.vue")
        },
        {
          path: "timeout",
          name: "other_vehicle_list_timeout",
          meta: {
            name: "到期车辆管理",
            icon: "iconfont icon-time-circle-fill"
          },
          props: { vehicle_type: 1, state: 3 }, //根据vehicle_type区分普货和其他类型车辆 state: 1新增车辆 2定位车辆 3到期车辆
          component: () => import("@/views/manage/vehicle/new/index.vue")
        },
        {
          path: "new/add",
          name: "other_vehicle_add",
          meta: { name: "新增车辆管理-添加", hidden: true },
          props: { vehicle_type: 1, state: 1 },
          component: () => import("@/views/manage/vehicle/new/add.vue")
        },
        {
          path: "new/edit",
          name: "other_vehicle_edit",
          meta: { name: "新增车辆管理-编辑", hidden: true },
          props: { vehicle_type: 1, state: 1 },
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
