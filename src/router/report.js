export default {
  path: "report",
  name: "report",
  meta: { name: "报表", icon: "iconfont icon-fl-baobiao" },
  component: () => import("@/views/manage/report/index.vue"),
  children: [
    // 报警报表
    {
      path: "alarm",
      name: "report-alarm",
      meta: { name: "报警报表", icon: "iconfont icon-jiashi" },
      component: () => import("@/views/manage/report/alarm/index.vue"),
      children: [
        {
          path: "drive",
          name: "report-driving-drive",
          meta: {
            name: "报警统计表",
            icon: "iconfont icon-xingshizheng"
          },
          component: () =>
            import("@/views/manage/report/driving/drive/index.vue")
        },
        {
          path: "overspeed",
          name: "report-driving-overspeed",
          meta: { name: "报警明细表", icon: "iconfont icon-chaosu1" },
          component: () =>
            import("@/views/manage/report/driving/overspeed/index.vue")
        }
      ]
    },
    // 行车报表
    {
      path: "drive",
      name: "report-drive",
      meta: { name: "行车报表", icon: "iconfont icon-jiashi" },
      component: () => import("@/views/manage/report/drive/index.vue"),
      children: [
        {
          path: "drive",
          name: "report-driving-drive",
          meta: {
            name: "夜间行车汇总表",
            icon: "iconfont icon-xingshizheng"
          },
          component: () =>
            import("@/views/manage/report/driving/drive/index.vue")
        },
        {
          path: "overspeed",
          name: "report-driving-overspeed",
          meta: { name: "夜间行车明细表", icon: "iconfont icon-chaosu1" },
          component: () =>
            import("@/views/manage/report/driving/overspeed/index.vue")
        },
        {
          path: "overspeeding",
          name: "report-driving-overspeeding",
          meta: { name: "停车汇总表", icon: "iconfont icon-chaosu2" },
          component: () =>
            import("@/views/manage/report/driving/overspeeding/index.vue")
        },
        {
          path: "overspeeding",
          name: "report-driving-overspeeding",
          meta: { name: "停车明细表", icon: "iconfont icon-chaosu2" },
          component: () =>
            import("@/views/manage/report/driving/overspeeding/index.vue")
        },
        {
          path: "overspeeding",
          name: "report-driving-overspeeding",
          meta: { name: "ACC点火汇总表", icon: "iconfont icon-chaosu2" },
          component: () =>
            import("@/views/manage/report/driving/overspeeding/index.vue")
        },
        {
          path: "overspeeding",
          name: "report-driving-overspeeding",
          meta: { name: "ACC点火明细表", icon: "iconfont icon-chaosu2" },
          component: () =>
            import("@/views/manage/report/driving/overspeeding/index.vue")
        }
      ]
    },
    // 驾驶行为分析
    {
      path: "driving",
      name: "report-driving",
      meta: { name: "驾驶行为分析", icon: "iconfont icon-jiashi" },
      component: () => import("@/views/manage/report/driving/index.vue"),
      children: [
        {
          path: "drive",
          name: "report-driving-drive",
          meta: {
            name: "行驶轨迹明细",
            icon: "iconfont icon-xingshizheng"
          },
          component: () =>
            import("@/views/manage/report/driving/drive/index.vue")
        },
        {
          path: "overspeed",
          name: "report-driving-overspeed",
          meta: { name: "轨迹超速汇总表", icon: "iconfont icon-chaosu1" },
          component: () =>
            import("@/views/manage/report/driving/overspeed/index.vue")
        },
        {
          path: "overspeeding",
          name: "report-driving-overspeeding",
          meta: { name: "轨迹超速明细表", icon: "iconfont icon-chaosu2" },
          component: () =>
            import("@/views/manage/report/driving/overspeeding/index.vue")
        }
      ]
    },
    // 电子围栏报表
    {
      path: "fence",
      name: "report-fence",
      meta: { name: "电子围栏报表", icon: "iconfont icon-jiashi" },
      component: () => import("@/views/manage/report/fence/index.vue"),
      children: [
        {
          path: "drive",
          name: "report-driving-drive",
          meta: {
            name: "电子围栏统计表",
            icon: "iconfont icon-xingshizheng"
          },
          component: () =>
            import("@/views/manage/report/driving/drive/index.vue")
        },
        {
          path: "overspeed",
          name: "report-driving-overspeed",
          meta: { name: "电子围栏明细表", icon: "iconfont icon-chaosu1" },
          component: () =>
            import("@/views/manage/report/driving/overspeed/index.vue")
        }
      ]
    },
    // 故障报警报表
    {
      path: "glitch",
      name: "report-glitch",
      meta: { name: "故障报警报表", icon: "iconfont icon-jiashi" },
      component: () => import("@/views/manage/report/glitch/index.vue"),
      children: [
        {
          path: "drive",
          name: "report-driving-drive",
          meta: {
            name: "故障报警统计表",
            icon: "iconfont icon-xingshizheng"
          },
          component: () =>
            import("@/views/manage/report/driving/drive/index.vue")
        },
        {
          path: "overspeed",
          name: "report-driving-overspeed",
          meta: { name: "故障报警明细表", icon: "iconfont icon-chaosu1" },
          component: () =>
            import("@/views/manage/report/driving/overspeed/index.vue")
        }
      ]
    },
    // 里程报表
    {
      path: "mileage",
      name: "report-mileage",
      meta: { name: "里程报表", icon: "iconfont icon-jiashi" },
      component: () => import("@/views/manage/report/mileage/index.vue"),
      children: [
        {
          path: "drive",
          name: "report-driving-drive",
          meta: {
            name: "里程汇总表",
            icon: "iconfont icon-xingshizheng"
          },
          component: () =>
            import("@/views/manage/report/driving/drive/index.vue")
        },
        {
          path: "overspeed",
          name: "report-driving-overspeed",
          meta: { name: "里程明细表", icon: "iconfont icon-chaosu1" },
          component: () =>
            import("@/views/manage/report/driving/overspeed/index.vue")
        }
      ]
    },
    // 数据查询
    {
      path: "selectdata",
      name: "report-selectdata",
      meta: { name: "数据查询", icon: "iconfont icon-jiashi" },
      component: () => import("@/views/manage/report/selectdata/index.vue"),
      children: [
        {
          path: "drive",
          name: "report-driving-drive",
          meta: {
            name: "上报数据查询表",
            icon: "iconfont icon-xingshizheng"
          },
          component: () =>
            import("@/views/manage/report/driving/drive/index.vue")
        },
        {
          path: "overspeed",
          name: "report-driving-overspeed",
          meta: { name: "下发信息明细表", icon: "iconfont icon-chaosu1" },
          component: () =>
            import("@/views/manage/report/driving/overspeed/index.vue")
        }
      ]
    },
    // 用户行为分析表
    {
      path: "userbehavior",
      name: "report-userbehavior",
      meta: { name: "用户行为分析表", icon: "iconfont icon-jiashi" },
      component: () => import("@/views/manage/report/userbehavior/index.vue"),
      children: [
        {
          path: "drive",
          name: "report-driving-drive",
          meta: {
            name: "在线时长统计",
            icon: "iconfont icon-xingshizheng"
          },
          component: () =>
            import("@/views/manage/report/driving/drive/index.vue")
        },
        {
          path: "overspeed",
          name: "report-driving-overspeed",
          meta: { name: "用户登录明细", icon: "iconfont icon-chaosu1" },
          component: () =>
            import("@/views/manage/report/driving/overspeed/index.vue")
        },
        {
          path: "overspeeding",
          name: "report-driving-overspeeding",
          meta: { name: "用户操作日志", icon: "iconfont icon-chaosu2" },
          component: () =>
            import("@/views/manage/report/driving/overspeeding/index.vue")
        },
        {
          path: "overspeeding",
          name: "report-driving-overspeeding",
          meta: { name: "用户媒体明细", icon: "iconfont icon-chaosu2" },
          component: () =>
            import("@/views/manage/report/driving/overspeeding/index.vue")
        },
        {
          path: "overspeeding",
          name: "report-driving-overspeeding",
          meta: { name: "车辆维护记录", icon: "iconfont icon-chaosu2" },
          component: () =>
            import("@/views/manage/report/driving/overspeeding/index.vue")
        },
        {
          path: "overspeeding",
          name: "report-driving-overspeeding",
          meta: { name: "设备变更报表", icon: "iconfont icon-chaosu2" },
          component: () =>
            import("@/views/manage/report/driving/overspeeding/index.vue")
        }
      ]
    },
    // 车辆连接统计表
    {
      path: "vehiclelink",
      name: "report-vehiclelink",
      meta: { name: "车辆连接统计表", icon: "iconfont icon-jiashi" },
      component: () => import("@/views/manage/report/vehiclelink/index.vue"),
      children: [
        {
          path: "drive",
          name: "report-driving-drive",
          meta: {
            name: "车辆上线下线汇总表",
            icon: "iconfont icon-xingshizheng"
          },
          component: () =>
            import("@/views/manage/report/driving/drive/index.vue")
        },
        {
          path: "overspeed",
          name: "report-driving-overspeed",
          meta: { name: "车辆上线下线明细表", icon: "iconfont icon-chaosu1" },
          component: () =>
            import("@/views/manage/report/driving/overspeed/index.vue")
        }
      ]
    },
    // 视频报警报表
    {
      path: "video",
      name: "report-video",
      meta: { name: "视频报警报表", icon: "iconfont icon-jiashi" },
      component: () => import("@/views/manage/report/video/index.vue"),
      children: [
        {
          path: "drive",
          name: "report-driving-drive",
          meta: {
            name: "视频报警统计表",
            icon: "iconfont icon-xingshizheng"
          },
          component: () =>
            import("@/views/manage/report/driving/drive/index.vue")
        },
        {
          path: "overspeed",
          name: "report-driving-overspeed",
          meta: { name: "视频报警明细表", icon: "iconfont icon-chaosu1" },
          component: () =>
            import("@/views/manage/report/driving/overspeed/index.vue")
        }
      ]
    }
  ]
};
