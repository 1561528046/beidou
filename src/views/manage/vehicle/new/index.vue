<template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="6">
            <el-form-item label="审批人">
              <el-input v-model="tableQuery.user" placeholder="审批人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审批人">
              <el-input v-model="tableQuery.user" placeholder="审批人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审批人">
              <el-input v-model="tableQuery.user" placeholder="审批人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isCollapse">
            <el-form-item label="活动区域">
              <el-select v-model="tableQuery.region" placeholder="活动区域" style="width:100%;">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-show="isCollapse">
            <el-form-item label="审批人">
              <el-input v-model="tableQuery.user" placeholder="审批人"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="isCollapse?24:6" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="isCollapse=!isCollapse">展开</el-button>
              <el-button type="primary" @click="getTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <div class="admin-table-actions">
        <router-link :to="{path:'new/add'}">
          <el-button type="primary" size="small">
            <i class="el-icon-upload el-icon--right"></i> 添加
          </el-button>
        </router-link>
        &nbsp;

        <el-button type="primary" size="small">导出
          <i class="el-icon-upload el-icon--right"></i>
        </el-button>
      </div>
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="driver_card_id" label="司机卡编号" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="driver_name" label="姓名" :formatter="$utils.baseFormatter"></el-table-column>
        <el-table-column prop="tel" label="联系电话" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="license_validity" label="驾驶证有效期" :formatter="(row)=>{return $utils.formatDate(row.license_validity)}">
        </el-table-column>
        <el-table-column prop="identity_id" label="身份证 " :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="small" @click="updateForm(scope)" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="small" type="primary" icon="el-icon-edit">绑定车辆</el-button>
            <el-button size="small" icon="el-icon-delete" @click="delRow(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
/* eslint-disable */
import { getVehicleList } from "@/api/index.js";
console.log(getVehicleList);
export default {
  created() {
    this.getTable();
  },
  props: {
    vehicle_type: Number, //vehicle_type区分普货和其他类型车辆
    state: Number //state: 1新增车辆 2定位车辆 3到期车辆
  },
  data() {
    return {
      isCollapse: false,
      tableQuery: {
        type: this.$props.type,
        state: this.$props.state,
        user_id: 1,
        size: 10,
        page: 1
      },
      tableData: {
        total: 0,
        data: []
      },
      tableLoading: true
    };
  },
  methods: {
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
    },
    getTable() {
      //获取列表
      this.tableLoading = true;
      var query = Object.assign({}, this.tableQuery);
      getVehicleList(query)
        .then(res => {
          if (res.data.code == 0) {
            this.$set(this.$data, "tableData", res.data);
          } else {
            this.$set(this.$data, "tableData", []);
            this.$message.error(res.data.msg);
          }
          this.tableLoading = false;
        })
        .catch(() => {});
    }
  }
};
</script>