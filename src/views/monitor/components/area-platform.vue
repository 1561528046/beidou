<template>
  <div class="admin-table-container" style="position: absolute;left:0;right:0;bottom:0;top:107px;">
    <!-- 返回 -->
    <router-link :to="{name:'map'}">
      <el-button
        style="position:absolute;top:-30px;right:31px;"
        size="small"
        icon="el-icon-arrow-left"
      >
        <span>返回</span>
      </el-button>
    </router-link>
    <el-card shadow="always" class="full-box">
      <div class="bind-box">
        <div class="user-box">
          <div class="user-header">区域列表</div>
          <div class="user-filter" :class="{active:userFilterOpen}">
            <el-form :model="areaList" size="small">
              <el-form-item>
                <el-input placeholder="区域名称" size="small" v-model="areaList.RegionName">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
            </el-form>

            <!-- <div class="user-load-more" @click="userFilterOpen=!userFilterOpen">
              <i class="el-icon-caret-bottom" v-if="!userFilterOpen"></i>
              <i class="el-icon-caret-top" v-if="userFilterOpen"></i>

            </div>-->
          </div>
          <ul class="user-list">
            <li
              v-for="areaitem in area"
              :class="{active:areaitem.RegionId==currentUser.RegionId}"
              :key="areaitem.RegionId"
              @click="changeUser(areaitem)"
            >{{areaitem.RegionName}}</li>
          </ul>
          <div class="user-pager">
            <el-input placeholder="页码" size="small" v-model="areaList.page">
              <el-button
                slot="prepend"
                icon="el-icon-caret-left"
                @click="userPagerPrev()"
                :disabled="userPagerPrevState"
              ></el-button>
              <el-button
                slot="append"
                icon="el-icon-caret-right"
                @click="userPagerNext()"
                :disabled="userPagerNextState"
              ></el-button>
            </el-input>
          </div>
        </div>
        <!-- <transition name="fade">
          <div class="group-container" v-if="currentUser.user_id">
            <select-group :static="true" :useing="['add','edit','remove']" :user_id="currentUser.user_id" :level.sync="groupData.level" :group_id.sync="groupData.group_id" :parentid.sync="groupData.parent_id" style="width:300px;height:100%;"></select-group>
          </div>
        </transition>-->
        <div class="transfer-container">
          <div class="transfer-filter">
            <div class="transfer-filter-item">
              <el-form :inline="true" :model="bindTableQuery" size="mini">
                <el-form-item>
                  <el-input placeholder="车牌号" v-model="bindTableQuery.license">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-form-item>
                <!-- <el-form-item>
                  <el-input placeholder="用户" v-model="bindTableQuery.real_name">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-form-item>-->
                <el-form-item>
                  <el-button @click="renderBind()">搜索</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div style="width:100px;"></div>
            <div class="transfer-filter-item">
              <el-form :inline="true" :model="unbindTableQuery" size="mini">
                <el-form-item>
                  <el-input placeholder="车牌号" v-model="unbindTableQuery.license">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-form-item>
                <!-- <el-form-item>
                  <el-input placeholder="用户" v-model="unbindTableQuery.real_name">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-form-item>-->
                <el-form-item>
                  <el-button @click="renderUnbind()">搜索</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="transfer-list">
            <admin-transfer
              @onLeft="onleft"
              :lists="list"
              :titles="titles"
              @onRight="onright"
              :leftCol="leftCol"
              :rightCol="rightCol"
              style="width:100%;height:100%;"
            ></admin-transfer>
          </div>
          <div class="transfer-pager">
            <div class="transfer-pager-item">
              <el-pagination
                @size-change="bindSizeChange"
                @current-change="bindcurrentChange"
                :current-page="bindTableQuery.page"
                :page-sizes="[20, 50, 100,300,600,1000]"
                :page-size="bindTableQuery.size"
                :total="bindTableQuery.total"
                layout="total, sizes, prev,  next, jumper"
                background
              ></el-pagination>
            </div>
            <div style="width:100px;"></div>
            <div class="transfer-pager-item">
              <el-pagination
                @size-change="unbindSizeChange"
                @current-change="unbindcurrentChange"
                :current-page="unbindTableQuery.page"
                :page-sizes="[20, 50, 100,300,600,1000]"
                :page-size="unbindTableQuery.size"
                :total="unbindTableQuery.total"
                layout="total, sizes, prev,  next, jumper"
                background
              ></el-pagination>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import {
  GetRegionByPage, //查询围栏列表
  GetRegionBindByPage, // 查询围栏已绑定的车辆
  GetRegionUnBindByPage, // 查询围栏未绑定的车辆
  RegionBindVehicle, // 围栏绑定车辆
  RegionUnBindVehicle // 围栏解绑车辆
} from "@/api/index.js";
import adminTransfer from "@/components/transfer.vue";
import selectGroup from "@/components/select-group/select-group.vue";
export default {
  components: { adminTransfer, selectGroup },
  created() {
    this.renderUser();
  },
  computed: {
    list: function() {
      return this.leftList.concat(this.rightList);
    },
    userPagerNextState: function() {
      return !(
        this.areaList.total - this.areaList.page * this.areaList.size >
        0
      );
    },
    userPagerPrevState: function() {
      return !(this.areaList.page > 1);
    }
  },
  data() {
    return {
      userFilterOpen: false, //用户筛选展开关闭
      currentUser: {},
      titles: ["已绑定车辆", "未绑定车辆"],
      userList: [],
      leftList: [],
      rightList: [],
      area: [],
      areaList: {
        page: 1,
        size: 999,
        RegionName: "",
        Type: "",
        total: 0
      },
      // 左侧列表查询
      agreement: {
        page: 1,
        size: 10,
        flag: 808,
        title: ""
      },
      groupData: {
        vehicle_ids: "",
        server_id: "",
        flag: 808
      },

      // 已绑定查询
      bindTableQuery: {
        page: 1,
        size: 20,
        RegionId: "",
        license: "",
        total: 0
      },
      // 未绑定查询
      unbindTableQuery: {
        page: 1,
        size: 20,
        RegionId: "",
        license: "",
        total: 0
      },
      leftCol: [{ prop: "license", label: "车牌号" }],
      rightCol: [{ prop: "license", label: "车牌号" }]
    };
  },
  watch: {
    "groupData.group_id": function() {
      this.renderBind();
      this.renderUnbind();
    },
    areaList: {
      handler: function() {
        this.renderUser();
      },
      deep: true
    }
  },
  methods: {
    bindSizeChange(val) {
      this.bindTableQuery.page = 1;
      this.bindTableQuery.size = val;
      this.renderBind();
    },
    bindcurrentChange(val) {
      this.bindTableQuery.page = val;
      this.renderBind();
    },
    unbindSizeChange(val) {
      this.unbindTableQuery.page = 1;
      this.unbindTableQuery.size = val;
      this.renderUnbind();
    },
    unbindcurrentChange(val) {
      this.unbindTableQuery.page = val;
      this.renderUnbind();
    },
    // 已绑定车辆搜索
    renderBind() {
      this.$set(this.$data, "leftList", []);
      // if (this.groupData.group_id) {
      var postData = Object.assign({}, this.bindTableQuery);
      GetRegionBindByPage(postData).then(res => {
        if (res.data.code == 0) {
          var arr = res.data.data.map(item => {
            item.parent = "left";
            return item;
          });
          this.$set(this.$data, "leftList", arr);
          this.bindTableQuery.total = res.data.total;
        } else {
          this.bindTableQuery.total = 0;
        }
      });
      // }
    },
    // 未绑定车辆搜索
    renderUnbind() {
      this.$set(this.$data, "rightList", []);
      // if (this.groupData.group_id) {
      GetRegionUnBindByPage(this.unbindTableQuery).then(res => {
        if (res.data.code == 0) {
          var arr = res.data.data.map(item => {
            item.parent = "right";
            return item;
          });
          this.$set(this.$data, "rightList", arr);
          this.unbindTableQuery.total = res.data.total;
        }
      });
      // }
    },
    // 左侧列表
    renderUser() {
      this.$set(this.$data, "area", []);
      GetRegionByPage(this.areaList).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "area", res.data.data);
          this.areaList.total = res.data.total;
        }
      });
    },
    //右到左
    onleft(items, next) {
      if (!this.currentUser.RegionId) {
        this.$message.warning("请选择车辆");
        next(false);
        return false;
      }
      this.groupData.vehicle_ids = "";
      this.groupData.RegionId = this.currentUser.RegionId;
      items.map(item => {
        this.groupData.vehicle_ids =
          this.groupData.vehicle_ids + item.vehicle_id + ",";
      });
      this.groupData.vehicle_ids = this.groupData.vehicle_ids.substring(
        0,
        this.groupData.vehicle_ids.lastIndexOf(",")
      );
      RegionBindVehicle(this.groupData)
        .then(res => {
          if (res.data.code == 0) {
            next(true);
            this.bindTableQuery.page = 1;
            this.unbindTableQuery.page = 1;
            this.renderBind();
            this.renderUnbind();
          } else {
            this.$message.error(res.data.msg);
            next(false);
          }
        })
        .catch(() => {
          next(false);
        });
    },
    //左到右
    onright(items, next) {
      if (!this.currentUser.RegionId) {
        this.$message.warning("请选择车辆");
        next(false);
        return false;
      }
      this.groupData.vehicle_ids = "";
      this.groupData.RegionId = this.currentUser.RegionId;
      items.map(item => {
        this.groupData.vehicle_ids =
          this.groupData.vehicle_ids + item.vehicle_id + ",";
      });
      this.groupData.vehicle_ids = this.groupData.vehicle_ids.substring(
        0,
        this.groupData.vehicle_ids.lastIndexOf(",")
      );
      RegionUnBindVehicle(this.groupData)
        .then(res => {
          if (res.data.code == 0) {
            next(true);
            this.renderBind();
            this.renderUnbind();
          } else {
            this.$message.error(res.data.msg);
            next(false);
          }
        })
        .catch(() => {
          next(false);
        });
    },
    changeUser(area) {
      this.currentUser = area;
      this.bindTableQuery.RegionId = area.RegionId;
      this.unbindTableQuery.RegionId = area.RegionId;
      this.renderBind();
      this.renderUnbind();
    },
    userPagerPrev() {
      if (isNaN(Number(parseInt(this.areaList.page)))) {
        this.areaList.page = 1;
      } else {
        if (this.areaList.page - 1 <= 0) {
          this.areaList.page = 1;
        } else {
          this.areaList.page = parseInt(this.areaList.page) - 1;
        }
      }
    },
    userPagerNext() {
      if (isNaN(Number(parseInt(this.areaList.page)))) {
        this.areaList.page = 1;
      } else {
        this.areaList.page = parseInt(this.areaList.page) + 1;
      }
    }
  }
};
</script>
<style lang="less">
.group-container {
  box-shadow: inset 5px 0 15px #eef0f3;
  padding: 22px;
  border-right: 1px solid #eaecf1;
  .select-group-cotainer {
    height: 100%;
    ._body {
      height: 100%;
    }
    ._tree {
      height: 100%;
    }
  }
  .select-group-cotainer ._tree .is-current > .el-tree-node__content {
    background: #1890ff;
    color: #fff;
  }
}
.full-box {
  height: 100%;
  .el-card__body {
    height: 100%;
  }
}

.bind-box {
  display: flex;
  margin: -20px;
  font-size: 14px;
  height: 100%;
}

.transfer-container {
  width: 100%;
  position: relative;
  margin: 20px;
}

.transfer-list {
  position: absolute;
  width: 100%;
  top: 40px;
  bottom: 40px;
}

.transfer-pager {
  position: absolute;
  width: 100%;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  height: 40px;
  .transfer-pager-item {
    padding-top: 3px;
    box-sizing: border-box;
    text-align: center;
    background: #f5f7fa;
    width: 40%;
  }
}

.transfer-filter {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-around;
  height: 40px;
  box-sizing: border-box;
  .transfer-filter-item {
    border: 1px solid #ebeef5;
    height: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 5px 0;
    text-align: center;
    background: #f5f7fa;
    width: 40%;
  }
}

.transfer-fiter {
  height: 50px;
  background: #f5f7fa;
}

.el-card__body {
  height: 100%;
}

.user-box {
  width: 300px;
  position: relative;
  border-right: 1px solid #ebeef5;
}

.user-header {
  height: 40px;
  line-height: 40px;
  background: #f5f7fa;
  margin: 0;
  padding-left: 15px;
  border-bottom: 1px solid #ebeef5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #000;
}

.user-load-more {
  background: #edf2f9;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 15px;
  border-top: 1px solid #e3e9f1;
  border-bottom: 1px solid #e3e9f1;
  cursor: pointer;
}

.user-filter {
  position: absolute;
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 4px;
  background: #edf2f9;
  z-index: 2;
  transition: all 0.2s;
  &.active {
    overflow: visibility;
    height: 115px;
  }
}

.user-pager {
  background: #f1f1f1;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 32px;
  line-height: 32px;
  text-align: center;
  .el-input__inner {
    text-align: center;
  }
}

.user-list {
  position: absolute;
  top: 100px;
  bottom: 32px;
  width: 100%;
  overflow: auto;
  ul,
  li {
    margin: 0;
    padding: 0;
  }
  li {
    height: 32px;
    line-height: 32px;
    overflow: hidden;
    list-style-type: none;
    box-sizing: border-box;
    padding: 0 15px;
  }
  li.active {
    color: #fff;
    background: #1890ff !important;
  }
  li:hover {
    background-color: #f5f7fa;
    cursor: pointer;
  }
}
</style>