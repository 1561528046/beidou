<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">

      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="添加时间">
              <el-date-picker value-format="yyyyMMdd" v-model="dateRange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="终端ID">
              <el-input v-model="tableQuery.device_id" placeholder="终端ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SIM ID">
              <el-input v-model="tableQuery.sim_id" placeholder="SIM ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="终端类型">
              <select-devicetype style="width: 100%;" v-model="tableQuery.device_type"></select-devicetype>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="终端厂商">
              <select-company v-model="tableQuery.company_id" style="width:100%;" :clearable="true"></select-company>
            </el-form-item>
          </el-col>

          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="分配用户">
              <select-user v-model="tableQuery.user_id" style="width:100%;" :clearable="true"></select-user>
              <!-- <el-autocomplete style="width: 100%;" class="inline-input" v-model="tableQuery.real_name" :fetch-suggestions="querySearch"
                placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect">
              </el-autocomplete> -->
            </el-form-item>
          </el-col>
          <el-col :span="isCollapse?24:6" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
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
        <router-link :to="{name:'device-binding'}" style="margin-left: 15px;">
          <el-button type="primary" size="small">
            <i class="el-icon-upload el-icon--right"></i> 设备绑定管理
          </el-button>
        </router-link>
        <el-dropdown>
          <el-button size="small" style="margin-left: 15px;" type="primary">
            批量上传
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item style="padding:2px 15px;">
              <el-button size="small" icon="el-icon-upload2" type="primary" style="display: block;width:100%;" @click="openUpload">点击上传</el-button>
              <!-- <el-upload action="medium " accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                            application/vnd.ms-excel " :show-file-list="false " :http-request="uploadFunc " class="o-el-upload--text">
                <el-button size="small" icon="el-icon-upload2" type="primary" style="display: block;width:100%;">点击上传</el-button>
              </el-upload> -->
            </el-dropdown-item>
            <el-dropdown-item style="padding:2px 15px;">
              <a href="/static/设备导入模板.xls" download target="_blank" type="primary " class="el-button el-button--small el-button--primary" style=" display: block;">
                <i class="el-icon-download"></i> 模版下载
              </a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="time" label="添加时间" :formatter="(row)=>{return this.$utils.formatDate(row.time)}"></el-table-column>
        <el-table-column prop="device_type" label="终端类型" :formatter="(row)=>{return this.$dict.get_device_type(row.device_type)}">
        </el-table-column>
        <el-table-column prop="company_name" label="终端厂商" :formatter="$utils.baseFormatter" show-overflow-tooltip></el-table-column>
        <el-table-column prop="device_no" label="终端ID"></el-table-column>
        <el-table-column prop="sim_id" label="SIM ID" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="protocol_type" label="协议类型" :formatter="(row)=>{return this.$dict.get_protocol_type(row.protocol_type)}">
        </el-table-column>
        <el-table-column prop="real_name" label="分配用户" :formatter="$utils.baseFormatter">
        </el-table-column>
        <el-table-column prop="state" label="状态" :formatter="(row)=>{return this.$dict.get_device_state(row.state)}"></el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="updateForm(scope)" icon="el-icon-edit">编辑</el-button>
            <el-button size="small" :disabled="scope.row.disabled" :type="buttontype(scope)" @click="repair_addFrom(scope)">
              <i class="el-icon-upload el-icon--right"></i>设备维修</el-button>
            <el-button size="small" @click="delRow(scope)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="添加" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
      <add-device :parent_id="parent_id" @success=" () => {this.getTable();this.addDialog = false;}" :key="addKey"></add-device>
    </el-dialog>
    <el-dialog title="编辑 " :visible.sync="updateDialog " :append-to-body="true " :close-on-click-modal="false " :close-on-press-escape="false " :center="true " class="admin-dialog">
      <update-device :device_id="updateId " @success=" ()=> {this.getTable();this.updateDialog = false;this.updateId = '';}" :key="addKey"></update-device>
    </el-dialog>
    <el-dialog title="添加维修设备信息" :visible.sync="repairDialog " :append-to-body="true " :close-on-click-modal="false " :close-on-press-escape="false " :center="true " class="admin-dialog">
      <repair-add :device_id="repairId " @success=" ()=> {this.getTable();this.repairDialog = false;this.repairId = '';}" :key="addKey"></repair-add>
    </el-dialog>
    <el-dialog width="21%" title="上传" :visible.sync="uploadDialog " :append-to-body="true " :close-on-click-modal="false " :close-on-press-escape="false " :center="true " class="admin-dialog">
      <device-upload @success=" ()=> {this.getTable();this.uploadDialog = false;}" :key="addKey"></device-upload>
    </el-dialog>
  </div>
</template>
<script>
import selectCompany from "@/components/select-company.vue";
import selectUser from "@/components/select-user.vue";
import selectDevicetype from "@/components/select-devicetype.vue";
import selectDevice from "@/components/select-device.vue";
import addDevice from "./add.vue";
import repairAdd from "./repair_add.vue";
import updateDevice from "./update.vue";
import deviceUpload from "./upload.vue";
import { getDeviceList, delDevice } from "@/api/index.js";
export default {
  components: {
    deviceUpload,
    addDevice,
    updateDevice,
    selectCompany,
    selectUser,
    selectDevicetype,
    selectDevice,
    repairAdd
  },
  created() {
    this.getTable();
    this.keyupdown();
  },
  data() {
    return {
      addDialog: false,
      parent_id: "",
      updateDialog: false,
      updateId: "",
      repairDialog: false,
      repairId: "",
      uploadDialog: false,
      isCollapse: false,
      dateRange: "",
      tableQuery: {
        device_type: "",
        device_id: "",
        company_name: "",
        company_id: "",
        real_name: "",
        user_id: "",
        sim_id: "",
        start_date: "",
        end_date: "",
        state: "",
        size: 10,
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
    // 拆分时间段
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
    //上传
    openUpload() {
      this.addKey++;
      this.uploadDialog = true;
    },
    //删除设备
    delRow(scope) {
      this.$confirm("确认删除？")
        .then(() => {
          delDevice({ device_id: scope.row.device_id }).then(res => {
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
    //添加设备
    addFrom(scope) {
      this.addKey++;
      this.addDialog = true;
      this.parent_id = scope.row ? scope.row.device_id : 1;
    },
    //编辑设备
    updateForm(scope) {
      this.updateDialog = true;
      this.updateId = scope.row.device_id;
      this.addKey++;
    },
    //获取设备列表
    getTable() {
      this.tableLoading = true;
      if (this.tableQuery.real_name == "") {
        this.tableQuery.user_id = "";
      }
      var query = Object.assign({}, this.tableQuery);
      getDeviceList(query)
        .then(res => {
          if (res.data.code == 0) {
            this.$set(this.$data, "tableData", res.data);
            for (var i = 0; i < this.tableData.data.length; i++) {
              if (
                this.tableData.data[i].state == 3 ||
                this.tableData.data[i].state == 4
              ) {
                this.tableData.data[i].disabled = true;
              } else {
                this.tableData.data[i].disabled = false;
              }
            }
          } else {
            this.$set(this.$data, "tableData", []);
            this.$message.error(res.data.msg);
          }
          this.tableLoading = false;
        })
        .catch(() => {});
    },
    //维修设备添加
    repair_addFrom(scope) {
      this.repairDialog = true;
      this.repairId = scope.row.device_id;
      this.addKey++;
    },
    // 按钮样式
    buttontype(scope) {
      if (scope.row.state == 1) {
        return "primary";
      }
      return "info";
    },
    //回车事件
    keyupdown() {
      document.onkeydown = () => {
        let _key = window.event.keyCode;
        if (_key === 13) {
          this.getTable();
        }
      };
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
    },
    uploadSuccess() {},
    uploadError() {
      alert(1);
    },
    uploadProgress() {}
  }
};
</script>