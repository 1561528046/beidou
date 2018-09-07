<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small" @submit.native.prevent>
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="添加时间" label-width="82px">
              <el-date-picker value-format="yyyyMMdd" v-model="dateRange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="ICCID卡号">
              <el-input v-model="tableQuery.icc_id" placeholder="ICCID卡号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SIM卡号">
              <el-input v-model="tableQuery.sim_no" placeholder="SIM卡号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="所属运营商" label-width="82px">
              <el-input v-model="tableQuery.belong" placeholder="所属运营商"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="分配用户">
              <el-autocomplete style="width: 100%;" class="inline-input" v-model="tableQuery.real_name" :fetch-suggestions="realNameQuerySearch" placeholder="请输入内容" :trigger-on-focus="false" @select="realNameHandleSelect">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="isCollapse?18:6" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
              <el-button type="primary" @click="getTable" native-type="submit" :loading="tableLoading">查询</el-button>
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
        <router-link :to="{name:'sim-binding'}" style="margin-left: 15px;">
          <el-button type="primary" size="small">
            <i class="el-icon-upload el-icon--right"></i> SIM卡绑定管理
          </el-button>
        </router-link>
        <el-dropdown>
          <el-button size="small" style="margin-left: 15px;" type="primary">
            批量上传
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style="padding:2px 15px;">
              <el-upload action="medium " accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                                    application/vnd.ms-excel " :show-file-list="false " :http-request="uploadFunc " class="o-el-upload--text">
                <!-- <i class="el-icon-upload el-icon--right"></i> 点击上传 -->
                <el-button size="small" icon="el-icon-upload2" type="primary" style="display: block;width:100%;">点击上传</el-button>
              </el-upload>
            </el-dropdown-item>
            <el-dropdown-item style="padding:2px 15px;">
              <a href="/static/SIM卡导入模板.xls" download target="_blank" type="primary " class="el-button el-button--small el-button--primary" style=" display: block;">
                <i class="el-icon-download"></i> 模版下载
              </a>

            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </div>
      <el-table :data="tableData.data " v-loading="tableLoading " style="width: 100% " class="admin-table-list">
        <el-table-column prop="time " label="添加时间 " :formatter="(row)=>{return this.$utils.formatDate(row.time)}"></el-table-column>
        <el-table-column prop="icc_id" label="ICCID" :formatter="$utils.baseFormatter">
        </el-table-column>
        <el-table-column prop="sim_no" label="Sim卡号" :formatter="$utils.baseFormatter">
        </el-table-column>
        <el-table-column prop="belong" label="所属运营商" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="real_name" label="分配用户" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="state" label="当前状态" :formatter="(row)=>{return this.$dict.get_sim_state(row.state)}"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="updateForm(scope)" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="small" icon="el-icon-delete" @click="delRow(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </el-card>
    <el-dialog width="29%" title="添加" :visible.sync="addDialog " :append-to-body="true " :close-on-click-modal="false " :close-on-press-escape="false " :center="true " class="admin-dialog">
      <add-sim @success=" ()=> {this.getTable();this.addDialog = false;}" :key="addKey"></add-sim>
    </el-dialog>
    <el-dialog width="29%" title="编辑" :visible.sync="updateDialog " :append-to-body="true " :close-on-click-modal="false " :close-on-press-escape="false " :center="true " class="admin-dialog">
      <update-sim :sim_no="updateId" @success=" ()=> {this.getTable();this.updateDialog = false;this.updateId=''}" :key="addKey"></update-sim>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import { getSimList, delSim, getUserAll } from "@/api/index.js";
import selectUser from "@/components/select-user.vue";
import addSim from "./add.vue";
import updateSim from "./update.vue";
export default {
  components: { selectUser, addSim, updateSim },
  created() {
    this.getTable();
  },
  data() {
    return {
      addDialog: false,
      updateDialog: false,
      updateId: "",
      addKey: 0,
      isCollapse: false,
      dateRange: "",
      tableQuery: {
        sim_no: "",
        state: "",
        belong: "",
        icc_id: "",
        user_id: "",
        startDate: "",
        endDate: "",
        size: 10,
        real_name: "",
        page: 1
      },
      tableData: {
        total: 0,
        data: []
      },
      tableLoading: true,
      addKey: 0,
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  watch: {
    dateRange: function(arr) {
      arr = arr || ["", ""];
      this.tableQuery.start_date = arr[0];
      this.tableQuery.end_date = arr[1];
    },
    "tableQuery.real_name": function() {
      this.tableQuery.user_id = "";
    }
  },
  methods: {
    //输入选择框
    realNameQuerySearch(queryString, cb) {
      var results = [];
      getUserAll({ real_name: queryString })
        .then(res => {
          if (res.data.code == 0) {
            res.data.data.map(item => {
              item.value = item.real_name;
            });
            results = res.data.data;
          }
          cb(results);
        })
        .catch(() => {
          cb([]);
        });
      // 调用 callback 返回建议列表的数据
    },
    realNameHandleSelect(item) {
      this.$nextTick(() => {
        this.tableQuery.user_id = item.user_id || "";
      });
    },
    //结束
    uploadFunc(uploadObj) {
      var formData = new FormData();
      formData.append("ff", uploadObj.file);
      this.$ajax
        .post("/public/UploadExcel", formData, {
          params: { table: 1 }
        })
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: res.data.msg,
              type: "success",
              duration: 5000
            });
            this.getTable();
          } else {
            this.$notify.error({
              title: "导入失败",
              message: res.data.msg
            });
            // this.$message.error(res.data.msg);
          }
        })
        .catch((err, a) => {
          this.$message.error("接口错误，错误码：" + err.response.status);
        });
    },
    //删除
    delRow(scope) {
      this.$confirm("确认删除？")
        .then(() => {
          delSim({ id: scope.row.sim_no }).then(res => {
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
    //添加sim卡
    addFrom() {
      this.addKey++;
      this.addDialog = true;
    },
    //编辑sim卡
    updateForm(scope) {
      this.addKey++;
      this.updateDialog = true;
      this.updateId = scope.row.sim_no;
    },
    //列表查询
    getTable() {
      this.tableLoading = true;
      if (this.tableQuery.real_name == "") {
        this.tableQuery.user_id = "";
      }
      getSimList(this.tableQuery)
        .then(res => {
          if (res.data.code == 0) {
            this.$set(this.$data, "tableData", res.data);
          } else {
            this.$set(this.$data, "tableData", []);
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
    // 分页
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.getTable();
    }
  }
};
</script>
<style>
.o-el-upload--text .el-upload--text {
  display: block;
}
</style>