<template>
  <div>
    <el-form :model="tableQuery" size="small" label-width="70px">
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
          <el-form-item label="终端">
            <el-input style="width:100%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报警类型">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态">
            <el-select style="width:100%" v-model="tableQuery.state">
              <el-option value="1" label="已处理">已处理</el-option>
              <el-option value="2" label="未处理">未处理</el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16" style="text-align:right">
          <el-form-item label-width="0">
            <el-button type="primary">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="tableData.data" style="width: 100%">
      <el-table-column prop label="序号" width="55"></el-table-column>
      <el-table-column prop="license" label="车牌号"></el-table-column>
      <el-table-column prop label="监控通道"></el-table-column>
      <el-table-column prop label="报警类型"></el-table-column>
      <el-table-column prop label="位置"></el-table-column>
      <el-table-column prop label="时间"></el-table-column>
      <el-table-column prop label="处理状况"></el-table-column>
      <el-table-column prop label="处理人"></el-table-column>
      <el-table-column prop label="处理时间"></el-table-column>
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
        time: "",
        state: "",
        page: 1,
        size: 10
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