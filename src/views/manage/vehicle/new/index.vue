<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form :model="tableQuery" label-width="80px" :label-position="isCollapse?'top':'left'" class="table-search" size="small" @submit.native.prevent>
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
              <select-city-input :area.sync="area" :select-all="true" style="width:100%;" clearable></select-city-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isCollapse">
            <el-form-item label="业户">
              <el-input v-model="tableQuery.owner" placeholder="业户"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isCollapse" v-if="$props.state!=1">
            <el-form-item label="首次入网时间">
              <el-date-picker style="width:100%;" value-format="yyyyMMdd" v-model="first_date" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isCollapse">
            <el-form-item label="服务到期日期">
              <el-date-picker style="width:100%;" value-format="yyyyMMdd" v-model="contract_date" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isCollapse" v-if="$props.state!=1">
            <el-form-item label="离线天数">
              <el-select v-model="tableQuery.leave_day" placeholder="离线天数" style="width:100%;" clearable>
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
              <el-button type="primary" @click="getTable" :loading="tableLoading" native-type="submit">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <div class="admin-table-actions">
        <router-link :to="{path:'new/add'}" v-if="$props.state==1">
          <el-button type="primary" size="small">
            <i class="el-icon-plus"></i> 添加
          </el-button>
        </router-link>
        &nbsp;
        <router-link :to="{path:'new/binding'}" v-if="$props.state==1">
          <el-button type="primary" size="small">
            <i class="el-icon-plus"></i> 绑定管理
          </el-button>
        </router-link>
        &nbsp;
        <!-- <el-button type="primary" size="small" v-if="$props.state==2">
          <i class="el-icon-tickets"></i> 单车导入
        </el-button>
        <el-button type="primary" size="small" v-if="$props.state==2">
          <i class="el-icon-upload2"></i> 批量导入
        </el-button> -->
        <el-button type="primary" size="small">
          <i class="el-icon-download"></i> 导出
        </el-button>
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="first_time" label="首次入网时间" :formatter="(row)=>{return $utils.formatDate(row.license_validity)}"></el-table-column>
        <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter">
          <template slot-scope="scope">

            <span class="license-card" :style="$dict.get_license_color(scope.row.license_color).style" @click="showDetails(scope)">{{scope.row.license}}</span>
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
            <el-dropdown size="mini" style="margin-left:10px;" @command="handleCommand" trigger="click">
              <el-button size="mini">
                更多菜单
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown" class="vehicle-list-more">
                <el-dropdown-item v-if="$props.state!=1" :command="{command:'view-position',data:scope}">车辆位置</el-dropdown-item>
                <el-dropdown-item v-if="$props.state==1" :command="{command:'update-position',data:scope}">更新定位</el-dropdown-item>
                <el-dropdown-item v-if="$props.state!=1" :command="{command:'renew-platform',data:scope}">平台续费</el-dropdown-item>
                <el-dropdown-item v-if="$props.state!=1" :command="{command:'renew-company',data:scope}">厂商续费</el-dropdown-item>
                <el-dropdown-item :command="{command:'active-company',data:scope}">厂商激活(2个图片，一个备注)</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-dialog title="平台续费" :center="true" @closed="openCompanyClosed" :visible.sync="renew.platformVisible" :append-to-body="true" width="30%">
              <el-form label-position="top" :model="openCompany.postData" size="small">
                <el-row :gutter="30">
                  <el-col :span="24">
                    <el-form-item prop="plateformDate" label="服务到期日期">
                      <el-date-picker style="width:100%;" value-format="yyyyMMdd" v-model="renew.plateformDate" type="date" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" style="text-align:center;">
                    <el-button @click="renew.platformVisible=false">取消</el-button>
                    <el-button @click="upsubmit(scope)" type="primary">提交</el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </el-card>
    <!-- 车辆详情查看 -->
    <el-dialog title="车辆详情" :center="true" @closed="clearShowDetails" :visible.sync="detailsVisible" width="75%" :append-to-body="true">
      <view-vehicle :type="$props.type" :is_enter="$props.is_enter" @error="clearShowDetails" :vehicle_id="showDetailsVehicle.vehicle_id" v-if="detailsVisible"></view-vehicle>
    </el-dialog>
    <el-dialog title="厂商开通" :center="true" @closed="openCompanyClosed" :visible.sync="openCompany.visible" :append-to-body="true">
      <el-form label-position="top" :model="openCompany.postData" size="small" ref="baseForm">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item prop="img1" label="图片1" style="text-align:center;">
              <el-upload class="avatar-uploader" accept="image/jpeg" :action="$dict.API_URL+'/vehicle/UploadImgLocal/'" :show-file-list="false">
                <img v-if="openCompany.postData.img1 " :src="$dict.BASE_URL+openCompany.postData.img1 " class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="img2" label="图片2" style="text-align:center;">
              <el-upload class="avatar-uploader" accept="image/jpeg" :action="$dict.API_URL+'/vehicle/UploadImgLocal/'" :show-file-list="false">
                <img v-if="openCompany.postData.img2 " :src="$dict.BASE_URL+openCompany.postData.img2 " class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="note" label="备注">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="openCompany.postData.note">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="text-align:center;">
            <el-button @click="openCompanyClosed">取消</el-button>
            <el-button @click="companySubmit" type="primary">提交</el-button>
          </el-col>
        </el-row>

      </el-form>
    </el-dialog>

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
import moment from "moment";
import {
  getVehicleList,
  delVehicle,
  firstTimeVehicle,
  AddFeeVehicle
} from "@/api/index.js";
import selectCityInput from "@/components/select-city-input.vue";
import viewVehicle from "@/components/view-vehicle.vue";
export default {
  components: { selectCityInput, viewVehicle },
  created() {
    this.getTable();
  },
  props: {
    type: Number, //type 接入车辆类型：1普通货运车辆，2危险品车辆，3长途客运、班线车辆，4城市公共交通车辆，5校车，6出租车，7私家车，8警务车辆，9网约车，10其他车辆
    state: Number, //state 车辆状态 1、新增车辆 2、定位车辆 3、到期车辆
    is_enter: Number //is_enter是否录入全国平台：1是，2否
  },
  data() {
    return {
      platformTime: "",
      renew: {
        plateformDate: "",
        companyDate: "",
        compaynVisible: false,
        platformVisible: false
      },
      openCompany: {
        postData: {
          img1: "",
          img2: "",
          note: ""
        },
        visible: false,
        vehicle: {} //厂商开通车辆
      },
      showDetailsVehicle: {}, //正在显示的车辆
      detailsVisible: false, //查看详情显示隐藏
      isCollapse: false,
      first_online_time: [], //首次入网 时间范围
      contract_date: [],
      first_date: [],
      area: [],
      tableQuery: {
        device_no: "",
        is_enter: this.$props.is_enter,
        province_id: "",
        city_id: "",
        county_id: "",
        type: this.$props.type,
        flag: this.$props.state,
        leave_day: "",
        first_startdate: "",
        first_enddate: "",
        contract_startdate: "",
        contract_enddate: "",
        size: 10,
        page: 1
      },
      tableData: {
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
  computed: {
    pickerOptions2: function() {
      return {
        disabledDate: time => {
          return time.getTime() < this.platformTime;
        }
      };
    }
  },
  watch: {
    contract_date: function(newVal) {
      this.tableQuery.contract_startdate = newVal[0];
      this.tableQuery.contract_enddate = newVal[1];
    },
    first_date: function(newVal) {
      this.tableQuery.first_startdate = newVal[0];
      this.tableQuery.first_enddate = newVal[1];
    },
    area: function(newVal) {
      Object.assign(this.tableQuery, this.$utils.formatArea(newVal));
    }
  },
  methods: {
    handleCommand(command) {
      console.log(command.command);
      switch (command.command) {
        case "active-company": //厂商激活
          this.openCompanyShow(command.data);
          break;
        case "update-position": //更新定位
          this.updatePosition(command.data);
          break;
        case "renew-platform": //平台续费
          this.renewPlatform(command.data);
          break;
        case "renew-company": //厂商续费
          break;
      }
    },
    // 平台续费
    renewPlatform(scope) {
      this.renew.platformVisible = true;
      this.renew.plateformDate = scope.row.contract_date;
      this.renew.plateformDate = moment(this.renew.plateformDate).format(
        "YYYY-MM-DD"
      );
      if (moment(this.renew.plateformDate).isBefore(new Date())) {
        var currentTime = new Date();
        this.platformTime = currentTime.getTime();
        this.renew.plateformDate = scope.row.contract_date;
      } else {
        var date = new Date(this.renew.plateformDate);
        this.platformTime = date.getTime();
        this.renew.plateformDate = scope.row.contract_date;
      }
    },
    upsubmit(scope) {
      scope.row.contract_date = this.renew.plateformDate;
      AddFeeVehicle(scope.row).then(res => {
        if (res.data.code == 0) {
          this.$message.success(res.data.msg);
          this.renew.platformVisible = false;
          this.getTable();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 平台续费结束
    updatePosition(scope) {
      firstTimeVehicle(scope.row).then(res => {
        if (res.data.code == 0) {
          this.$message.success(res.data.msg);
          this.getTable();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //厂商激活
    openCompanyShow(scope) {
      this.$set(this.openCompany, "vehicle", scope.row);
      this.openCompany.visible = true;
    },
    companySubmit() {
      console.log(this.openCompany);
    },
    openCompanyClosed() {
      //厂商开通关闭
      this.$set(this.openCompany, "postData", {
        img1: "",
        img2: "",
        note: ""
      });
      this.$set(this.openCompany, "vehicle", {});
      this.openCompany.visible = false;
      this.openCompany.addKey += 1;
    },
    // 厂商激活结束
    clearShowDetails() {
      this.$set(this.$data, "showDetailsVehicle", {});
      this.detailsVisible = false;
    },
    showDetails(scope) {
      this.$set(this.$data, "showDetailsVehicle", scope.row);
      this.detailsVisible = true;
    },
    goEdit(scope) {
      this.$router.push({
        path: "new/edit",
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