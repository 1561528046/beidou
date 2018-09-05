
 <template>
  <div class="admin-table-container">
    <el-card shadow="always" class="admin-table-search">
      <el-form :model="tableQuery" ref="baseForm" :rules="rules" label-width="80px" label-position="left" class="table-search" size="small">
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item prop="time" label="时间">
              <el-date-picker v-model="tableQuery.time" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item prop="real_name" label="用户">
              <el-button style=" display:inline-block; width:100%;height:32px;" @click="selectuser">
                <el-input type="text" v-model="tableQuery.real_name" style="position: absolute;left: 0px; top: 0px;"></el-input>
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="10" style="text-align: right;">
            <el-form-item>
              <el-button type="primary" @click="getTable">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card shadow="always">
      <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
        <el-table-column prop="user_name" label="登录账号" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="real_name" label="用户名称" :formatter="$utils.baseFormatter"> </el-table-column>
        <el-table-column prop="login_time" label="开始时间" :formatter="(row)=>{return this.$utils.momentDate(row.login_time)}"> </el-table-column>
        <el-table-column prop="logout_time" label="结束时间" :formatter="(row)=>{return this.$utils.momentDate(row.logout_time)}"> </el-table-column>
        <el-table-column prop="duration" label="时长" :formatter="$utils.baseFormatter"> </el-table-column>
      </el-table>
      <div class="admin-table-pager">
        <el-pagination @size-change="handleSizeChange " @current-change="handleCurrentChange " :current-page="tableQuery.page " :page-sizes="[10, 20, 50, 100] " :page-size="tableQuery.size " :total="tableData.total " layout="total, sizes, prev, pager, next, jumper " background>
        </el-pagination>
      </div>
    </el-card>
    <el-dialog width="30%" title="选择信息" :visible.sync="userDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
      <choose-user @button="user" @success=" () => {this.getTable();this.userDialog = false;}" :key="addKey"></choose-user>
    </el-dialog>
  </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import moment from "moment";
import { getLoginDetailByPage } from "@/api/index.js";
import chooseUser from "@/components/choose-user";
export default {
  components: { chooseUser },
  created() {
    this.keyupSubmit();
  },
  computed: {
    list: function() {
      return this.tableData.data.slice(
        (this.tableQuery.page - 1) * this.tableQuery.size,
        this.tableQuery.page * this.tableQuery.size
      );
    }
  },
  data() {
    return {
      userDialog: false,
      addKey: 0,
      isCollapse: false,
      tableQuery: {
        start_time: "",
        stop_time: "",
        time: "",
        real_name: "",
        user_ids: "",
        size: 10,
        page: 1
      },
      rules: {
        ...rules,
        time: [
          {
            required: true,
            trigger: "change",
            validator: this.validateTime
          }
        ]
      },
      simss: [],
      simee: {},
      tableData: {
        total: 0,
        data: []
      },
      tableLoading: false,
      userdetailShow: false,
      dialog: true
    };
  },
  watch: {},
  methods: {
    // 选择查询方式
    selectuser() {
      this.addKey++;
      this.userDialog = true;
    },
    // 回来的数据
    user(scope) {
      console.log(scope);
      this.userDialog = false;
      for (var i = 0; i < scope.length; i++) {
        this.tableQuery.real_name =
          this.tableQuery.real_name + scope[i].real_name + ",";
      }
      this.tableQuery.real_name = this.tableQuery.real_name.substring(
        0,
        this.tableQuery.real_name.lastIndexOf(",")
      );
    },
    // 查询时间验证
    validateTime(rule, value, callback) {
      var date = moment(value[0]).add(30, "days")._d;
      date = moment(date).format("YYYY-MM-DD HH:mm:ss");
      if (value == "") {
        callback(new Error("请选择时间!"));
        return false;
      } else if (!moment(value[1]).isBefore(date)) {
        callback(new Error("选择时间不能大于30天!"));
        return false;
      } else {
        this.tableQuery.start_time = moment(value[0]).format("YYYYMMDDHHmmss");
        this.tableQuery.stop_time = moment(value[1]).format("YYYYMMDDHHmmss");
        callback();
      }
    },
    //查询列表
    getTable() {
      this.tableLoading = true;
      this.tableQuery.user_ids = "64,65,66,67,68";
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var query = Object.assign({}, this.tableQuery);
          getLoginDetailByPage(query)
            .then(res => {
              if (res.data.code == 0) {
                var data = [];
                for (var i = 0; i < res.data.data.length; i++) {
                  res.data.data[i].license = this.tableQuery.license;
                  res.data.data[
                    i
                  ].license_color = this.tableQuery.license_color;
                  res.data.data[i].overspeed =
                    res.data.data[i].stop_time - res.data.data[i].start_time;
                  data.push(res.data.data[i]);
                }
                this.$set(this.tableData, "data", Object.freeze(data));
                this.$set(this.tableData, "total", this.tableData.data.length);
                this.$emit("success");
                this.$notify({
                  message: res.data.msg,
                  title: "提示",
                  type: "success"
                });
              } else {
                this.$set(this.$data, "tableData", []);
                this.$emit("error");
                this.$notify({
                  message: res.data.msg,
                  title: "提示",
                  type: "error"
                });
              }
            })
            .catch(() => {
              this.$alert("接口错误", "提示", {
                type: "error"
              });
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
      this.tableLoading = false;
    },
    //回车事件
    keyupSubmit() {
      document.onkeydown = e => {
        console.log(e);
        let _key = window.event.keyCode;
        if (_key === 13) {
          this.getTable();
        }
      };
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
<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>