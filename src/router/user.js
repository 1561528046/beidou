export default {
  path: "user",
  name: "user",
  meta: { name: "用户管理", icon: "iconfont icon-team" },
  component: () => import("@/views/manage/user/index.vue"),
  children: [
    {
      path: "user_company",
      name: "user_company",
      meta: { name: "公司用户管理", icon: "iconfont icon-team" },
      props: { user_type: 2 }, //根据user_type区分公司还是个人 1个人 2公司
      component: () => import("@/views/manage/user/user/index.vue")
    },
    {
      path: "user_company_add",
      name: "user_company_add",
      meta: { name: "添加公司用户", hidden: true },
      props: { user_type: 2 }, //根据user_type区分公司还是个人 1个人 2公司
      component: () => import("@/views/manage/user/user/add.vue")
    },
    {
      path: "user_company_update/:user_id",
      name: "user_company_update",
      meta: { name: "编辑公司用户", hidden: true },
      props: { user_type: 2 }, //根据user_type区分公司还是个人 1个人 2公司
      component: () => import("@/views/manage/user/user/update.vue")
    },
    {
      path: "user_person",
      name: "user_person",
      meta: { name: "个人用户管理", icon: "iconfont icon-user" },
      props: { user_type: 1 }, //根据user_type区分公司还是个人 1个人 2公司
      component: () => import("@/views/manage/user/user/index.vue")
    },
    {
      path: "user_person_add",
      name: "user_person_add",
      meta: { name: "添加个人用户", hidden: true },
      props: { user_type: 1 }, //根据user_type区分公司还是个人 1个人 2公司
      component: () => import("@/views/manage/user/user/add.vue")
    },
    {
      path: "user_person_update/:user_id",
      name: "user_person_update",
      meta: { name: "编辑个人用户", hidden: true },
      props: { user_type: 2 }, //根据user_type区分公司还是个人 1个人 2公司
      component: () => import("@/views/manage/user/user/update.vue")
    },

    /**
     * 司机信息
     */
    {
      path: "driver",
      name: "driver",
      meta: { name: "司机信息管理", icon: "iconfont icon-driver" },
      component: () => import("@/views/manage/user/driver/index.vue")
    },
    {
      path: "driver_add",
      name: "driver_add",
      meta: { name: "添加司机", hidden: true },
      component: () => import("@/views/manage/user/driver/add.vue")
    },
    {
      path: "driver_update/:driver_card_id",
      name: "driver_update",
      meta: { name: "编辑个人用户", hidden: true },
      component: () => import("@/views/manage/user/driver/update.vue")
    }
  ]
};
