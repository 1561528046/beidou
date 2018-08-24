<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form :model="tableQuery" label-width="80px" :label-position="isCollapse?'top':'left'" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="车牌号">
              <el-input v-model="tableQuery.license" placeholder="车牌号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车架号">
              <el-input v-model="tableQuery.vin" placeholder="车架号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isCollapse">
            <el-form-item label="终端ID">
              <el-input v-model="tableQuery.device_no" placeholder="终端ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SIM ID">
              <el-input v-model="tableQuery.sim_id" placeholder="SIM卡号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isCollapse">
            <el-form-item label="安装SIM卡号">
              <el-input v-model="tableQuery.sim_no" placeholder="安装SIM卡号"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6" v-show="isCollapse">
            <el-form-item label="所属地区">
              <select-city-input :area.sync="tableQuery.area" :select-all="true" style="width:100%;" clearable></select-city-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isCollapse">
            <el-form-item label="业户">
              <el-input v-model="tableQuery.owner" placeholder="业户"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isCollapse">
            <el-form-item label="首次入网时间">
              <el-date-picker style="width:100%;" value-format="yyyyMMdd" v-model="tableQuery.first_online_time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isCollapse">
            <el-form-item label="服务到期日期">
              <el-date-picker style="width:100%;" value-format="yyyyMMdd" v-model="tableQuery.contract_date_end" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isCollapse">
            <el-form-item label="离线天数">
              <el-select v-model="tableQuery.offline_days" placeholder="离线天数" style="width:100%;" clearable>
                <el-option label="7天" value="7"></el-option>
                <el-option label="30天" value="30"></el-option>
                <el-option label="90天" value="90"></el-option>
                <el-option label="180天" value="180"></el-option>
                <el-option label="360天" value="360"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="isCollapse?24:6" style="text-align: right;">
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
        <router-link :to="{path:'new/add'}">
          <el-button type="primary" size="small">
            <i class="el-icon-upload el-icon--right"></i> 添加
          </el-button>
        </router-link>
        &nbsp;

        <el-button type="primary" size="small">导出
          <i class="el-icon-upload el-icon--right"></i>
        </el-button>
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="first_time" label="首次入网时间" :formatter="(row)=>{return $utils.formatDate(row.license_validity)}"></el-table-column>
        <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter">
          <template slot-scope="scope">
            <span class="license-card" :style="$dict.get_license_color(scope.row.license_color).style">{{scope.row.license}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="vin" label="车架号" :formatter="$utils.baseFormatter" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="device_no" label="终端ID" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="sim_id" label="SIM ID" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="owner" label="业户" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="linkman" label="联系人" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="tel" label="电话" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="contract_date" label="到期日期" :formatter="(row)=>{return $utils.formatDate(row.license_validity)}"> </el-table-column>
        <el-table-column label="操作" width="350">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="goEdit(scope)">编辑</el-button>
            <el-button size="mini" icon="el-icon-delete" @click="delRow(scope)">删除</el-button>
            <el-dropdown size="mini" split-button style="margin-left:10px;">
              更多操作
              <el-dropdown-menu slot="dropdown" class="vehicle-list-more">
                <el-dropdown-item>车辆位置</el-dropdown-item>
                <el-dropdown-item>更新定位</el-dropdown-item>
                <el-dropdown-item>平台续费</el-dropdown-item>
                <el-dropdown-item>厂商续费</el-dropdown-item>
                <el-dropdown-item>厂商激活</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<style lang="less">
.vehicle-list-more {
  li {
    line-height: 36px !important;
    padding: 0 20px !important;
    font-size: 14px !important;
  }
}
.license-card {
  padding: 0 5px;
  border-radius: 4px;
  width: 9em;
  overflow: hidden;
  display: inline-block;
  text-align: center;
  box-sizing: border-box;
  position: relative;
  font-weight: bold;
  &:before {
    content: "";
    width: 4px;
    height: 4px;
    border-radius: 4px;
    background: #fff;
    position: absolute;
    left: 5px;
    top: 50%;
    margin-top: -2px;
  }
  &:after {
    content: "";
    width: 4px;
    height: 4px;
    border-radius: 4px;
    background: #fff;
    position: absolute;
    right: 5px;
    top: 50%;
    margin-top: -2px;
  }
}
</style>
<script>
/* eslint-disable */
import { getVehicleList, delVehicle } from "@/api/index.js";
import selectCityInput from "@/components/select-city-input.vue";
export default {
  components: { selectCityInput },
  created() {
    this.getTable();
  },
  props: {
    vehicle_type: Number, //vehicle_type区分普货和其他类型车辆
    state: Number //state: 1新增车辆 2定位车辆 3到期车辆
  },
  data() {
    return {
      isCollapse: false,
      first_online_time: [], //首次入网 时间范围
      tableQuery: {
        type: this.$props.type,
        state: this.$props.state,
        user_id: 1,
        size: 10,
        page: 1
      },
      tableData: {
        area: [],
        total: 0,
        data: []
      },
      tableLoading: true,
      pickerOptions: {
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
    first_online_time: function() {
      this.tableQuery.first_online_time_start = this.first_online_time[0];
      this.tableQuery.first_online_time_end = this.first_online_time[1];
    }
  },
  methods: {
    goEdit(scope) {
      this.$router.push({
        name: "gghypt_vehicle_edit",
        query: { vehicle_id: scope.row.vehicle_id }
      });
    },
    delRow(scope) {
      //删除
      this.$confirm("确认删除？")
        .then(() => {
          delVehicle(scope.row).then(res => {
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
    handleSizeChange(val) {
      //每页数量切换
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      //翻页
      this.tableQuery.page = val;
      this.getTable();
    },
    getTable() {
      //获取列表
      this.tableLoading = true;
      var query = Object.assign({}, this.tableQuery, this.tableQuery.area);
      delete query.area;
      getVehicleList(query)
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
    }
  }
};
</script>