<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">

      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="时间">
              <el-date-picker value-format="yyyyMMddHHmmss" v-model="tableQuery.Time" type="datetimerange" :picker-options="pickerOptions2" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="车辆">
              <template>
                <el-select v-model="tableQuery.simId" style="width:100%;" placeholder="请选择" :clearable="true">
                  <el-option label="1" value="1"></el-option>
                </el-select>
              </template>
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

      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="time" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="time" label="车牌颜色" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="time" label="所属组织" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="time" label="时间" :formatter="(row)=>{return this.$utils.formatDate(row.time)}"> </el-table-column>
        <el-table-column prop="time" label="行驶里程" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="time" label="当时位置" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="time" label="速度(公里/时)" :formatter="$utils.baseFormatter"> </el-table-column>>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange " @current-change="handleCurrentChange " :current-page="tableQuery.page " :page-sizes="[10, 20, 50, 100] " :page-size="tableQuery.size " :total="tableData.total " layout="total, sizes, prev, pager, next, jumper " background>
        </el-pagination>
        <select-pager :total="model.total" :size="model.size" :page="model.page" :changge="pageFn"></select-pager>
      </div>
    </el-card>

  </div>
</template>
<script>
import { getReport } from "@/api/index.js";
import selectPager from "@/components/select-pager.vue";
export default {
  components: { selectPager },
  created() {
    this.getTable();
    this.keyupSubmit();
  },
  data() {
    return {
      model: {
        total: [], //总页数
        size: 10, //每页显示条目个数不传默认10
        page: 1 //当前页码
      },
      isCollapse: false,
      tableQuery: {
        beginTime: "20180822161756",
        endTime: "20180823101826",
        Time: "",
        simId: "064620623980",
        size: 10,
        page: 1
      },
      simss: [],
      simee: {},
      tableData: {
        total: 0,
        data: []
      },
      pickerOptions2: {
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
      },
      tableLoading: true,
      addKey: 0,
      userdetailShow: false
    };
  },
  mounted() {},
  methods: {
    pageFn(val) {
      this.model.page = val;
    },
    //查询列表
    getTable() {
      this.tableLoading = true;
      var query = Object.assign({}, this.tableQuery);
      getReport(query)
        .then(res => {
          console.log(res);
          if (res.data.code == 0) {
            console.log(res.data.data);
            this.$set(this.$data, "tableData", res.data);
          } else {
            this.$set(this.$data, "tableData", []);
            this.$message.error(res.data.msg);
          }
          this.tableLoading = false;
        })
        .catch(() => {});
    },
    //回车事件
    keyupSubmit() {
      document.onkeydown = e => {
        console.log(e);
        let _key = window.event.keyCode;
        if (_key === 13) {
          this.getTable();
        }
      };
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
 