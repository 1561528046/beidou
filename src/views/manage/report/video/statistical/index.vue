<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form
        :model="tableQuery"
        ref="baseForm"
        :rules="rules"
        label-width="80px"
        label-position="left"
        class="table-search"
        size="small"
      >
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item prop="time" label="时间">
              <el-date-picker
                v-model="tableQuery.time"
                value-format="yyyyMMddHHmmss"
                format="yyyy-MM-dd HH:mm"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="sim_id" label="选择车辆">
              <el-button style=" display:inline-block; width:100%;height:32px;" @click="addFrom">
                <el-input
                  type="text"
                  v-model="tableQuery.sim_id"
                  style="position: absolute;left: 0px; top: 0px;"
                ></el-input>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :offset="isCollapse?0:6" :span="isCollapse?24:4" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="getTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <div class="admin-table-actions">
        <el-button type="primary" size="small">
          <i class="el-icon-download"></i> 导出
        </el-button>
      </div>
      <el-table :data="list" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column
          prop="license"
          label="车牌号"
          :formatter="(row)=>{return this.$utils.get_license_color(row.license_color)}"
        ></el-table-column>
        <el-table-column
          prop="time"
          label="开始时间"
          :formatter="(row)=>{return this.$utils.formatDate14(JSON.stringify(row.time))}"
        ></el-table-column>
        <el-table-column
          prop="time"
          label="结束时间"
          :formatter="(row)=>{return this.$utils.formatDate14(JSON.stringify(row.time))}"
        ></el-table-column>
        <el-table-column prop label="摄像头无信号报警" :formatter="$utils.baseFormatter "></el-table-column>
        <el-table-column prop label="摄像头遮挡报警" :formatter="$utils.baseFormatter "></el-table-column>
        <el-table-column prop label="移动侦测报警" :formatter="$utils.baseFormatter "></el-table-column>
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
      width="30%"
      title="选择信息"
      :visible.sync="addDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :center="true"
      class="admin-dialog"
    >
      <choose-car
        @button="xz"
        @success=" () => {this.getTable();this.addDialog = false;}"
        :key="addKey"
      ></choose-car>
    </el-dialog>
  </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import moment from "moment";
import { getReport } from "@/api/index.js";
import chooseCar from "@/components/choose-vehicle.vue";
export default {
  components: { chooseCar },
  created() {},
  computed: {
    list: function() {
      return this.tableData.data.slice(
        (this.tableQuery.page - 1) * this.tableQuery.size,
        this.tableQuery.page * this.tableQuery.size
      );
    }
  },
  data() {
    return {
      addDialog: false,
      addKey: 0,
      isCollapse: false,
      tableQuery: {
        begin_time: "",
        end_time: "",
        time: "",
        sim_id: "",
        size: 10,
        page: 1
      },
      rules: {
        ...rules,
        sim_id: [
          {
            required: true,
            trigger: "change",
            message: "请输入simid!"
          }
        ],
        time: [
          {
            required: true,
            trigger: "change",
            validator: this.validateTime
          }
        ]
      },
      simss: [],
      simee: {},
      tableData: {
        total: 0,
        data: []
      },
      tableLoading: false,
      userdetailShow: false,
      dialog: true
    };
  },
  watch: {
    dialog: function() {
      this.addDialog = this.dialog;
    }
  },
  methods: {
    // 选择查询方式
    addFrom() {
      this.addKey++;
      this.addDialog = true;
      this.dialog = true;
    },
    // 回来的数据
    xz(scope) {
      this.dialog = scope.row.dialog;
      this.tableQuery.sim_id = scope.row.license;
    },
    // 查询时间验证
    validateTime(rule, value, callback) {
      var date = moment(value[0]).add(3, "days")._d;
      date = moment(date).format("YYYY-MM-DD HH:mm:ss");
      if (value == "") {
        callback(new Error("请选择时间!"));
        return false;
      } else if (!moment(value[1]).isBefore(date)) {
        callback(new Error("选择时间不能大于3天!"));
        return false;
      } else {
        this.tableQuery.start_time = value[0];
        this.tableQuery.stop_time = value[1];
        callback();
      }
    },
    //查询列表
    getTable() {
      this.tableLoading = true;
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var query = Object.assign({}, this.tableQuery);
          getReport(query)
            .then(res => {
              if (res.data.code == 0) {
                var data = [];
                for (var i = 0; i < res.data.data.length; i++) {
                  data.push(res.data.data[i]);
                }
                this.$set(this.tableData, "data", Object.freeze(data));
                this.$set(this.tableData, "total", this.tableData.data.length);
                this.$emit("success");
                this.$notify({
                  message: res.data.msg,
                  title: "提示",
                  type: "success"
                });
              } else {
                this.$set(this.$data, "tableData", []);
                this.$emit("error");
                this.$notify({
                  message: res.data.msg,
                  title: "提示",
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$alert("接口错误", "提示", {
                type: "error"
              });
              this.$emit("error");
            });
        } else {
          var errormsg = "";
          for (var key in errorItem) {
            errormsg += errorItem[key][0].message + "<br>";
          }
          this.$notify.error({
            title: "错误",
            dangerouslyUseHTMLString: true,
            message: errormsg
          });
        }
      });
      this.tableLoading = false;
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
 