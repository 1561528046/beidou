export default {
  path: "report",
  name: "report",
  meta: {
    name: "报表",
    icon: "iconfont icon-fl-baobiao",
    p: "7-1-1,7-1-2,7-1-3,7-1-4,7-1-5,7-1-6,7-1-7,7-1-8,7-1-9,7-1-10"
  },
  component: () => import("@/views/manage/report/index.vue"),
  children: [
    {
      path: "additional-alarm",
      name: "additional-alarm",
      meta: { name: "主动安全分析", icon: "iconfont icon-baojing", p: "7-1-1" },
      component: () =>
        import("@/views/manage/report/additional-alarm/index.vue")
    },
    // 报警报表
    {
      path: "alarm",
      name: "report-alarm",
      meta: { name: "报警报表", icon: "iconfont icon-baojing", p: "7-1-1" },
      component: () => import("@/views/manage/report/alarm/index.vue"),
      children: [
        {
          path: "statistical",
          name: "alarm-statistical",
          meta: {
            name: "报警统计表",
            icon: "iconfont icon-tongji1"
          },
          component: () =>
            import("@/views/manage/report/alarm/statistical/index.vue")
        },
        {
          path: "details",
          name: "alarm-details",
          meta: { name: "报警明细表", icon: "iconfont icon-mingxi" },
          component: () =>
            import("@/views/manage/report/alarm/details/index.vue")
        }
      ]
    },
    // 行车报表
    {
      path: "drive",
      name: "report-drive",
      meta: { name: "行车报表", icon: "iconfont icon-my-", p: "7-1-2" },
      component: () => import("@/views/manage/report/drive/index.vue"),
      children: [
        // {
        //   path: "night-summary",
        //   name: "deive-night-summary",
        //   meta: {
        //     name: "夜间行车汇总表",
        //     icon: "iconfont icon-huizong"
        //   },
        //   component: () =>
        //     import("@/views/manage/report/drive/night-summary/index.vue")
        // },
        // {
        //   path: "night-details",
        //   name: "drive-night-details",
        //   meta: { name: "夜间行车明细表", icon: "iconfont icon-mingxi" },
        //   component: () =>
        //     import("@/views/manage/report/drive/night-details/index.vue")
        // },
        {
          path: "parking-summary",
          name: "drive-parking-summary",
          meta: { name: "停车汇总表", icon: "iconfont icon-huizong" },
          component: () =>
            import("@/views/manage/report/drive/parking-summary/index.vue")
        },
        {
          path: "parking-details",
          name: "drive-parking-details",
          meta: { name: "停车明细表", icon: "iconfont icon-mingxi" },
          component: () =>
            import("@/views/manage/report/drive/parking-details/index.vue")
        },
        {
          path: "acc-statistical",
          name: "drive-acc-statistical",
          meta: { name: "ACC点火统计表", icon: "iconfont icon-tongji1" },
          component: () =>
            import("@/views/manage/report/drive/acc-statistical/index.vue")
        },
        {
          path: "acc-details",
          name: "drive-acc-details",
          meta: { name: "ACC点火明细表", icon: "iconfont icon-mingxi" },
          component: () =>
            import("@/views/manage/report/drive/acc-details/index.vue")
        }
      ]
    },
    // 驾驶行为分析
    {
      path: "driving",
      name: "report-driving",
      meta: { name: "驾驶行为分析", icon: "iconfont icon-jiashi", p: "7-1-3" },
      component: () => import("@/views/manage/report/driving/index.vue"),
      children: [
        {
          path: "track",
          name: "driving-track",
          meta: {
            name: "行驶轨迹明细",
            icon: "iconfont icon-xingshizheng"
          },
          component: () =>
            import("@/views/manage/report/driving/track/index.vue")
        },
        {
          path: "summary",
          name: "driving-summary",
          meta: { name: "轨迹超速汇总表", icon: "iconfont icon-chaosu1" },
          component: () =>
            import("@/views/manage/report/driving/summary/index.vue")
        },
        {
          path: "derails",
          name: "driving-details",
          meta: { name: "轨迹超速明细表", icon: "iconfont icon-chaosu2" },
          component: () =>
            import("@/views/manage/report/driving/details/index.vue")
        }
      ]
    },
    // 电子围栏报表
    {
      path: "fence",
      name: "report-fence",
      meta: {
        name: "电子围栏报表",
        icon: "iconfont icon-dianziweilan",
        p: "7-1-4"
      },
      component: () => import("@/views/manage/report/fence/index.vue"),
      children: [
        {
          path: "fence-statistical",
          name: "fence-statistical",
          meta: {
            name: "电子围栏统计表",
            icon: "iconfont icon-tongji1"
          },
          component: () =>
            import("@/views/manage/report/fence/statistical/index.vue")
        },
        {
          path: "fence-details",
          name: "fence-details",
          meta: { name: "电子围栏明细表", icon: "iconfont icon-mingxi" },
          component: () =>
            import("@/views/manage/report/fence/details/index.vue")
        }
      ]
    },
    // 故障报警报表
    // {
    //   path: "glitch",
    //   name: "report-glitch",
    //   meta: {
    //     name: "故障报警报表",
    //     icon: "iconfont icon-guzhangbaojing",
    //     p: "7-1-5"
    //   },
    //   component: () => import("@/views/manage/report/glitch/index.vue"),
    //   children: [
    //     {
    //       path: "glitch-statistical",
    //       name: "glitch-statistical",
    //       meta: {
    //         name: "故障报警统计表",
    //         icon: "iconfont icon-tongji1"
    //       },
    //       component: () =>
    //         import("@/views/manage/report/glitch/statistical/index.vue")
    //     },
    //     {
    //       path: "glitch-details",
    //       name: "glitch-details",
    //       meta: { name: "故障报警明细表", icon: "iconfont icon-mingxi" },
    //       component: () =>
    //         import("@/views/manage/report/glitch/details/index.vue")
    //     }
    //   ]
    // },
    // 里程报表
    {
      path: "mileage",
      name: "report-mileage",
      meta: { name: "里程报表", icon: "iconfont icon-licheng", p: "7-1-6" },
      component: () => import("@/views/manage/report/mileage/index.vue"),
      children: [
        {
          path: "mileage-summary",
          name: "mileage-summary",
          meta: {
            name: "里程汇总表",
            icon: "iconfont icon-huizong"
          },
          component: () =>
            import("@/views/manage/report/mileage/summary/index.vue")
        },
        {
          path: "mileage-details",
          name: "mileage-details",
          meta: { name: "里程明细表", icon: "iconfont icon-mingxi" },
          component: () =>
            import("@/views/manage/report/mileage/details/index.vue")
        }
      ]
    },
    // 数据查询
    // {
    //   path: "selectdata",
    //   name: "report-selectdata",
    //   meta: { name: "数据查询", icon: "iconfont icon-shujuchaxun", p: "7-1-7" },
    //   component: () => import("@/views/manage/report/selectdata/index.vue"),
    //   children: [
    //     {
    //       path: "selectdata-updata",
    //       name: "selectdata-updata",
    //       meta: {
    //         name: "上报数据查询表",
    //         icon: "iconfont icon-shujuchaxun"
    //       },
    //       component: () =>
    //         import("@/views/manage/report/selectdata/updata/index.vue")
    //     },
    //     {
    //       path: "selectdata-details",
    //       name: "selectdata-details",
    //       meta: { name: "下发信息明细表", icon: "iconfont icon-mingxi" },
    //       component: () =>
    //         import("@/views/manage/report/selectdata/details/index.vue")
    //     }
    //   ]
    // },
    // 用户行为分析表
    {
      path: "userbehavior",
      name: "report-userbehavior",
      meta: {
        name: "用户行为分析表",
        icon: "iconfont icon-yonghuhangweifenxi",
        p: "7-1-8"
      },
      component: () => import("@/views/manage/report/userbehavior/index.vue"),
      children: [
        {
          path: "userbehavior-online",
          name: "userbehavior-online",
          meta: {
            name: "在线时长统计",
            icon: "iconfont icon-tongji1"
          },
          component: () =>
            import("@/views/manage/report/userbehavior/online/index.vue")
        },
        // {
        //   path: "userbehavior-login",
        //   name: "userbehavior-login",
        //   meta: {
        //     name: "用户登录明细",
        //     icon: "iconfont icon-yonghudenglurenxianxing"
        //   },
        //   component: () =>
        //     import("@/views/manage/report/userbehavior/login/index.vue")
        // },
        {
          path: "userbehavior-operation",
          name: "userbehavior-operation",
          meta: { name: "用户操作日志", icon: "iconfont icon-yonghucaozuo" },
          component: () =>
            import("@/views/manage/report/userbehavior/operation/index.vue")
        }
        // {
        //   path: "userbehavior-media",
        //   name: "userbehavior-media",
        //   meta: { name: "用户媒体明细", icon: "iconfont icon-mingxi" },
        //   component: () =>
        //     import("@/views/manage/report/userbehavior/media/index.vue")
        // }
        // {
        //   path: "userbehavior-vehicle",
        //   name: "userbehavior-vehicle",
        //   meta: {
        //     name: "车辆维护记录",
        //     icon: "iconfont icon-cheliangweihubaoyang"
        //   },
        //   component: () =>
        //     import("@/views/manage/report/userbehavior/vehicle/index.vue")
        // },
        // {
        //   path: "userbehavior-device",
        //   name: "userbehavior-device",
        //   meta: { name: "设备变更报表", icon: "iconfont icon-shebeibiangeng" },
        //   component: () =>
        //     import("@/views/manage/report/userbehavior/device/index.vue")
        // }
      ]
    },
    // 车辆连接统计表
    {
      path: "vehiclelink",
      name: "report-vehiclelink",
      meta: {
        name: "车辆连接统计表",
        icon: "iconfont icon-vehicle_connection",
        p: "7-1-9"
      },
      component: () => import("@/views/manage/report/vehiclelink/index.vue"),
      children: [
        {
          path: "vehiclelink-summary",
          name: "vehiclelink-summary",
          meta: {
            name: "车辆上线率统计表",
            icon: "iconfont icon-huizong"
          },
          component: () =>
            import("@/views/manage/report/vehiclelink/summary/index.vue")
        },
        {
          path: "vehiclelink-details",
          name: "vehiclelink-details",
          meta: { name: "车辆上下线明细表", icon: "iconfont icon-mingxi" },
          component: () =>
            import("@/views/manage/report/vehiclelink/details/index.vue")
        }
      ]
    },
    {
      path: "driver-upload",
      name: "driver-upload",
      meta: {
        name: "驾驶员上传记录表",
        icon: "iconfont icon-shangchuanjilu"
      },
      component: () => import("@/views/manage/report/record/index.vue")
    }
    // 视频报警报表
    // {
    //   path: "video",
    //   name: "report-video",
    //   meta: {
    //     name: "视频报警报表",
    //     icon: "iconfont icon-shipinbaojing",
    //     p: "7-1-10"
    //   },
    //   component: () => import("@/views/manage/report/video/index.vue"),
    //   children: [
    //     {
    //       path: "video-statistical",
    //       name: "video-statistical",
    //       meta: {
    //         name: "视频报警统计表",
    //         icon: "iconfont icon-tongji1"
    //       },
    //       component: () =>
    //         import("@/views/manage/report/video/statistical/index.vue")
    //     },
    //     {
    //       path: "video-details",
    //       name: "video-details",
    //       meta: { name: "视频报警明细表", icon: "iconfont icon-mingxi" },
    //       component: () =>
    //         import("@/views/manage/report/video/details/index.vue")
    //     }
    //   ]
    // }
  ]
};
