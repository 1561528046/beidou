<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form size="small" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="时间">
              <el-date-picker
                style="width:100%"
                v-model="time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车辆">
              <el-input
                :disabled="vehicleAlert"
                @focus="selectvehicle"
                type="text"
                v-model="tableQuery.license"
                style="position: absolute;left: 0px; top: 0px;"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button type="primary">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always" class="admin-table-search">
      <div class="admin-table-actions">
        <el-button type="primary" @click="exportExcel" size="small">
          <i class="el-icon-download"></i> 导出
        </el-button>
      </div>
      <el-table :data="tableData.data" style="width: 100%">
        <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter">
          <template slot-scope="scope">
            <span
              class="license-card"
              :style="$dict.get_license_color(scope.row.license_color).style"
            >{{scope.row.license}}</span>
          </template>
        </el-table-column>
        <el-table-column prop label="所属组织"></el-table-column>
        <el-table-column prop label="时间"></el-table-column>
        <el-table-column prop label="当时位置"></el-table-column>
        <el-table-column prop label="前门上车人数"></el-table-column>
        <el-table-column prop label="前门下车人数"></el-table-column>
        <el-table-column prop label="后门上车人数"></el-table-column>
        <el-table-column prop label="后门下车人数"></el-table-column>
        <el-table-column prop label="车上乘客人数"></el-table-column>
        <el-table-column prop label="人员增量"></el-table-column>
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
    </el-card>
    <el-dialog
      width="50%"
      title="选择信息"
      :visible.sync="vehicleDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <choose-vcheckbox
        @button="xz"
        @success=" () => {this.getTable();this.vehicleDialog = false;}"
        :key="addKey"
      ></choose-vcheckbox>
    </el-dialog>
  </div>
</template>
<script>
import chooseVcheckbox from "@/components/choose-vcheckbox.vue";
export default {
  components: { chooseVcheckbox },
  data() {
    return {
      time: "",
      addKey: "0",
      vehicleDialog: false,
      vehicleAlert: false,
      tableQuery: {
        page: 1,
        size: 10,
        sim_ids: "",
        license: ""
      },
      tableData: {
        data: [],
        total: 0
      }
    };
  },
  watch: {},
  methods: {
    // 导出
    exportExcel() {},
    // 选择车辆
    selectvehicle() {
      this.addKey++;
      this.vehicleDialog = true;
      this.tableQuery.license = "";
      this.tableQuery.sim_ids = "";
    },
    // 查询
    getTable() {},
    // 选择车辆回调
    xz(scope) {
      this.vehicleDialog = false;
      if (!scope.length == 0) {
        this.userAlert = true;
      }
      this.vehicles = [];
      for (var i = 0; i < scope.length; i++) {
        this.tableQuery.license =
          this.tableQuery.license + scope[i].license + ",";
        this.tableQuery.sim_ids =
          this.tableQuery.sim_ids + ("0" + scope[i].sim_id) + ",";
        this.vehicles.push({
          license: scope[i].license,
          license_color: scope[i].license_color,
          sim_id: scope[i].sim_id
        });
      }
      this.tableQuery.sim_ids = this.tableQuery.sim_ids.substring(
        0,
        this.tableQuery.sim_ids.lastIndexOf(",")
      );
      this.tableQuery.license = this.tableQuery.license.substring(
        0,
        this.tableQuery.license.lastIndexOf(",")
      );
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