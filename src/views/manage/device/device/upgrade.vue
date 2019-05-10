<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form label-width="100px" size="small">
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="chooseVehicle" size="small">选择车辆</el-button>
              {{ formData.license}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <el-button type="primary" @click="choosePackage" size="small">选择升级包</el-button>
              {{formData.package_version}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="选择升级模式">
              <el-select style="width:100%" v-model="formData.up_type">
                <el-option value="0" label="自动升级">自动升级</el-option>
                <el-option value="1" label="定时升级">定时升级</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-show="formData.up_type=='1'" :span="8">
            <el-form-item label="定时升级时间">
              <el-date-picker
                style="width:100%"
                v-model="formData.up_timer"
                value-format="yyyyMMddHHmmss"
                type="datetime"
                placeholder="选择日期时间"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col style="text-align:center">
            <el-form-item label-width="0">
              <el-button @click="setUpgrade" type="primary">提交</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always" class="admin-table-search">
      <el-form label-width="130px" :model="historyForm" size="small">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="升级指令下发日期">
              <el-date-picker
                style="width:100%"
                value-format="yyyyMMdd"
                v-model="historyForm.date"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="批次">
              <el-input v-model="historyForm.batch"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button @click="getTable" type="primary">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="historyData.data" style="width: 100%">
        <el-table-column
          prop="send_time"
          label="指令下发时间"
          :formatter="(row)=>{return $utils.formatDate(row.send_time)}"
        ></el-table-column>
        <el-table-column prop="external_type" label="终端类型" :formatter="$utils.baseFormatter">
          <template slot-scope="scope">
            <label v-if="scope.row.external_type=='01'">终端</label>
            <label v-if="scope.row.external_type=='02'">保留</label>
            <label v-if="scope.row.external_type=='03'">ADAS</label>
            <label v-if="scope.row.external_type=='04'">DSM</label>
            <label v-if="scope.row.external_type=='05'">BSD</label>
            <label v-if="scope.row.external_type=='06'">TPMS</label>
          </template>
        </el-table-column>
        <el-table-column prop="company_name" label="终端厂商" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="device_no" label="终端ID" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="package_version" label="当前版本号" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column
          prop="success_time"
          label="升级完成时间"
          :formatter="(row)=>{return $utils.formatDate(row.success_time)}"
        ></el-table-column>
        <el-table-column prop="state" label="升级状态" :formatter="$utils.baseFormatter">
          <template slot-scope="scope">
            <label v-if="scope.row.state=='0'">待升级</label>
            <label v-if="scope.row.state=='1'">成功</label>
            <label v-if="scope.row.state=='2'">失败</label>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination
          @size-change="handleSizeChange "
          @current-change="handleCurrentChange "
          :current-page="historyForm.page "
          :page-sizes="[10, 20, 50, 100] "
          :page-size="historyForm.size "
          :total="historyData.total "
          layout="total, sizes, prev, pager, next, jumper "
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
      <choose-vcheckbox @button="xz" :key="addKey"></choose-vcheckbox>
    </el-dialog>
    <el-dialog
      width="50%"
      title="选择信息"
      :visible.sync="packageDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <upgrade-package @success="savePackage"></upgrade-package>
    </el-dialog>
  </div>
</template>
<script>
import { GetRecordList, AddDeviceUpgradeRecord } from "@/api/index.js";
import chooseVcheckbox from "@/components/choose-vcheckbox.vue";
import upgradePackage from "./upgrade-package.vue";
export default {
  components: { chooseVcheckbox, upgradePackage },
  data() {
    return {
      addKey: 0,
      packageDialog: false,
      vehicleDialog: false,
      historyForm: {
        date: "",
        batch: "",
        page: 1,
        size: 10
      },
      historyData: {
        data: [],
        total: 0
      },
      formData: {
        user_ids: "",
        sim_ids: "",
        license: "",
        up_timer: "", //定时升级时间
        up_type: "", //升级方式
        package_id: "", //升级包id
        external_type: "", //类型
        package_version: "" //升级包版本号
      }
    };
  },
  methods: {
    // 分页
    handleSizeChange(val) {
      this.historyForm.page = 1;
      this.historyForm.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.historyForm.page = val;
      this.getTable();
    },
    // 终端升级
    setUpgrade() {
      AddDeviceUpgradeRecord(this.formData).then(res => {
        if (res.data.code == 0) {
          return this.$notify({
            message: "设置成功",
            title: "提示",
            type: "success"
          });
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    getTable() {
      GetRecordList(this.historyForm).then(res => {
        if (res.data.code == 0) {
          this.$set(this.historyData, "data", res.data.data);
          this.$set(this.historyData, "total", res.data.total);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    xz(scope) {
      this.formData.license = "";
      this.formData.sim_ids = "";
      scope.map(item => {
        this.formData.sim_ids = this.formData.sim_ids + item.sim_id + ",";
        this.formData.license = this.formData.license + item.license + ",";
      });
      this.formData.license = this.formData.license.substring(
        0,
        this.formData.license.lastIndexOf(",")
      );
      this.formData.sim_ids = this.formData.sim_ids.substring(
        0,
        this.formData.sim_ids.lastIndexOf(",")
      );
      this.vehicleDialog = false;
    },
    savePackage(data) {
      this.packageDialog = false;
      this.formData.package_id = data.rowid;
      this.formData.external_type = data.external_type;
      this.formData.package_version = data.version;
    },
    chooseVehicle() {
      this.addKey++;
      this.vehicleDialog = true;
    },
    choosePackage() {
      this.addKey++;
      this.packageDialog = true;
    }
  }
};
</script>