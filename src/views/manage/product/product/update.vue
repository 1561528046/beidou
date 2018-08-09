<template>
  <div style="text-align: center; width:1000px;">
    <el-form status-icon :rules=" rules " :model="formData " ref="baseForm ">
      <!-- <el-row :gutter="30 ">
            </el-row> -->
      <el-form-item label="定位终端-授权车辆">
        <el-table size="mini" :data="device" border style="width: 100%; margin-top: 20px">
          <el-table-column prop="device_name" label="名称" width="120">
          </el-table-column>
          <el-table-column prop="type" label="类型">
          </el-table-column>
          <el-table-column prop="amount1" label="单价">
            <template slot-scope="scope">
              <el-input placeholder="0" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amount2" label="优惠金额(元)">
            <template slot-scope="scope">
              <el-input placeholder="0" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amount3" label="收费方式" width="160">
            <template slot-scope="scope">
              <el-radio-group>
                <el-radio label="计费"></el-radio>
                <el-radio label="充值"></el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="终端厂商">
        <el-table size="mini" :data="company" :span-method="objectSpanMethod" border style="width: 100%; margin-top: 20px">
          <el-table-column prop="id" label="名称" width="250">
            <template slot-scope="scope">
              <select-company style="width:100%;" :clearable="true"></select-company>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="类型">
          </el-table-column>
          <el-table-column prop="amount1" label="单价">
            <template slot-scope="scope">
              <el-input placeholder="0" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amount2" label="优惠金额(元)">
            <template slot-scope="scope">
              <el-input placeholder="0" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amount3" label="收费方式" width="160">
            <template slot-scope="scope">
              <el-radio-group>
                <el-radio label="计费"></el-radio>
                <el-radio label="充值"></el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="90">
            <template slot-scope="scope">
              <el-button size="small" icon="el-icon-delete" @click.native.prevent="deleteRow(scope.$index, company)">删除</el-button>
              <el-button style="margin-left:0;" size="small" icon="el-icon-delete" @click.native.prevent="addRow(scope.$index, company)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="短信">
        <el-table size="mini" :data="sms" border style="width: 100%; margin-top: 20px">
          <el-table-column prop="name" label="名称">
          </el-table-column>
          <el-table-column prop="amount1" label="单价">
            <template slot-scope="scope">
              <el-input placeholder="0" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amount1" label="数量">
            <template slot-scope="scope">
              <el-input placeholder="0" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amount2" label="优惠金额(元)">
            <template slot-scope="scope">
              <el-input placeholder="0" size="mini"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amount3" label="收费方式" width="160">
            <template slot-scope="scope">
              <el-radio-group>
                <el-radio label="计费"></el-radio>
                <el-radio label="充值"></el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item style="text-align:center; ">
        <el-button type="primary " @click="formSubmit " size="large ">提交</el-button>
      </el-form-item>

      <!-- <button @click="$router.go(-1) ">a</button> -->
    </el-form>
  </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import selectCompany from "@/components/select-company.vue";
import { addDeviceCompany } from "@/api/index.js";
export default {
  data() {
    return {
      formData: {
        area: []
      },
      device: [
        {
          device_name: "定位终端",
          type: "新增"
        },
        {
          device_name: "定位终端",
          type: "续费"
        },
        {
          device_name: "定位终端",
          type: "转网"
        },
        {
          device_name: "视频终端",
          type: "新增"
        },
        {
          device_name: "视频终端",
          type: "续费"
        },
        {
          device_name: "视频终端",
          type: "转网"
        }
      ],
      company: [
        {
          id: "12987122",
          name: "开通",
          amount1: "0",
          amount2: "0",
          amount3: 10,
          address: "计费"
        },
        {
          id: "12987123",
          name: "续费",
          amount1: "0",
          amount2: "0",
          amount3: 12,
          address: "计费"
        }
      ],
      sms: [
        {
          id: "12987122",
          name: "短信",
          amount1: "0",
          amount2: "0",
          amount3: 10,
          address: "计费"
        }
      ],
      rules: {
        ...rules
      }
    };
  },
  computed: {},
  created() {},
  methods: {
    formSubmit() {
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var areaObj = this.$utils.formatArea(this.formData.area);
          var postData = Object.assign({}, this.formData, areaObj);
          postData.device_total = postData.device_total || 0;
          addDeviceCompany(postData)
            .then(res => {
              if (res.data.code == 0) {
                this.$emit("success");
                this.$message.success(res.data.msg);
              } else {
                this.$emit("error");
                this.$message.error(res.data.msg);
              }
            })
            .catch(() => {
              this.$message.error("接口错误");
              this.$emit("error");
            });
        } else {
          var errormsg = "";
          for (var key in errorItem) {
            errormsg += errorItem[key][0].message + "<br>";
          }
          this.$notify.error({
            title: "错误",
            dangerouslyUseHTMLString: true,
            message: errormsg
          });
        }
      });
    },
    // 厂商删除
    deleteRow(index, rows) {
      rows.splice(index, 2);
    },
    //添加厂商
    // addRow(index, rows) {
    //   rows.splice(index + 2, 0,{},{});
    // },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }

      if (columnIndex === 5) {
        if (rowIndex === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    }
  },
  components: { selectCompany }
};
</script>
<style>
</style>