<template>
  <div class="admin-table-container" style="position: absolute;left:0;right:0;bottom:0;top:107px;">
    <el-card shadow="always" class="full-box">
      <div class="bind-box">
        <div class="transfer-container">
          <div class="transfer-filter">
            <div class="transfer-filter-item">
              <el-form :inline="true" :model="bindTableQuery" size="mini">
                <el-form-item>
                  <el-input placeholder="车牌号" v-model="bindTableQuery.license">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-input placeholder="用户" v-model="bindTableQuery.owner">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-form-item>
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
                <el-form-item>
                  <el-input placeholder="用户" v-model="unbindTableQuery.owner">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-form-item>
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
  getUserVehicleBindByPage, //用户已绑定车辆列表
  getUserVehicleUnBindByPage, //用户未绑定车辆列表
  bindUserVehicle, //用户绑定车辆
  unBindUserVehicle, //用户解绑车辆
  GetServerByPage,
  GetServerBindByPage, // 808或809已绑定车辆分页查询
  GetServerUnBindByPage, // 808或809未绑定车辆分页查询
  ServerBindVehicle, //808或809绑定车辆
  ServerUnBindVehicle //808或808解绑车辆
} from "@/api/index.js";
import adminTransfer from "@/components/transfer.vue";
import selectGroup from "@/components/select-group/select-group.vue";
export default {
  components: { adminTransfer, selectGroup },
  created() {
    this.bindTableQuery.user_id = this.$route.params.id;
    this.unbindTableQuery.user_id = this.$route.params.id;
    this.renderBind();
    this.renderUnbind();
  },
  computed: {
    list: function() {
      return this.leftList.concat(this.rightList);
    },
    userPagerNextState: function() {
      return !(
        this.userTableQuery.total -
          this.userTableQuery.page * this.userTableQuery.size >
        0
      );
    },
    userPagerPrevState: function() {
      return !(this.userTableQuery.page > 1);
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
      groupData: {
        vehicle_ids: "",
        server_id: "",
        flag: 809
      },
      userTableQuery: {
        real_name: "",
        size: 20,
        page: 1
      },
      // 已绑定查询
      bindTableQuery: {
        page: 1,
        size: 20,
        user_id: "",
        license: "",
        owner: ""
      },
      // 未绑定查询
      unbindTableQuery: {
        page: 1,
        size: 20,
        user_id: "",
        license: "",
        owner: ""
      },
      leftCol: [{ prop: "license", label: "车牌号" }],
      rightCol: [{ prop: "license", label: "车牌号" }]
    };
  },
  watch: {},
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
      var postData = Object.assign({}, this.bindTableQuery);
      getUserVehicleBindByPage(postData).then(res => {
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
    },
    // 未绑定车辆搜索
    renderUnbind() {
      this.$set(this.$data, "rightList", []);
      getUserVehicleUnBindByPage(this.unbindTableQuery).then(res => {
        if (res.data.code == 0) {
          var arr = res.data.data.map(item => {
            item.parent = "right";
            return item;
          });
          this.$set(this.$data, "rightList", arr);
          this.unbindTableQuery.total = res.data.total;
        }
      });
    },
    //右到左
    onleft(items, next) {
      var vehicle_ids = "";
      var data = {};
      items.map(item => {
        vehicle_ids = vehicle_ids + item.vehicle_id + ",";
      });
      vehicle_ids = vehicle_ids.substring(0, vehicle_ids.lastIndexOf(","));
      data = {
        vehicle_ids: vehicle_ids,
        user_id: this.unbindTableQuery.user_id
      };
      bindUserVehicle(data)
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
      var vehicle_ids = "";
      var data = {};
      items.map(item => {
        vehicle_ids = vehicle_ids + item.vehicle_id + ",";
      });
      vehicle_ids = vehicle_ids.substring(0, vehicle_ids.lastIndexOf(","));
      data = {
        vehicle_ids: vehicle_ids,
        user_id: this.unbindTableQuery.user_id
      };
      unBindUserVehicle(data)
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
    userPagerPrev() {
      if (isNaN(Number(parseInt(this.userTableQuery.page)))) {
        this.userTableQuery.page = 1;
      } else {
        if (this.userTableQuery.page - 1 <= 0) {
          this.userTableQuery.page = 1;
        } else {
          this.userTableQuery.page = parseInt(this.userTableQuery.page) - 1;
        }
      }
    },
    userPagerNext() {
      if (isNaN(Number(parseInt(this.userTableQuery.page)))) {
        this.userTableQuery.page = 1;
      } else {
        this.userTableQuery.page = parseInt(this.userTableQuery.page) + 1;
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