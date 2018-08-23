export default {
  path: "report",
  name: "report",
  meta: { name: "报表", icon: "iconfont icon-fl-baobiao" },
  component: () => import("@/views/manage/report/index.vue"),
  children: [
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
    }
  ]
};
