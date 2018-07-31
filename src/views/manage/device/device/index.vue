<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">

      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="设备类型">
              <select-devicetype style="width: 100%;" v-model="tableQuery.device_type"></select-devicetype>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="84px" label="设备序列号">
              <el-input v-model="tableQuery.device_no"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备厂商">
              <select-company v-model="tableQuery.company_id" style="width:100%;"></select-company>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="simid">
              <el-input v-model="tableQuery.sim_id"></el-input>
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
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <!-- <el-table-column prop="device_id" label="设备Id">
        </el-table-column> -->
        <el-table-column prop="device_type" label="设备类型" :formatter="(row)=>{return this.$dict.get_device_type(row.device_type)}">
        </el-table-column>
        <el-table-column prop="device_no" label="设备序列号" :formatter="$utils.baseFormatter"> </el-table-column>
        <!-- <el-table-column prop="company_id" label="设备厂家Id"></el-table-column> -->
        <el-table-column prop="company_name" label="设备厂商" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="sim_id" label="simid" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="protocol_type" label="协议类型" :formatter="(row)=>{return this.$dict.get_protocol_type(row.protocol_type)}">
        </el-table-column>
        <!-- <el-table-column prop="install_date" label="安装日期"></el-table-column> -->
        <el-table-column prop="camera_num" label="摄像头数量" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="save_media" label="存储介质" :formatter="(row)=>{return this.$dict.get_save_media(row.save_media)}"></el-table-column>
        <el-table-column prop="state" label="状态" :formatter="(row)=>{return this.$dict.get_state(row.state)}"></el-table-column>
        <el-table-column prop="time" label="添加时间" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="updateForm(scope)" icon="el-icon-edit">编辑</el-button>
            <el-button size="small" @click="delRow(scope)" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]"
          :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
  import selectDevicetype from "@/components/select-devicetype.vue";
  import selectProtocoltype from "@/components/select-protocoltype.vue";
  import selectCompany from "@/components/select-company.vue"
  import device_add from "./add.vue";
  import device_update from "./update.vue";
  import { getDeviceList, delDevice } from "@/api/index.js";
  export default {
    created() {
      this.getTable();
    },
    data() {
      return {
        isCollapse: false,
        tableQuery: {
          device_type: "",
          device_no: "",
          company_id: "",
          sim_id: "",
          size: 10,
          page: 1
        },
        tableData: {
          total: 0,
          data: []
        },
        tableLoading: true,
        addKey: 0,
      };
    },
    methods: {
      formatter(row) {
        return row.address;
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
        this.tableQuery.limit = val;
        this.getTable();
      },
      handleCurrentChange(val) {
        this.tableQuery.page = val;
        this.getTable();
      },
      delRow(scope) {//删除
        this.$confirm('确认删除？')
          .then(() => {
            delDevice({ id: scope.row.device_id }).then((res) => {
              if (res.data.code == 0) {
                this.$message.success(res.data.msg);
                this.getTable();
              } else {
                this.$message.error(res.data.msg);
              }
            })
          })
          .catch(() => { });
      },
      addFrom() {//添加
        var vNode = this.$createElement(device_add, {
          key: this.addKey++,
          on: {
            success: () => {
              this.getTable();
              this.$msgbox.close();
            },
            error: function () {
            }
          }
        });
        this.$msgbox({
          showConfirmButton: false,//是否显示确定按钮	
          customClass: "admin-message-form",
          title: "添加设备",
          closeOnClickModal: false,//是否可通过点击遮罩关闭 MessageBox	
          closeOnPressEscape: false,//是否可通过按下 ESC 键关闭 MessageBox
          message: vNode
        })
      },
      updateForm(scope) {//编辑
        var vNode = this.$createElement(device_update, {
          key: this.addKey++,
          props: {
            device_id: scope.row.device_id
          },
          on: {
            success: () => {
              this.getTable();
              this.$msgbox.close();
            },
            error: function () {
            }
          }
        });
        this.$msgbox({
          showConfirmButton: false,//是否显示确定按钮	
          customClass: "admin-message-form",
          title: "编辑设备",
          closeOnClickModal: false,//是否可通过点击遮罩关闭 MessageBox	
          closeOnPressEscape: false,//是否可通过按下 ESC 键关闭 MessageBox
          message: vNode
        })
      },
      getTable() {//获取列表
        this.tableLoading = true;
        var query = Object.assign({}, this.tableQuery);
        getDeviceList(query)

          .then(res => {
            if (res.data.code == 0) {
              this.$set(this.$data, "tableData", res.data);
            } else {
              this.$set(this.$data, "tableData", []);
              this.$message.error(res.data.msg);
            }
            this.tableLoading = false;
          })
          .catch(() => { });
      },
    },
    components: { selectDevicetype, selectProtocoltype, device_add, device_update, selectCompany },
  };
</script>