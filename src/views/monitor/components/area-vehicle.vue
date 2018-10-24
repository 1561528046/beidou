<template>
    <div class="admin-table-container" style="position: absolute;left:0;right:0;bottom:0;top:107px;">
        <!-- 返回 -->
        <router-link :to="{name:'map'}">
            <el-button style="position:absolute;top:-30px;right:31px;" size="small" icon="el-icon-arrow-left">
                <span>返回</span>
            </el-button>
        </router-link>
        <el-card shadow="always" class="full-box">
            <el-form @submit.native.prevent ref="baseForm ">
                <el-row :gutter="30 ">
                    <el-col :span="10 ">
                        <el-form-item label="选择车辆">
                            <el-button style="margin-left:10px;" type="primary" size="small" @click="addForm">选择车辆</el-button>
                            {{license}}
                        </el-form-item>
                    </el-col>
                    <el-col :span="10 ">
                        <el-form-item label="选择区域">
                            <el-select @change="fenceItem" v-model="areaType" size="small" clearable>
                                <el-option v-for="fence in fenceData" :key="fence.RegionId" :value="fence.Type" :label="fence.RegionName">{{fence.RegionName}}</el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10 ">
                        <el-form-item label="选择事件">
                            <el-checkbox v-if="update_state" v-model="event_type.update" value="0" label="更新区域">更新区域</el-checkbox>
                            <el-checkbox v-if="add_state" v-model="event_type.add" value="1" label="追加区域">追加区域</el-checkbox>
                            <el-checkbox v-if="modify_state" v-model="event_type.modify" value="2" label="修改区域">修改区域</el-checkbox>
                            <el-checkbox v-model="event_type.delete" value="3" label="删除区域">删除区域</el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-button @click="setting" style="display:block; margin:0 auto;" size="small" type="primary">设置</el-button>
        </el-card>
        <el-dialog width="50%" title="选择信息" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
            <choose-vehicle @button="vehicleCallback" @success=" () => {this.addDialog = false;}" :key="addKey"></choose-vehicle>
        </el-dialog>
    </div>
</template>

<script>
/* eslint-disable */
import { GetRegionByPage } from "@/api/index.js";
import chooseVehicle from "@/components/choose-vehicle.vue";
export default {
  components: { chooseVehicle },
  created() {
    this.selectFence();
  },
  computed: {},
  data() {
    return {
      update_state: true,
      add_state: true,
      modify_state: true,
      addKey: 0,
      addDialog: false,
      event_type: {
        update: false,
        add: false,
        modify: false,
        delete: false
      },
      license: "",
      areaType: "",
      vehicleData: {},
      fenceData: [],
      formData: {
        page: 1,
        size: 9999
      }
    };
  },
  watch: {
    areaType: function() {
      if (this.areaType == "3") {
        this.update_state = false;
        this.add_state = false;
        this.modify_state = false;
      } else {
        this.update_state = true;
        this.add_state = true;
        this.modify_state = true;
      }
    }
  },
  methods: {
    fenceItem(row) {
      console.log(row);
    },
    setting() {
      console.log(this.areaData);
      console.log(this.vehicleData);
      console.log(this.event_type);
    },
    addForm() {
      this.addKey++;
      this.addDialog = true;
    },
    selectFence() {
      GetRegionByPage(this.formData).then(res => {
        if (res.data.code == 0) {
          var arr = [];
          res.data.data.map(item => {
            if (item.Type == "4") {
              return;
            }
            arr.push(item);
          });
          this.$set(this.$data, "fenceData", arr);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    vehicleCallback(scope) {
      this.vehicleData = scope.row;
      this.license = scope.row.license;
      this.addDialog = false;
    }
  }
};
</script>
<style lang="less">
</style>