<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form label-width="80px" :model="tableQuery" size="small">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="时间">
              <el-date-picker
                style="width:100%"
                v-model="tableQuery.time"
                type="datetimerange"
                value-format="yyyyMMddHHmmss"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="司机姓名">
              <el-input v-model="tableQuery.driver_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号">
              <el-input v-model="tableQuery.identity_id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车辆">
              <el-input @focus="selectvehicle" v-model="tableQuery.license"></el-input>
            </el-form-item>
          </el-col>
          <el-col style="text-align:right">
            <el-form-item>
              <el-button @click="getTable" type="primary">查询</el-button>
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
        <el-table-column prop="driver_name" label="驾驶员姓名" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="agency_name" label="发证机构名称" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="job_no" label="从业资格证编码" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="driver_document" label="驾驶员身份证编码" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="valid_date" label="证件有效期" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="IC_result" label="IC卡读取结果" :formatter="$utils.baseFormatter">
          <template slot-scope="scope">
            <label v-if="scope.row.IC_result=='0'">IC卡读卡成功</label>
            <label v-if="scope.row.IC_result=='1'">卡片密钥认证未通过</label>
            <label v-if="scope.row.IC_result=='2'">卡片已被锁定</label>
            <label v-if="scope.row.IC_result=='3'">卡片被拔出</label>
            <label v-if="scope.row.IC_result=='4'">数据校验错误</label>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" :formatter="$utils.baseFormatter">
          <template slot-scope="scope">
            <label v-if="scope.row.state=='1'">从业资格证 IC 卡插入</label>
            <label v-if="scope.row.state=='2'">从业资格证 IC 卡拔出</label>
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          label="时间"
          :formatter="(row)=>{return $utils.formatDate14(row.time)}"
        ></el-table-column>
        <el-table-column prop label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="lookDriver(scope)" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination
          @size-change="handleSizeChange "
          @current-change="handleCurrentChange "
          :current-page="tableQuery.page "
          :page-sizes="[10, 20, 50, 100] "
          :page-size="tableQuery.size "
          :total="tableData.total "
          layout="total, sizes, prev, pager, next, jumper "
          background
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog
      width="62%"
      title="查看详情"
      :visible.sync="lookDialog "
      :append-to-body="true "
      :close-on-click-modal="false "
      :close-on-press-escape="false "
      :center="true "
      class="admin-dialog"
    >
      <look-driver :simID="simid" :key="addKey"></look-driver>
    </el-dialog>
    <el-dialog
      width="50%"
      title="选择车辆"
      :visible.sync="vehicleDialog "
      :append-to-body="true "
      :close-on-click-modal="false "
      :close-on-press-escape="false "
      :center="true "
      class="admin-dialog"
    >
      <choose-vehicle @button="bindingVehicle" :key="addKey"></choose-vehicle>
    </el-dialog>
  </div>
</template>
<script>
import chooseVehicle from "@/components/choose-vehicle.vue";
import { GetDriverCheckListByPage } from "@/api/index.js";
import lookDriver from "./look.vue";
export default {
  components: { lookDriver, chooseVehicle },
  created() {
    this.getTable();
  },
  data() {
    return {
      addKey: 0,
      simid: "",
      vehicleDialog: false,
      lookDialog: false,
      tableQuery: {
        time: "",
        begin_time: "",
        end_time: "",
        license: "",
        identity_id: "",
        driver_name: "",
        page: 1,
        size: 10
      },
      tableData: {
        data: [],
        total: 0
      }
    };
  },
  methods: {
    exportExcel() {
      //导出excel
      var wsCol = [
        {
          A: "驾驶员姓名",
          B: "发证机构名称",
          C: "从业资格证编码",
          D: "驾驶员身份证编码",
          E: "证件有效期",
          F: "IC卡读取结果",
          G: "状态",
          H: "时间"
        }
      ];
      var type = "";
      this.tableData.data.map(data => {
        switch (data.IC_result) {
          case "0":
            type = "IC卡读卡成功";
            break;
          case "1":
            type = "卡片密钥认证未通过";
            break;
          case "2":
            type = "卡片已被锁定";
            break;
          case "3":
            type = "卡片被拔出";
            break;
          case "4":
            type = "数据校验错误";
            break;
        }
        wsCol.push({
          A: data.driver_name,
          B: data.agency_name,
          C: data.job_no,
          D: data.driver_document,
          E: this.$utils.formatDate14(JSON.stringify(data.valid_date)),
          F: type,
          G:
            data.state == "1" ? "从业资格证 IC 卡插入" : "从业资格证 IC 卡拔出",
          H: this.$utils.formatDate14(JSON.stringify(data.time))
        });
      });
      this.$utils.exportExcel({
        data: wsCol,
        sheetName: "驾驶员上传记录表",
        fileName: "驾驶员上传记录表.xlsx"
      });
    },
    //   车辆
    selectvehicle() {
      this.addKey++;
      this.vehicleDialog = true;
    },
    bindingVehicle(data) {
      this.vehicleDialog = false;
      this.tableQuery.sim_id = data.row.sim_id;
      this.tableQuery.license = data.row.license;
    },
    //   查看详情
    lookDriver(scope) {
      this.addKey++;
      this.lookDialog = true;
      this.simid = scope.row.sim_id;
    },
    //查询
    getTable() {
      if (this.tableQuery.time) {
        this.tableQuery.begin_time = this.tableQuery.time[0];
        this.tableQuery.end_time = this.tableQuery.time[1];
      }
      GetDriverCheckListByPage(this.tableQuery).then(res => {
        if (res.data.code == 0) {
          this.$set(this.tableData, "data", res.data.data);
          this.$set(this.tableData, "total", res.data.total);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
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