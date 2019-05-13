<template>
  <div class="admin-table-container">
    <el-form :model="tableQuery" label-width="60px" size="small">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="厂商">
            <select-company v-model="tableQuery.company_id" style="width:100%;" :clearable="true"></select-company>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="版本号">
            <el-input v-model="tableQuery.version"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button @click="getTable" type="primary">查询</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="tableData.data" style="width: 100%">
      <el-table-column prop="version" label="版本号"></el-table-column>
      <el-table-column prop="external_type" label="设备类型">
        <template slot-scope="scope">
          <label v-if="scope.row.external_type=='01'">终端</label>
          <label v-if="scope.row.external_type=='02'">保留</label>
          <label v-if="scope.row.external_type=='03'">ADAS</label>
          <label v-if="scope.row.external_type=='04'">DSM</label>
          <label v-if="scope.row.external_type=='05'">BSD</label>
          <label v-if="scope.row.external_type=='06'">TPMS</label>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="small" @click="choosePackage(scope)" type="primary">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { GetListByCompanyId } from "@/api/index.js";
import selectCompany from "@/components/select-company.vue";
export default {
  components: { selectCompany },
  props: {
    data: Object
  },
  created() {
    if (this.$props.data) {
      this.$set(this.$data, "deviceData", this.$props.data);
    } else {
      this.$set(this.$data, "deviceData", "");
    }
    this.$instruction.on("x8105", evt => {
      var data = JSON.parse(evt.data);
      if (data.code == 0) {
        this.$emit("success", this.upgradeData);
      }
    });
  },
  data() {
    return {
      deviceData: {},
      upgradeData: {},
      tableQuery: {
        company_id: "",
        version: ""
      },
      tableData: {
        data: [],
        total: 0
      }
    };
  },
  methods: {
    choosePackage(scope) {
      var data = {};
      var str = "";
      var url = "";
      if (this.deviceData) {
        url =
          scope.row.upload_type == "1" ? scope.row.httpurl : scope.row.filepath;
        str =
          url +
          ";" +
          ";" +
          ";" +
          ";" +
          ";" +
          ";" +
          ";" +
          ";" +
          ";" +
          scope.row.version +
          ";" +
          3600;
        data = {
          SimID:
            this.deviceData.sim_id.length > 11
              ? this.deviceData.sim_id
              : "0" + this.deviceData.sim_id,
          MessageID: "x8105",
          CommandWord: "1",
          CommandParameters: str
        };
        this.$set(this.$data, "upgradeData", scope.row);
        this.$instruction.send(JSON.stringify(data));
      } else {
        this.$emit("success", scope.row);
      }
    },
    getTable() {
      GetListByCompanyId(this.tableQuery).then(res => {
        if (res.data.code == 0) {
          this.$set(this.tableData, "data", res.data.data);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    }
  }
};
</script>