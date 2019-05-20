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
            <el-form-item label="驾驶证号">
              <el-input v-model="tableQuery.identity_id" placeholder="驾驶证号"></el-input>
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
    <el-card shadow="always" class="admin-table-search">
      <el-table
        @sort-change="sorting"
        :data="tableData.data"
        style="width: 100%"
        class="admin-table-list"
      >
        <el-table-column prop="driver_name" label="司机姓名" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="identity_id" label="驾驶证号 " :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column
          prop="date"
          label="月份 "
          :formatter="(row)=>{return $utils.formatDate6(row.date)}"
        ></el-table-column>
        <el-table-column sortable="custom" prop="num_fatigue_driving" label="疲劳驾驶"></el-table-column>
        <el-table-column sortable="custom" prop="num_100km_alarm" label="百公里报警"></el-table-column>
        <el-table-column sortable="custom" prop="num_abnormal_driving" label="异常驾驶行为"></el-table-column>
        <el-table-column sortable="custom" prop="num_punctuality" label="准点率"></el-table-column>
        <el-table-column sortable="custom" prop="num_total" label="综合评分"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="lookForm(scope)" size="small" icon="el-icon-view">查看详情</el-button>
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
import lookComponents from "./look.vue";
import { GetListStatisticsByPage } from "@/api/index.js";
export default {
  components: { lookComponents },
  created() {
    this.getTable();
  },
  data() {
    return {
      addKey: 0,
      lookDialog: false,
      isCollapse: false,
      lookId: "",
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
        data: [],
        total: 0
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
    getTable() {
      GetListStatisticsByPage(this.tableQuery).then(res => {
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
    // 查看司机信息
    lookForm(scope) {
      this.addKey++;
      this.lookDialog = true;
      this.lookId = scope.row.driver_id;
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