<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">

      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-form-item label="设备类型">
            <select-devicetype v-model="tableQuery.device_type"></select-devicetype>
          </el-form-item>
          <el-form-item label="协议类型">
            <select-protocoltype v-model="tableQuery.protocol_type"></select-protocoltype>
          </el-form-item>
          <!-- <el-col :span="6">
            <el-form-item label="设备序列号">
              <el-input placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备厂商">
              <el-input placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="simid">
              <el-input placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>-->
          <!-- <el-col :span="6">
            <el-form-item label="协议类型">
              <select-protocoltype v-model="tableQuery.protocol_type"></select-protocoltype>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="isCollapse=!isCollapse">展开</el-button>
              <el-button type="primary" @click="getTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <div class="admin-table-actions">
        <router-link :to="{name:'device-add'}" style="display: block;">
          <el-button type="primary" size="small" class="small-button">
            <i class="el-icon-upload el-icon--right"></i> 添加
          </el-button>
        </router-link>
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <!-- <el-table-column prop="device_id" label="设备Id">
        </el-table-column> -->
        <el-table-column prop="device_type" label="设备类型" :formatter="(row)=>{return this.$dict.get_device_type(row.device_type)}">
        </el-table-column>
        <el-table-column prop="device_no" label="设备序列号"> </el-table-column>
        <!-- <el-table-column prop="company_id" label="设备厂家Id"></el-table-column> -->
        <el-table-column prop="company_name" label="设备厂商"></el-table-column>
        <el-table-column prop="sim_id" label="simid"></el-table-column>
        <el-table-column prop="protocol_type" label="协议类型" :formatter="(row)=>{return this.$dict.get_protocol_type(row.protocol_type)}">
        </el-table-column>
        <el-table-column prop="install_date" label="安装日期"></el-table-column>
        <el-table-column prop="camera_num" label="摄像头数量"></el-table-column>
        <el-table-column prop="save_media" label="存储介质" :formatter="(row)=>{return this.$dict.get_save_media(row.save_media)}"></el-table-column>
        <el-table-column prop="state" label="状态" :formatter="(row)=>{return this.$dict.get_state(row.state)}"></el-table-column>
        <el-table-column prop="time" label="添加时间"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small">
              <router-link :to="{name:'device-update',params:{device_id:scope.row.device_id}}" style="display: block;">编辑
              </router-link>
            </el-button>
            <el-button @click="handleClick(scope.row)" type="text" size="small">删除</el-button>
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
  import { DeviceList } from "@/api/index.js";
  export default {
    created() {
      this.getTable();
    },
    data() {
      return {
        isCollapse: false,
        tableQuery: {
          user: "",
          region: "",
          size: 10,
          page: 1
        },
        tableData: {
          total: 0,
          data: []
        },
        tableLoading: true
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
      getTable() {
        this.tableLoading = true;
        DeviceList(this.tableQuery)
          .then(res => {
            this.$set(this.$data, "tableData", res.data);
            this.tableLoading = false;
          })
          .catch(() => { });
      }
    },
    components: { selectDevicetype, selectProtocoltype },
  };
</script>
<style>
  .el-form-item {
    float: left;
  }
</style>