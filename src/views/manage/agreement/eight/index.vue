<template>
  <div class="admin-table-container">
    <el-card shadow="always">
      <div class="admin-table-actions">
        <el-button type="primary" size="small" @click="addForm">
          <i class="el-icon-upload el-icon--right"></i> 添加
        </el-button>
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="" label="标注"></el-table-column>
        <el-table-column prop="" label="IP"></el-table-column>
        <el-table-column prop="" label="端口号"></el-table-column>
        <el-table-column prop="" label="状态"></el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button size="small" type="primary" icon="el-icon-edit">分车</el-button>
            <el-button size="small" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="small" icon="el-icon-delete">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </el-card>
    <el-dialog title="添加" width="20%" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
      <add-agreement :parent_id="parent_id" @success=" () => {this.getTable();this.addDialog = false;}" :key="addKey"></add-agreement>
    </el-dialog>
  </div>
</template>
<script>
import addAgreement from "./add.vue";
export default {
  components: { addAgreement },
  created() {
    this.getTable();
  },
  data() {
    return {
      addDialog: false,
      parent_id: "",
      updateDialog: false,
      updateId: "",
      repairDialog: false,
      repairId: "",
      scrapDialog: false,
      scrapId: "",
      uploadDialog: false,
      isCollapse: false,
      dateRange: "",
      tableQuery: {
        device_type: "",
        device_id: "",
        company_name: "",
        company_id: "",
        real_name: "",
        user_id: "",
        sim_id: "",
        start_date: "",
        end_date: "",
        state: "",
        size: 10,
        page: 1
      },
      tableData: {
        total: 0,
        data: []
      },
      tableLoading: true,
      addKey: 0,
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
    // 拆分时间段
    dateRange: function(arr) {
      arr = arr || ["", ""];
      this.tableQuery.start_date = arr[0];
      this.tableQuery.end_date = arr[1];
    },
    "tableQuery.real_name": function() {
      this.tableQuery.user_id = "";
    }
  },
  methods: {
    // 添加
    addForm() {
      this.addDialog = true;
    },
    //获取设备列表
    getTable() {
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
    },
    uploadSuccess() {},
    uploadError() {
      alert(1);
    },
    uploadProgress() {}
  }
};
</script>