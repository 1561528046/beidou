<template>

  <el-row type="flex" class="row-bg" style="background:#001529;box-shadow: 0 0 4px #333;z-index: 9999;">
    <el-col :span="4">
      <div class="admin-header-left">
        <a href="/" class="brand">&#x3000;中交天枢动态车辆监控系统</a>
      </div>
    </el-col>
    <el-col :span="8+5" style="text-align:center;">
      <el-menu mode="horizontal" :default-active="defaultActive" :router="true" background-color="#001529" text-color="rgba(255, 255, 255, 0.65)" active-text-color="#1890ff" style="border-bottom:0;">
        <template v-for="route in routes">
          <!-- 只显示一级栏目 -->
          <!-- <el-submenu :index="route.path" v-if="route.children" :key="route.name">
        <template slot="title">{{route.meta.name}}</template>
        <el-menu-item :index="route.path+'/'+routeChildren.path" v-for="routeChildren in route.children" :key="routeChildren.name">{{routeChildren.meta.name}}</el-menu-item>
      </el-submenu> -->
          <el-menu-item :index="route.path" :key="route.name" v-if="!route.meta.hidden">{{route.meta.name||route.name}}</el-menu-item>
        </template>
      </el-menu>
    </el-col>
    <el-col :span="8">
      <div class="admin-header-right">
        <el-dropdown style="margin:20px 10px 0 0; cursor:pointer;">
          <span class="el-dropdown-link">
            {{real_name}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>
              <a @click="loginOut"> 修改密码</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a @click="loginOut"> 修改个人信息</a>
            </el-dropdown-item> -->
            <el-dropdown-item>
              <a @click="loginOut"> 退出</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
  </el-row>

</template>

<script>
export default {
  computed: {
    real_name() {
      return this.$store.state.user.real_name;
    },
    defaultActive() {
      if (this.$route.matched.length) {
        return this.$route.matched[0].path || "/";
      } else {
        return "";
      }
    },
    routes() {
      return this.$router.options.routes;
    }
  },
  methods: {
    loginOut() {
      this.$store.dispatch("loginOut").then(() => {
        this.$router.replace({ name: "login" });
      });
    }
  }
};
</script>