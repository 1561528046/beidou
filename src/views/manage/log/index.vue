<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form size="small" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-form-item label="终端ID">
              <el-input placeholder="请输入终端ID"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="归属企业">
              <el-input placeholder="请输入归属企业"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="查阅用户">
              <el-input placeholder="请输入查阅用户"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="查阅时间">
              <el-date-picker
                style="width:100%"
                v-model="time"
                range-separator="至"
                type="datetimerange"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4" style="text-align:center">
            <el-form-item label-width="0">
              <el-button @click="getTable" type="primary">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always" class="admin-table-search">
      <div class="admin-table-actions">
        <el-button type="primary" @click="exportExcel" size="small">
          <i class="el-icon-download"></i> 导出
        </el-button>
      </div>
      <el-table :data="tableData.data" style="width: 100%">
        <el-table-column prop label="终端ID"></el-table-column>
        <el-table-column prop label="归属企业"></el-table-column>
        <el-table-column prop label="音视频名称"></el-table-column>
        <el-table-column prop label="音视频日期"></el-table-column>
        <el-table-column prop label="查阅用户"></el-table-column>
        <el-table-column prop label="查阅时间"></el-table-column>
        <el-table-column prop label="流量"></el-table-column>
        <el-table-column prop label="次数"></el-table-column>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      time: "",
      tableQuery: {
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
    // 导出
    exportExcel() {},
    //查询
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