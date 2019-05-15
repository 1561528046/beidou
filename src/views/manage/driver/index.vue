<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form
        :model="tableQuery"
        label-width="150px"
        label-position="left"
        class="table-search"
        size="small"
      >
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="司机身份识别卡编号">
              <el-input v-model="tableQuery.driver_card_id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="司机姓名">
              <el-input v-model="tableQuery.driver_name" placeholder="司机姓名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="身份证号">
              <el-input v-model="tableQuery.identity_id" placeholder="身份证号"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-show="isCollapse" :span="6">
            <el-form-item label="综合评分">
              <el-input
                min="0"
                max="100"
                v-model="tableQuery.num_total_begin"
                style="display:inline-block; width:48%"
              ></el-input>-
              <el-input
                :min="0"
                :max="100"
                v-model="tableQuery.num_total_end"
                style="display:inline-block; width:48%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col v-show="isCollapse" :span="6">
            <el-form-item label="疲劳驾驶">
              <el-input
                :min="0"
                v-model="tableQuery.num_fatigue_driving_begin"
                style="display:inline-block; width:48%"
              ></el-input>-
              <el-input
                :max="100"
                v-model="tableQuery.num_fatigue_driving_end"
                style="display:inline-block; width:48%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col v-show="isCollapse" :span="6">
            <el-form-item label="百公里报警">
              <el-input
                :min="0"
                v-model="tableQuery.num_100km_alarm_begin"
                style="display:inline-block; width:48%"
              ></el-input>-
              <el-input
                :max="100"
                v-model="tableQuery.num_100km_alarm_end"
                style="display:inline-block; width:48%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col v-show="isCollapse" :span="6">
            <el-form-item label="异常驾驶行为">
              <el-input
                :min="0"
                v-model="tableQuery.num_abnormal_driving_begin"
                style="display:inline-block; width:48%"
              ></el-input>-
              <el-input
                :max="100"
                v-model="tableQuery.num_abnormal_driving_end"
                style="display:inline-block; width:48%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col v-show="isCollapse" :span="6">
            <el-form-item label="准点率">
              <el-input
                :min="0"
                v-model="tableQuery.num_punctuality_begin"
                style="display:inline-block; width:48%"
              ></el-input>-
              <el-input
                :max="100"
                v-model="tableQuery.num_punctuality_end"
                style="display:inline-block; width:48%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="isCollapse?24:6" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
              <el-button type="primary" @click="getTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <div class="admin-table-actions">
        <el-button type="primary" @click="exportExcel" size="small">
          <i class="el-icon-download"></i> 导出
        </el-button>
        <el-button type="primary" size="small" @click="addFrom" v-rights="6-1-1">
          <i class="el-icon-upload el-icon--right"></i> 添加
        </el-button>
      </div>
      <el-table
        @sort-change="sorting"
        :data="tableData.data"
        v-loading="tableLoading"
        style="width: 100%"
        class="admin-table-list"
      >
        <el-table-column prop="driver_card_id" label="司机卡编号" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="driver_name" label="姓名" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="tel" label="联系电话" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column
          prop="license_validity"
          label="驾驶证有效期"
          :formatter="(row)=>{return $utils.formatDate(row.begin_date)+'--'+$utils.formatDate(row.end_date) } "
        ></el-table-column>
        <el-table-column
          prop="date"
          label="月份 "
          :formatter="(row)=>{return $utils.formatDate6(row.date)}"
        ></el-table-column>
        <el-table-column prop="identity_id" label="身份证 " :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column sortable="custom" prop="num_fatigue_driving" label="疲劳驾驶"></el-table-column>
        <el-table-column sortable="custom" prop="num_100km_alarm" label="百公里报警"></el-table-column>
        <el-table-column sortable="custom" prop="num_abnormal_driving" label="异常驾驶行为"></el-table-column>
        <el-table-column sortable="custom" prop="num_punctuality" label="准点率"></el-table-column>
        <el-table-column sortable="custom" prop="num_total" label="综合评分"></el-table-column>
        <el-table-column width="400" label="操作">
          <template slot-scope="scope">
            <el-button @click="lookForm(scope)" size="small" icon="el-icon-view">查看详情</el-button>
            <el-button
              size="small"
              @click="updateForm(scope)"
              type="primary"
              icon="el-icon-edit"
              v-rights="6-1-3"
            >编辑</el-button>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-edit"
              @click="openBindingVehicle(scope)"
            >绑定车辆</el-button>
            <el-button size="small" icon="el-icon-delete" @click="delRow(scope)" v-rights="6-1-2">删除</el-button>
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
    </el-card>
    <el-dialog
      title="选择车辆"
      :visible.sync="bindingDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <choose-vehicle @button="bindingVehicle"></choose-vehicle>
    </el-dialog>
    <el-dialog
      title="添加"
      :visible.sync="addDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <add-components @success=" () => {this.getTable();this.addDialog = false;}" :key="addKey"></add-components>
    </el-dialog>
    <el-dialog
      width="44%"
      title="编辑"
      :visible.sync="updateDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <update-components
        :driver_id="updateId"
        @success=" () => {this.getTable();this.updateDialog = false;this.updateId = '';}"
        :key="addKey"
      ></update-components>
    </el-dialog>
    <el-dialog
      width="70%"
      title="司机信息"
      :visible.sync="lookDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <look-components :driver_id="lookId" :key="addKey"></look-components>
    </el-dialog>
  </div>
</template>
<script>
import { getDriverList, delDriver, bindingVehicle } from "@/api/index.js";
import addComponents from "./add.vue";
import updateComponents from "./update.vue";
import lookComponents from "./look.vue";
import chooseVehicle from "@/components/choose-vehicle.vue";
export default {
  components: {
    addComponents,
    updateComponents,
    lookComponents,
    chooseVehicle
  },
  created() {
    this.getTable();
  },
  data() {
    return {
      bindingDriver: {},
      bindingDialog: false,
      lookDialog: false,
      addDialog: false,
      updateDialog: false,
      updateId: "",
      lookId: "",
      isCollapse: false,
      tableLoading: true,
      addKey: 0,
      sadsad: "",
      num_fatigue_driving: "",
      num_bestkm_alarm: "",
      num_abnormal_driving: "",
      num_punctuality: "",
      num_total: "",
      tableQuery: {
        num_fatigue_driving_begin: "", //疲劳驾驶最小值
        num_fatigue_driving_end: "", //疲劳驾驶最大值
        num_abnormal_driving_begin: "", //异常驾驶行为最小值
        num_abnormal_driving_end: "", //异常驾驶行为最大值
        num_100km_alarm_begin: "", //百公里报警最小值
        num_100km_alarm_end: "", //百公里报警最大值
        num_punctuality_begin: "", //准点率最小值
        num_punctuality_end: "", //准点率最大值
        num_total_begin: "", //综合评分最小值
        num_total_end: "", //综合评分最大值
        driver_name: "",
        driver_card_id: "",
        identity_id: "",
        order_field: "",
        order: "",
        size: 10,
        page: 1
      },
      tableData: {
        total: 0,
        data: []
      }
    };
  },
  methods: {
    // 排序
    sorting(column) {
      switch (column.column.label) {
        case "疲劳驾驶":
          this.tableQuery.order_field = 2;
          break;
        case "百公里报警":
          this.tableQuery.order_field = 4;
          break;
        case "异常驾驶行为":
          this.tableQuery.order_field = 3;
          break;
        case "准点率":
          this.tableQuery.order_field = 5;
          break;
        case "综合":
          this.tableQuery.order_field = 1;
          break;
      }
      if (column.order == "ascending") {
        this.tableQuery.order = 1;
      } else if (column.order == "descending") {
        this.tableQuery.order = 2;
      }
      this.getTable();
    },
    // 查看司机信息
    lookForm(scope) {
      this.addKey++;
      this.lookDialog = true;
      this.lookId = scope.row.driver_id;
    },
    //导出excel
    exportExcel() {
      var wsCol = [
        {
          A: "司机卡编号",
          B: "姓名",
          C: "联系电话",
          D: "驾驶证有效期",
          E: "身份证"
        }
      ];
      this.tableData.data.map(data => {
        wsCol.push({
          A: data.driver_card_id,
          B: data.driver_name,
          C: data.tel,
          D: this.$utils.formatDate(data.license_validity),
          E: data.identity_id
        });
      });
      this.$utils.exportExcel({
        data: wsCol,
        sheetName: "司机信息管理",
        fileName: "司机信息管理.xlsx"
      });
    },
    openBindingVehicle(scope) {
      this.bindingDialog = true;
      this.$set(this.$data, "bindingDriver", scope.row);
    },
    bindingVehicle(scope) {
      bindingVehicle({
        driver_id: this.bindingDriver.driver_id,
        vehicle_ids: scope.row.vehicle_id
      })
        .then(res => {
          if (res.data.code == 0) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(() => {});
      this.bindingDialog = false;
      this.$set(this.$data, "bindingDriver", {});
    },
    delRow(scope) {
      //删除
      this.$confirm("确认删除？")
        .then(() => {
          delDriver(scope.row).then(res => {
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
    addFrom() {
      //添加
      this.addKey++;
      this.addDialog = true;
    },
    updateForm(scope) {
      //编辑
      this.addKey++;
      this.updateDialog = true;
      this.updateId = scope.row.driver_id;
    },
    getTable() {
      //获取列表
      this.tableLoading = true;
      var query = Object.assign({}, this.tableQuery);
      getDriverList(query)
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
    }
  }
};
</script>
<style>
.flip-list-move {
  transition: transform 1s;
}
</style>