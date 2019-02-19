<template>
  <div>
    <el-form size="small" label-width="60px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="时间">
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
        <el-col :span="8">
          <el-form-item label="车牌号">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="终端">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align:right">
          <el-form-item label-width="0">
            <el-button type="primary" @click="getTable">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="tableData.data" style="width: 100%">
      <el-table-column prop label="序号" width="55"></el-table-column>
      <el-table-column prop label="抓拍名称"></el-table-column>
      <el-table-column prop label="车牌号"></el-table-column>
      <el-table-column prop label="终端ID"></el-table-column>
      <el-table-column prop label="时间"></el-table-column>
      <el-table-column prop label="备注"></el-table-column>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableQuery: {
        page: 1,
        size: 10,
        time: "",
        license: "",
        device: ""
      },
      tableData: {
        data: [],
        total: 0
      }
    };
  },
  methods: {
    // 查询
    getTable() {},
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