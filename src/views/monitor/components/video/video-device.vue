<template>
  <div>
    <el-form
      :model="tableQuery"
      label-width="100px"
      size="small"
      :label-position="isCollapse?'top':'left'"
    >
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="添加时间">
            <el-date-picker
              value-format="yyyyMMdd"
              v-model="dateRange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="终端ID">
            <el-input v-model="tableQuery.device_id" placeholder="终端ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="SIM ID">
            <el-input v-model="tableQuery.sim_id" placeholder="SIM ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="终端类型">
            <select-devicetype style="width: 100%;" v-model="tableQuery.device_type"></select-devicetype>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="终端厂商">
            <select-company v-model="tableQuery.company_id" style="width:100%;" :clearable="true"></select-company>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="分配用户">
            <select-user v-model="tableQuery.user_id" style="width:100%;" :clearable="true"></select-user>
            <!-- <el-autocomplete style="width: 100%;" class="inline-input" v-model="tableQuery.real_name" :fetch-suggestions="querySearch"
                placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect">
            </el-autocomplete>-->
          </el-form-item>
        </el-col>
        <el-col style="text-align: right;">
          <el-form-item>
            <el-button type="primary" @click="getTable">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      :data="tableData.data"
      v-loading="tableLoading"
      style="width: 100%"
      class="admin-table-list"
    >
      <el-table-column
        prop="time"
        label="添加时间"
        :formatter="(row)=>{return this.$utils.formatDate(row.time)}"
      ></el-table-column>
      <el-table-column
        prop="device_type"
        label="终端类型"
        :formatter="(row)=>{return this.$dict.get_device_type(row.device_type)}"
      ></el-table-column>
      <el-table-column
        prop="company_name"
        label="终端厂商"
        :formatter="$utils.baseFormatter"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="device_no" label="终端ID"></el-table-column>
      <el-table-column prop="sim_id" label="SIM ID" :formatter="$utils.baseFormatter"></el-table-column>
      <el-table-column
        prop="protocol_type"
        label="协议类型"
        :formatter="(row)=>{return this.$dict.get_protocol_type(row.protocol_type)}"
      ></el-table-column>
      <el-table-column prop="real_name" label="分配用户" :formatter="$utils.baseFormatter"></el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        :formatter="(row)=>{return this.$dict.get_device_state(row.state)}"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" icon="el-icon-check" @click="chooseDevice(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="admin-table-pager">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableQuery.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="tableQuery.size"
        :total="tableData.total"
        layout="total, sizes, prev, pager, next, jumper"
        background
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { getDeviceList } from "@/api/index.js";
import selectCompany from "@/components/select-company.vue";
import selectUser from "@/components/select-user.vue";
import selectDevicetype from "@/components/select-devicetype.vue";
import selectDevice from "@/components/select-device.vue";
export default {
  components: {
    selectCompany,
    selectUser,
    selectDevicetype,
    selectDevice
  },
  created() {
    this.getTable();
  },
  data() {
    return {
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
        data: [],
        total: 0
      },

      tableLoading: false,
      isCollapse: false,
      dateRange: ""
    };
  },
  methods: {
    chooseDevice(row) {
      this.$emit("choose", row);
    },
    //   查询设备
    getTable() {
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
        .catch(() => {});
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