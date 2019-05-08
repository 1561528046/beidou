<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form size="small">
        <el-row>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="chooseVehicle" size="small">选择车辆</el-button>
              {{ formData.license}}
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="chooseVehicle" size="small">选择升级包</el-button>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="选择升级模式">
              <el-select v-model="formData.upgrade_mode">
                <el-option value="1" label="自动升级">自动升级</el-option>
                <el-option value="2" label="定时升级">定时升级</el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
  </div>
</template>
<script>
import chooseVcheckbox from "@/components/choose-vcheckbox.vue";
export default {
  components: { chooseVcheckbox },
  data() {
    return {
      addKey: 0,
      vehicleDialog: false,
      formData: {
        license: "",
        upgrade_mode: ""
      }
    };
  },
  methods: {
    xz(scope) {
      this.formData.license = "";
      scope.map(item => {
        this.formData.license = this.formData.license + item.license + ",";
      });
      this.formData.license = this.formData.license.substring(
        0,
        this.formData.license.lastIndexOf(",")
      );
      this.vehicleDialog = false;
    },
    chooseVehicle() {
      this.addKey++;
      this.vehicleDialog = true;
    }
  }
};
</script>