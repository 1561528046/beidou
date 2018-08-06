<template>
    <div class="admin-table-container">
        <el-card shadow="always" class="admin-table-search">
            <el-form :model="tableQuery" label-width="150px" label-position="left" class="table-search" size="small">
                <el-row :gutter="30">
                    <el-col :span="6">
                        <el-form-item label="司机身份识别卡编号">
                            <el-input v-model="tableQuery.driver_card_id" maxlength="10"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="司机姓名">
                            <el-input v-model="tableQuery.driver_name" placeholder="司机姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="身份证号">
                            <el-input v-model="tableQuery.identity_id" placeholder="身份证号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="isCollapse?24:6" style="text-align: right;">
                        <el-form-item>
                            <!-- <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
                            <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button> -->
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
            </div>
            <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
                <el-table-column prop="driver_card_id" label="司机卡编号" :formatter="$utils.baseFormatter"></el-table-column>
                <el-table-column prop="driver_name" label="姓名" :formatter="$utils.baseFormatter"></el-table-column>
                <el-table-column prop="tel" label="联系电话" :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column prop="license_validity" label="驾驶证有效期" :formatter="(row)=>{return $utils.formatDate(row.license_validity)}">
                </el-table-column>
                <el-table-column prop="identity_id" label="身份证 " :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="updateForm(scope)" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="small" type="primary" icon="el-icon-edit">绑定车辆</el-button>
                        <el-button size="small" icon="el-icon-delete" @click="delRow(scope)">删除</el-button>
                    </template>
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
import { getDriverList, delDriver } from "@/api/index.js";
import driver_add from "./add.vue";
import driver_update from "./update.vue";
export default {
  created() {
    this.getTable();
    this.keyupSubmit();
  },
  data() {
    return {
      isCollapse: false,
      tableQuery: {
        driver_name: "",
        driver_card_id: "",
        identity_id: "",
        size: 10,
        page: 1
      },
      tableData: {
        total: 0,
        data: []
      },
      tableLoading: true,
      addKey: 0
    };
  },
  methods: {
    delRow(scope) {
      //删除
      this.$confirm("确认删除？")
        .then(() => {
          delDriver(scope.row).then(res => {
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
    addFrom() {
      //添加
      var vNode = this.$createElement(driver_add, {
        key: this.addKey++,
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
        title: "添加司机",
        closeOnClickModal: false, //是否可通过点击遮罩关闭 MessageBox
        closeOnPressEscape: false, //是否可通过按下 ESC 键关闭 MessageBox
        message: vNode
      }).catch(() => {});
    },
    updateForm(scope) {
      //编辑
      var vNode = this.$createElement(driver_update, {
        key: this.addKey++,
        props: {
          driver_card_id: scope.row.driver_card_id
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
        title: "编辑司机",
        closeOnClickModal: false, //是否可通过点击遮罩关闭 MessageBox
        closeOnPressEscape: false, //是否可通过按下 ESC 键关闭 MessageBox
        message: vNode
      }).catch(() => {});
    },
    //回车时间
    keyupSubmit() {
      document.onkeydown = e => {
        console.log(e);
        let _key = window.event.keyCode;
        if (_key === 13) {
          this.getTable();
        }
      };
    },
    getTable() {
      //获取列表
      this.tableLoading = true;
      var query = Object.assign({}, this.tableQuery);
      getDriverList(query)
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
    handleSizeChange(val) {
      //每页数量切换
      this.tableQuery.page = 1;
      this.tableQuery.limit = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      //翻页
      this.tableQuery.page = val;
      this.getTable();
    }
  },
  components: { driver_add, driver_update }
};
</script>
<style>
.flip-list-move {
  transition: transform 1s;
}
</style>