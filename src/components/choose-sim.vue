<template>
  <div>
    <el-input v-model="sim_no" :placeholder="placeholder" @focus="dialogTableVisible = true">
      <el-button slot="append" icon="el-icon-error" @click="clearChoose">清空</el-button>
      <el-button slot="append" type="primary" icon="el-icon-more" @click="dialogTableVisible = true">选择</el-button>
    </el-input>
    <el-dialog title="选择SIM卡" :visible.sync="dialogTableVisible" width="75%" :append-to-body="true">
      <el-form :model="tableQuery" label-width="100px" size="small" :label-position="isCollapse?'top':'left'">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="添加时间">
              <el-date-picker value-format="yyyyMMdd" v-model="dateRange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" style="width:100%;">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="ICCID卡号">
              <el-input v-model="tableQuery.icc_id" placeholder="ICCID卡号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="SIM卡号">
              <el-input v-model="tableQuery.sim_no" placeholder="SIM卡号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="所属运营商" label-width="82px">
              <el-input v-model="tableQuery.belong" placeholder="所属运营商"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="isCollapse">
            <el-form-item label="分配用户">
              <select-user v-model="tableQuery.user_id" style="width:100%;" :clearable="true"></select-user>
            </el-form-item>
          </el-col>
          <el-col :span="isCollapse?24:6" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
              <el-button type="primary" @click="getTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="tableData.data " v-loading="tableLoading " style="width: 100% " class="admin-table-list" max-height="300">
        <el-table-column prop="time " label="添加时间 " :formatter="(row)=>{return this.$utils.formatDate(row.time)}"></el-table-column>
        <el-table-column prop="icc_id" label="ICCID" :formatter="$utils.baseFormatter">
        </el-table-column>
        <el-table-column prop="sim_no" label="Sim卡号" :formatter="$utils.baseFormatter">
        </el-table-column>
        <el-table-column prop="belong" label="所属运营商" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="real_name" label="分配用户" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="state" label="当前状态" :formatter="(row)=>{return this.$dict.get_sim_state(row.state)}"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" icon="el-icon-check" @click="choose(scope)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getSimList, getSimALlUninstall, getUserAll } from "@/api/index.js";
import selectUser from "@/components/select-user.vue";
export default {
  components: { selectUser },
  data() {
    return {
      dialogTableVisible: false,
      loading: false,
      dateRange: [],
      sim_no: "",
      isCollapse: false,
      tableQuery: {
        sim_no: "",
        state: "",
        belong: "",
        icc_id: "",
        user_id: "",
        start_date: "",
        end_date: "",
        size: 10,
        real_name: "",
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
  watch: {
    sim_no: function() {
      this.$emit("input", this.sim_no);
    },
    dateRange: function(value) {
      value = value || ["", ""];
      this.tableQuery.start_date = value[0];
      this.tableQuery.end_data = value[1];
    },
    value: function() {
      this.sim_no = this.$props.value;
    }
  },
  props: {
    value: [String, Number],
    clearable: Boolean,
    placeholder: {
      type: [String],
      default: "请选择SIM卡号"
    },
    filter: String
  },
  created() {
    this.sim_no = this.value;
    this.getTable();
  },
  methods: {
    //输入选择框
    realNameQuerySearch(queryString, cb) {
      var results = [];
      getUserAll({ real_name: queryString })
        .then(res => {
          if (res.data.code == 0) {
            res.data.data.map(item => {
              item.value = item.real_name;
            });
            results = res.data.data;
          }
          cb(results);
        })
        .catch(() => {
          cb([]);
        });
      // 调用 callback 返回建议列表的数据
    },
    choose(scope) {
      this.sim_no = scope.row.sim_no;
      this.$emit("input", scope.row.sim_no);
      this.dialogTableVisible = false;
    },
    clearChoose() {
      this.sim_no = "";
      this.$emit("input", "");
    },
    getTable() {
      this.tableLoading = true;
      var getSim = getSimList;
      if (this.$props.filter == "uninstall") {
        getSim = getSimALlUninstall;
      }
      getSim(this.tableQuery)
        .then(res => {
          if (res.data.code == 0) {
            this.$set(this.$data, "tableData", res.data);
          } else {
            this.$set(this.$data, "tableData", []);
          }
          this.tableLoading = false;
        })
        .catch(() => {});
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