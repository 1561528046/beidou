<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">

      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="产品名称">
              <select-product v-model="tableQuery.package_id" style="width:100%;" :clearable="true" :pro="pro"></select-product>
            </el-form-item>
          </el-col>
          <el-col :offset="isCollapse?0:6" :span="isCollapse?24:10" style="text-align: right;">
            <el-form-item>
              <!-- <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button> -->
              <!-- <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button> -->
              <el-button type="primary" @click="getTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <div class="admin-table-actions">
        <el-button type="primary" size="small" @click="addFrom">
          <i class="el-icon-upload el-icon--right"></i> 添加
        </el-button>
        <router-link :to="{name:'product-binding'}" style="margin-left: 15px;">
          <el-button type="primary" size="mini" style="padding-top: 6px;padding-bottom: 9px;">
            <i class="iconfont icon-team"></i> 分配用户
          </el-button>
        </router-link>
        <!-- <router-link :to="{name:'product-add'}">
          <el-button type="primary" size="small">
            <i class="el-icon-upload el-icon--right"></i> 添加
          </el-button>
        </router-link> -->
        <!-- <el-button type="primary" size="small">导出
                    <i class="el-icon-upload el-icon--right"></i>
                </el-button> -->
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="title" label="产品名称" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column width="300" label="操作">
          <template slot-scope="scope">
            <router-link :to="{name:'product-update',params:{id:scope.row.package_id}}">
              <el-button type="primary" size="small">
                <i class="el-icon-upload el-icon--right"></i> 授权详情
              </el-button>
            </router-link>
            <el-button style="margin-left:15px;" size="small" icon="el-icon-delete" @click="delFrom(scope)">删除</el-button>
          </template>
          <!-- <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="$router.push({name: 'company-update',params:{company_id:scope.row.company_id}})">
                            编辑
                        </el-button>
                    </template> -->
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
/* eslint-disable */
import {
  getDeviceCompanyList,
  getDeviceCompanyAll,
  getProductList,
  delProduct
} from "@/api/index.js";
import selectCompanytype from "@/components/select-companytype.vue";
import selectProduct from "@/components/select-product.vue";
import addProduct from "./add.vue";
import updateComponents from "./update.vue";
export default {
  created() {
    this.getTable();
    this.keyupSubmit();
  },
  data() {
    return {
      pro: 0,
      isCollapse: false,
      tableQuery: {
        package_id: "", //收费套餐id
        title: "", //收费套餐名称
        size: 10,
        page: 1
      },
      simss: [],
      simee: {},
      tableData: {
        total: 0,
        data: []
      },
      tableLoading: true,
      addKey: 0,
      userdetailShow: false,
      restaurants: [],
      state1: "",
      state2: ""
    };
  },
  mounted() {
    this.restaurants = this.loadAll();
  },
  methods: {
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = 20;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.getTable();
    },
    //删除产品
    delFrom(scope) {
      this.$confirm("确认删除？")
        .then(() => {
          delProduct({ package_id: scope.row.package_id }).then(res => {
            if (res.data.code == 0) {
              this.$message.success(res.data.msg);
              this.getTable();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    //添加产品
    addFrom() {
      var vNode = this.$createElement(addProduct, {
        key: this.addKey++,
        on: {
          success: () => {
            this.pro++;
            this.getTable();
            this.$msgbox.close();
          },
          error: function() {}
        }
      });
      this.$msgbox({
        showConfirmButton: false, //是否显示确定按钮
        customClass: "admin-message-forms",
        title: "添加",
        closeOnClickModal: false, //是否可通过点击遮罩关闭 MessageBox
        closeOnPressEscape: false, //是否可通过按下 ESC 键关闭 MessageBox
        message: vNode
      });
    },
    //编辑产品
    updateForm(scope) {
      var vNode = this.$createElement(updateComponents, {
        key: this.addKey++,
        props: {
          company_id: scope.row.company_id
        },
        on: {
          success: () => {
            this.getTable();
            this.$msgbox.close();
          },
          error: function() {}
        }
      });
      this.$msgbox({
        showConfirmButton: false, //是否显示确定按钮
        customClass: "admin-message-form",
        title: "编辑",
        closeOnClickModal: false, //是否可通过点击遮罩关闭 MessageBox
        closeOnPressEscape: false, //是否可通过按下 ESC 键关闭 MessageBox
        message: vNode
      });
    },
    //查询产品列表
    getTable() {
      this.tableLoading = true;
      var query = Object.assign({}, this.tableQuery);
      getProductList(query)
        .then(res => {
          if (res.data.code == 0) {
            this.$set(this.$data, "tableData", res.data);
          } else {
            this.$set(this.$data, "tableData", []);
            this.$message.error(res.data.msg);
          }
          this.tableLoading = false;
        })
        .catch(() => {});
    },
    //回车事件
    keyupSubmit() {
      document.onkeydown = e => {
        let _key = window.event.keyCode;
        if (_key === 13) {
          this.getTable();
        }
      };
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    loadAll() {
      getDeviceCompanyAll().then(res => {
        if (res.data.code == 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].real_name !== "") {
              this.simss.push({
                value: res.data.data[i].company_name,
                address: res.data.data[i].company_id
              });
            }
          }
        }
      });
      return this.simss;
    },
    handleSelect(item) {
      this.simee = { value: item.value, address: item.address };
      this.getTable();
    },
    handleClick() {
      alert("button click");
    },
    filterTag(value, row) {
      return row.tag === value;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.getTable();
    }
  },
  components: { selectCompanytype, selectProduct }
};
</script>