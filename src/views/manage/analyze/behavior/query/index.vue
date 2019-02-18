<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form :model="tableQuery" size="small" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
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
          <el-col :span="6">
            <el-form-item label="车辆">
              <el-input
                @focus="selectvehicle"
                type="text"
                v-model="tableQuery.license"
                style="position: absolute;left: 0px; top: 0px;"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报警类型"></el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="处理情况">
              <el-select style="width:100%" clearable v-model="tableQuery.situation">
                <el-option value="1" label="未处理">未处理</el-option>
                <el-option value="2" label="已处理">已处理</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="报警时长">
              <el-input style="width:100%" placeholder="请输入报警时长"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18" style="text-align:right">
            <el-form-item>
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
        <el-table-column prop label="序号"></el-table-column>
        <el-table-column prop label="车牌号"></el-table-column>
        <el-table-column prop label="车牌颜色"></el-table-column>
        <el-table-column prop label="所属公司"></el-table-column>
        <el-table-column prop label="报警类型"></el-table-column>
        <el-table-column prop label="报警来源"></el-table-column>
        <el-table-column prop label="报警时长"></el-table-column>
        <el-table-column prop label="报警信息"></el-table-column>
        <el-table-column prop label="开始时间"></el-table-column>
        <el-table-column prop label="结束时间"></el-table-column>
        <el-table-column prop label="开始速度"></el-table-column>
        <el-table-column prop label="结束速度"></el-table-column>
        <el-table-column prop label="开始位置"></el-table-column>
        <el-table-column prop label="结束位置"></el-table-column>
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
  </div>
</template>
<script>
export default {
  data() {
    return {
      addKey: 0,
      vehicleDialog: false,
      tableQuery: {
        time: "",
        license: "",
        situation: "",
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
    //  导出
    exportExcel() {},
    // 选择车辆
    selectvehicle() {
      this.addKey++;
      this.vehicleDialog = true;
    },
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