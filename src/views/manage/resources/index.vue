<template>
  <div class="admin-table-container">
    <el-form :model="tableQuery" label-position="left" size="small" label-width="90px">
      <el-card shadow="always" style="float: left;width: 19%;height: 714px;">
        <el-row style="text-align:left;font-size: 14px; color: #606266;">
          <el-col>
            <el-form-item label="公安部"></el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="中交天枢"></el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="所属地区">
              <select-city
                v-model="tableQuery.area"
                :province_id.sync="tableQuery.province_id"
                :city_id.sync="tableQuery.city_id"
                :county_id.sync="tableQuery.county_id"
                style="width:100%;"
              ></select-city>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="企业名称">{{userForm.real_name}}</el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="车牌号">
              <el-input
                v-model="tableQuery.license"
                :disabled="license_type"
                style="width:100%;"
                @focus="selectVehicle"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="通道号">
              <el-input :disabled="channel_type" style="width:100%;" @focus="selectChannel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <div style="width:80%;float:right">
        <el-card shadow="always" class="admin-table-search">
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item label-width="50px" label="时间">
                <el-date-picker
                  style="width:100%"
                  v-model="tableQuery.time"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="音视频类型">
                <el-select v-model="tableQuery.type" style="width:100%">
                  <el-option value="0" label="音频资源">音频资源</el-option>
                  <el-option value="1" label="视频资源">视频资源</el-option>
                  <el-option value="2" label="照片抓拍">照片抓拍</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="资源来源">
                <el-select v-model="tableQuery.source" style="width:100%">
                  <el-option value="0" label="自动报警">自动报警</el-option>
                  <el-option value="1" label="手动保存">手动保存</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align:right">
              <el-form-item label-width="0">
                <el-button type="primary">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="always" class="admin-table-search">
          <div style="width: 80%;display:inline-block">
            <el-table :data="tableData.data" height="530px">
              <el-table-column prop label="名称"></el-table-column>
              <el-table-column prop label="车牌号"></el-table-column>
              <el-table-column prop label="时长"></el-table-column>
              <el-table-column prop label="时间"></el-table-column>
              <el-table-column prop label="位置"></el-table-column>
              <el-table-column prop label="大小"></el-table-column>
              <el-table-column prop label="报警类型"></el-table-column>
              <el-table-column prop label="资源来源"></el-table-column>
              <el-table-column prop label="音视频类型"></el-table-column>
              <el-table-column prop label="备注"></el-table-column>
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
          </div>
          <div
            style="width:20%;height:530px; display:inline-block;border-left: solid 1px;position: absolute;"
          >
            <h4 style="width:100%;text-align:center">音视频资源统计</h4>
            <ul style="list-style: none;line-height: 32px;padding: 10px 66px;font-size:14px">
              <li>总计：</li>
              <hr
                style="height:1px;border:none;border-top:1px dashed #0066CC;margin-top:5px;margin-bottom:5px"
              >
              <li>视频资源：</li>
              <li>大小：</li>
              <li>时长：</li>
              <li>自动报警：</li>
              <li>手动保存：</li>
              <hr
                style="height:1px;border:none;border-top:1px dashed #0066CC;margin-top:5px;margin-bottom:5px"
              >
              <li>音频资源：</li>
              <li>大小：</li>
              <li>时长：</li>
              <li>自动报警：</li>
              <li>手动保存：</li>
              <hr
                style="height:1px;border:none;border-top:1px dashed #0066CC;margin-top:5px;margin-bottom:5px"
              >
              <li>照片抓拍：</li>
              <li>大小：</li>
            </ul>
          </div>
        </el-card>
      </div>
    </el-form>
    <el-dialog
      width="30%"
      title="选择车辆"
      :visible.sync="vehicleDialog"
      :append-to-body="true"
      class="admin-dialog"
    >
      <select-license :area="areaData" @choose="saveVehicle" :key="addKey"></select-license>
    </el-dialog>
  </div>
</template>
<script>
import { getCurrentUser } from "@/api/index.js";
import selectLicense from "./select-license.vue";
import selectCity from "@/components/select-city.vue";
export default {
  components: { selectCity, selectLicense },
  created() {
    getCurrentUser().then(res => {
      if (res.data.code == 0) {
        this.$set(this.$data, "userForm", res.data.data[0]);
      } else {
        return this.$notify({
          message: res.data.msg,
          title: "提示",
          type: "error"
        });
      }
    });
  },
  data() {
    return {
      areaData: [],
      userForm: {},
      channel_type: true,
      license_type: true,
      vehicleDialog: false,
      addKey: 0,
      tableQuery: {
        page: 1,
        size: 10,
        source: "",
        time: "",
        area: [],
        province_id: "",
        city_id: "",
        county_id: "",
        video_platform: "",
        user_id: "",
        license: "",
        video_channel: "",
        begin_time: "",
        end_time: "",
        type: "",
        form: ""
      },
      tableData: {
        data: [],
        total: 0
      }
    };
  },
  watch: {
    "tableQuery.area": function() {
      this.license_type = false;
    },
    "tableQuery.license": function() {
      this.channel_type = false;
    }
  },
  methods: {
    // 选择车辆
    selectVehicle() {
      this.vehicleDialog = true;
      this.addKey++;
      this.$set(this.$data, "areaData", this.tableQuery.area);
    },
    // 选择车辆回调
    saveVehicle(data) {
      this.vehicleDialog = false;
      this.$set(this.tableQuery, "license", data.license);
    },
    // 选择通道号
    selectChannel() {},
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
</style>