<template>
  <div>
    <el-form :model="tableQuery" label-width="60px" @submit.native.prevent>
      <el-row :gutter="30">
        <el-col :span="8">
          <el-form-item label="车牌号">
            <el-input size="small" v-model="tableQuery.license" placeholder="车牌号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户名">
            <el-input size="small" v-model="tableQuery.owner" placeholder="用户名"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="终端ID">
            <el-input size="small" v-model="tableQuery.device_no" placeholder="终端ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="isCollapse">
          <el-form-item label="SIM ID">
            <el-input size="small" v-model="tableQuery.sim_id" placeholder="SIM ID"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="isCollapse?16:24" style="text-align: right;">
          <el-form-item>
            <el-button type="primary" @click="isCollapse=!isCollapse" size="small" v-if="!isCollapse">展开</el-button>
            <el-button type="primary" @click="isCollapse=!isCollapse" size="small" v-if="isCollapse">收起</el-button>
            <el-button type="primary" size="small" @click="getTable" native-type="submit">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="tableData.data" @select-all="selectAll" @select="selectHandler" ref="vechileTable" style="width: 100%" class="admin-table-list">
      <el-table-column type="selection" label="状态" width="100">
      </el-table-column>
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="owner" label="用户名" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="device_no" label="终端ID" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="sim_id" label="SIM ID" :formatter="$utils.baseFormatter"> </el-table-column>
    </el-table>
    <div style="width:56px; margin:0 auto; margin-top:10px;">
      <el-button type="primary" size="small" @click="formSubmit">提交</el-button>
    </div>
    <div class="admin-table-pager">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getVehicleAll } from "@/api/index.js";
export default {
  created() {
    this.getTable();
  },
  props: {
    // selected: Array
  },
  data() {
    return {
      selection: [],
      vehicle: [],
      isCollapse: false,
      tableQuery: {
        page: 1,
        size: 10,
        license: "",
        device_no: "",
        sim_id: "",
        owner: ""
      },
      tableData: {
        total: 0,
        data: []
      }
    };
  },
  methods: {
    selectHandler(allSelected, currentRow) {
      var isChecked = false;
      if (allSelected.length != 0) {
        allSelected.map(item => {
          if (item.vehicle_id == currentRow.vehicle_id) {
            isChecked = true;
          }
        });
      }

      if (isChecked) {
        //处理选中
        if (!this.selection.includes(currentRow.vehicle_id)) {
          this.selection.push(currentRow.vehicle_id);
          this.vehicle.push(currentRow);
        }
      } else {
        //处理取消
        var index = this.selection.indexOf(currentRow.vehicle_id);
        if (index != -1) {
          this.selection.splice(index, 1);
          this.vehicle.splice(index, 1);
        }
      }
    },
    selectAll(allSelected) {
      var state = false;
      // 可以根据allSelected的长度判断是全选还是取消全选
      if (allSelected.length != 0) {
        state = true;
      }
      if (state) {
        allSelected.map(item => {
          if (!this.selection.includes(item.vehicle_id)) {
            this.selection.push(item.vehicle_id);
            this.vehicle.push(item);
          }
        });
      } else {
        this.tableData.data.map(olditem => {
          this.selection.map(item => {
            if (item == olditem.vehicle_id) {
              var index = this.selection.indexOf(item);
              if (index != -1) {
                this.selection.splice(index, 1);
                this.vehicle.splice(index, 1);
                return;
              }
            }
          });
        });
      }
    },
    getTable() {
      getVehicleAll(this.tableQuery).then(res => {
        if (res.data.code == 0) {
          this.$set(this.tableData, "data", res.data.data);
          this.$set(this.tableData, "total", res.data.total);
          this.$nextTick(() => {
            this.tableData.data.map(vehicle => {
              if (this.selection.includes(vehicle.vehicle_id)) {
                this.$refs.vechileTable.toggleRowSelection(vehicle, true);
              }
            });
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    formSubmit() {
      this.$emit("choose", JSON.parse(JSON.stringify(this.vehicle)));
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
