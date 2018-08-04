<template>
  <div class="admin-table-container" style="position: absolute;left:0;right:0;bottom:0;top:107px;">
    <el-card shadow="always" class="full-box">
      <div class="bind-box">
        <div class="user-box">
          <div class="user-header">
            用户列表
          </div>
          <div class="user-filter" :class="{active:userFilterOpen}">
            <el-form :model="userTableQuery" size="small">
              <el-form-item>
                <el-input placeholder="公司/个人名称" size="small" v-model="userTableQuery.real_name">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-select v-model="userTableQuery.user_type" style="width:100%;">
                  <el-option value="1" label="个人用户"></el-option>
                  <el-option value="2" label="企业用户"></el-option>
                </el-select>
              </el-form-item>

            </el-form>

            <div class="user-load-more" @click="userFilterOpen=!userFilterOpen">
              <i class="el-icon-caret-bottom" v-if="!userFilterOpen"></i>
              <i class="el-icon-caret-top" v-if="userFilterOpen"></i>

            </div>
          </div>
          <ul class="user-list">
            <li v-for="user in userList" :key="user.user_id" @click="changeUser(user)" :class="{active:user==currentUser}"> {{user.real_name}}</li>
          </ul>
          <div class="user-pager">
            <el-input placeholder="页码" size="small" v-model="userTableQuery.page">
              <el-button slot="prepend" icon="el-icon-caret-left" @click="userPagerPrev()" :disabled="userPagerPrevState"></el-button>
              <el-button slot="append" icon="el-icon-caret-right" @click="userPagerNext()" :disabled="userPagerNextState"></el-button>
            </el-input>
          </div>
        </div>
        <div class="transfer-container">
          <div class="transfer-filter">
            <div class="transfer-filter-item">
              <el-form :inline="true" :model="userTableQuery" size="mini">
                <el-form-item>
                  <el-input placeholder="SIM卡号段开始" v-model="bindTableQuery.sim_no_begin">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-input placeholder="SIM卡号段结束" v-model="bindTableQuery.sim_no_end">
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
              <el-form :inline="true" :model="userTableQuery" size="mini">
                <el-form-item>
                  <el-input placeholder="SIM卡号段开始" v-model="unbindTableQuery.sim_no_begin">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-input placeholder="SIM卡号段结束" v-model="unbindTableQuery.sim_no_end">
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
            <admin-transfer @onLeft="onleft" :lists="list" :titles="titles" @onRight="onright" style="width:100%;height:100%;"></admin-transfer>
          </div>
          <div class="transfer-pager">
            <div class="transfer-pager-item">
              <el-pagination @size-change="bindSizeChange" @current-change="bindcurrentChange" :current-page="bindTableQuery.page" :page-sizes="[20, 50, 100,300,600,1000]" :page-size="bindTableQuery.size" :total="bindTableQuery.total" layout="total, sizes, prev,  next, jumper" background>
              </el-pagination>
            </div>
            <div style="width:100px;"></div>
            <div class="transfer-pager-item">
              <el-pagination @size-change="unbindSizeChange" @current-change="unbindcurrentChange" :current-page="unbindTableQuery.page" :page-sizes="[20, 50, 100,300,600,1000]" :page-size="unbindTableQuery.size" :total="unbindTableQuery.total" layout="total, sizes, prev,  next, jumper" background>
              </el-pagination>
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
  getUserList,
  getUserSim,
  getSimAllUnbind,
  addUserSim,
  delUserSim
} from "@/api/index.js";
import adminTransfer from "@/components/transfer.vue";
export default {
  created() {
    this.renderUser();
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
      userTableQuery: {
        user_type: "",
        real_name: "",
        size: 20,
        page: 1
      },
      bindTableQuery: {
        sim_no_begin: "",
        sim_no_end: "",
        size: 20,
        page: 1,
        total: 0
      },
      unbindTableQuery: {
        sim_no_begin: "",
        sim_no_end: "",
        size: 20,
        page: 1,
        total: 0
      },
      currentUser: {},
      titles: ["", "未绑定SIM卡"],
      userList: [],
      leftList: [],
      rightList: []
    };
  },
  watch: {
    userTableQuery: {
      handler: function() {
        this.renderUser();
      },
      deep: true
    }
  },
  props: ["user_type"], //来自router的user_type 根据user_type 区分公司和个人
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
    renderBind() {
      this.$set(this.$data, "leftList", []);
      if (this.currentUser.user_id) {
        var postData = Object.assign({}, this.bindTableQuery);
        postData.user_id = this.currentUser.user_id;
        getUserSim(postData).then(res => {
          this.rightValues = [];
          if (res.data.code == 0) {
            var arr = [];
            res.data.data.map(item => {
              arr.push({
                parent: "left",
                key: item.sim_no,
                label: item.sim_no
              });
            });
            this.$set(this.$data, "leftList", arr);
            this.bindTableQuery.total = res.data.total;
          } else {
            this.bindTableQuery.total = 0;
          }
        });
      }
    },
    renderUnbind() {
      getSimAllUnbind(this.unbindTableQuery).then(res => {
        if (res.data.code == 0) {
          var arr = [];
          res.data.data.map(item => {
            arr.push({
              parent: "right",
              key: item.sim_no,
              label: item.sim_no
            });
          });
          this.$set(this.$data, "rightList", arr);
          this.unbindTableQuery.total = res.data.total;
        }
      });
    },
    renderUser() {
      this.$set(this.$data, "userList", []);
      getUserList(this.userTableQuery).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "userList", res.data.data);
          this.userTableQuery.total = res.data.total;
        }
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
    },
    onleft(items, next) {
      //右到左
      if (!this.currentUser.user_id) {
        this.$message.warning("请选择一个用户！");
        next(false);
        return false;
      }
      var postData = {
        user_id: this.currentUser.user_id,
        sim_nos: []
      };
      items.map(item => {
        postData.sim_nos.push(item.key);
      });
      postData.sim_nos = postData.sim_nos.join(",");
      addUserSim(postData)
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
    onright(items, next) {
      //左到右
      var postData = {
        user_id: this.currentUser.user_id,
        sim_nos: []
      };
      items.map(item => {
        postData.sim_nos.push(item.key);
      });
      postData.sim_nos = postData.sim_nos.join(",");
      delUserSim(postData)
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
    changeUser(user) {
      this.titles[0] = user.real_name;
      this.currentUser = user;
      this.renderBind();
      this.renderUnbind();
    }
  },

  components: { adminTransfer }
};
</script>
<style lang="less">
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
    color: #1890ff;
    background: #fff;
  }
}
</style>