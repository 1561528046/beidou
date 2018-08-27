<template>
  <div>
    <el-button type="text" @click="dialogTableVisible = true">打开嵌套表格的 Dialog</el-button>
    <el-dialog title="收货地址" :visible.sync="dialogTableVisible">
      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="添加时间" label-width="82px">
              <el-date-picker value-format="yyyyMMdd" v-model="dateRange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
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
              <el-autocomplete style="width: 100%;" class="inline-input" v-model="tableQuery.real_name" :fetch-suggestions="realNameQuerySearch" placeholder="请输入内容" :trigger-on-focus="false" @select="realNameHandleSelect">
              </el-autocomplete>
            </el-form-item>
          </el-col>
          <el-col :span="isCollapse?18:6" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
              <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
              <el-button type="primary" @click="getTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="tableData.data " v-loading="tableLoading " style="width: 100% " class="admin-table-list">
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
            <el-button size="small" @click="updateForm(scope)" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="small" icon="el-icon-delete" @click="delRow(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
      <!-- <el-select v-model="sim_no" :placeholder="placeholder" filterable remote :remote-method="remoteMethod" :loading="loading" style="width: 100%;" :clearable="clearable">
        <el-option v-for="item in list" :key="item.sim_no" :label="item.sim_no" :value="item.sim_no">
        </el-option>
      </el-select> -->
    </el-dialog>
  </div>
</template>
<script>
import { getSimList, getUserAll } from "@/api/index.js";
export default {
  data() {
    return {
      dialogTableVisible: false,
      loading: false,
      sim_no: "",
      list: [],
      tableQuery: {
        sim_no: "",
        state: "",
        belong: "",
        icc_id: "",
        user_id: "",
        startDate: "",
        endDate: "",
        size: 10,
        real_name: "",
        page: 1
      },
      tableData: {
        total: 0,
        data: []
      },
      tableLoading: true,
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
      }
    };
  },
  watch: {
    sim_no: function() {
      this.$emit("input", this.sim_no);
    },
    value: function() {
      this.sim_no = this.$props.value;
    }
  },
  props: {
    value: [String, Number],
    state: Number,
    clearable: Boolean,
    placeholder: {
      type: [String],
      default: "请输入公司/个人名称搜索"
    }
  },
  created() {
    this.sim_no = this.value;
    this.initData();
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
    realNameHandleSelect(item) {
      this.$nextTick(() => {
        this.tableQuery.user_id = item.user_id || "";
      });
    },
    getTable() {
      this.tableLoading = true;
      if (this.tableQuery.real_name == "") {
        this.tableQuery.user_id = "";
      }
      getSimList(this.tableQuery)
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
    // initData() {
    //   if (!this.sim_no || this.sim_no < 3) {
    //     return false;
    //   }
    //   getSimAll({ sim_no: this.sim_no, state: this.$props.state }).then(res => {
    //     if (res.data.code == 0) {
    //       this.$set(this.$data, "list", res.data.data);
    //     } else {
    //       this.sim_no = "";
    //     }
    //   });
    // },
    // remoteMethod(query) {
    //   if (query < 3) {
    //     return false;
    //   }
    //   getSimAll({ sim_no: query, state: this.$props.state }).then(res => {
    //     if (res.data.code == 0) {
    //       this.$set(this.$data, "list", res.data.data);
    //     } else {
    //       this.$set(this.$data, "list", []);
    //     }
    //   });
    // }
  }
};
</script>