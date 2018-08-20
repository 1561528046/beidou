<template>
  <div class="admin-table-container" style="position: absolute;left:0;right:0;bottom:0;top:107px;">
    <el-card shadow="always" class="full-box">
      <div class="bind-box">
        <div class="user-box">
          <div class="user-header">
            产品列表
          </div>
          <div class="user-filter" :class="{active:userFilterOpen}">
            <el-form :model="userTableQuery" size="small">
              <el-form-item>
                <el-input placeholder="产品名称" size="small" v-model="userTableQuery.real_name">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </el-form-item>
            </el-form>
            <!-- 搜索下拉框 -->
            <!-- <div class="user-load-more" @click="userFilterOpen=!userFilterOpen">
              <i class="el-icon-caret-bottom" v-if="!userFilterOpen"></i>
              <i class="el-icon-caret-top" v-if="userFilterOpen"></i>
            </div> -->
          </div>
          <!-- 渲染产品列表 -->
          <!-- @click="changeUser(user)" :class="{active:user.user_id==currentUser.user_id}" -->
          <ul class=user-list>
            <li v-for="product in productlist" @click="changeUser(product)" :key="product.package_id">{{product.title}}</li>
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
                  <el-input placeholder="产品名称" v-model="bindTableQuery.sim_no_begin">
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
                  <el-input placeholder="用户名" v-model="unbindTableQuery.sim_no_begin">
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
            <admin-transfer @onLeft="onleft" :lists="list" :titles="titles" @onRight="onright" :leftCol="leftCol" :rightCol="rightCol" style="width:100%;height:100%;"></admin-transfer>
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
  // getUserSim,
  // getSimAllUnbind,
  addUserSim,
  delUserSim,
  getProductList
} from "@/api/index.js";
import adminTransfer from "@/components/transfer.vue";
export default {
  created() {
    this.renderProduct();
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
      titles: ["请选择产品", "未绑定用户"],
      userList: [],
      productlist: [],
      leftList: [],
      rightList: [],
      leftCol: [
        { prop: "sim_no", label: "SIM卡号" },
        { prop: "icc_id", label: "ICCID" },
        { prop: "belong", label: "所属运营商" }
      ],
      rightCol: [
        { prop: "sim_no", label: "SIM卡号" },
        { prop: "icc_id", label: "ICCID" },
        { prop: "belong", label: "所属运营商" }
      ]
    };
  },
  watch: {
    userTableQuery: {
      handler: function() {
        this.renderProduct();
      },
      deep: true
    }
  },
  props: ["user_type"], //来自router的user_type 根据user_type 区分公司和个人
  methods: {
    // 分页
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
    // 分页结束
    renderBind() {
      this.leftList = [{ sim_no: "12345", iccid: "6789", belong: "河北" }];
      console.log(this.leftList);
      // this.$set(this.$data, "leftList", []);
      // if (this.currentUser.user_id) {
      //   var postData = Object.assign({}, this.bindTableQuery);
      //   postData.user_id = this.currentUser.user_id;
      //   getUserSim(postData).then(res => {
      //     this.rightValues = [];
      //     if (res.data.code == 0) {
      //       var arr = res.data.data.map(item => {
      //         item.parent = "left";
      //         return item;
      //       });
      //       this.$set(this.$data, "leftList", arr);
      //       this.bindTableQuery.total = res.data.total;
      //     } else {
      //       this.bindTableQuery.total = 0;
      //     }
      //   });
      // }
    },
    renderUnbind() {
      this.rightList = [{ sim_no: "12345", iccid: "6789", belong: "廊坊" }];
      // getSimAllUnbind(this.unbindTableQuery).then(res => {
      //   if (res.data.code == 0) {
      //     var arr = res.data.data.map(item => {
      //       item.parent = "right";
      //       return item;
      //     });
      //     this.$set(this.$data, "rightList", arr);
      //     this.unbindTableQuery.total = res.data.total;
      //   }
      // });
    },
    //产品列表
    renderProduct() {
      this.$set(this.$data, "productlist", []);
      getProductList(this.userTableQuery).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "productlist", res.data.data);
          this.userTableQuery.total = res.data.total;
        }
      });
    },
    //分页左右箭头
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
    //分页左右箭头结束
    // 左右穿梭箭头
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
        postData.sim_nos.push(item.sim_no);
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
        postData.sim_nos.push(item.sim_no);
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
    // 左右穿梭箭头结束
    // 列表单独项点击事件
    changeUser(product) {
      this.titles[0] = product.title;
      this.currentUser = product;
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