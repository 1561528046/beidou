<template>
  <div style="padding:20px;">
    <el-tabs type="border-card" @tab-click="handleClick">
      <el-tab-pane label="全国联动车辆">
        <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
          <el-row :gutter="30">
            <el-col :span="6">
              <el-form-item label-width="100px" label="故障提交时间">
                <el-date-picker value-format="yyyyMMdd" v-model="tableQuery.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车牌号">
                <el-input v-model="tableOrdinary.license"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户名称">
                <el-input v-model="tableQuery.real_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label="故障类型">
                <el-select v-model="tableQuery.fault_type" style="width:100%;" :clearable="true">
                  <el-option label="设备故障" value="1">设备故障</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label-width="100px" label="状态">
                <el-select v-model="tableQuery.repair_state" style="width:100%;" :clearable="true">
                  <el-option label="未处理" value="1">未处理</el-option>
                  <el-option label="已修复" value="2">已修复</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="isCollapse?24:6" style="text-align: right;">
              <el-form-item>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
                <el-button type="primary">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-card shadow="always">
          <el-table :data="tableData.data" style="width: 100%" class="admin-table-list">
            <el-table-column prop="" label="故障时间" :formatter="(row)=>{return this.$utils.formatDate(row.last_backtime)}"> </el-table-column>
            <el-table-column prop="" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="联系人" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="联系方式" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="所属公司/用户" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="故障类型" :formatter="$utils.baseFormatter"></el-table-column>
            <el-table-column prop="" label="故障原因" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="状态" :formatter="(row)=>{return this.$dict.get_vehiclerepair_state(row.repair_state)}"> </el-table-column>
            <el-table-column label="操作" width="400">
              <template slot-scope="scope">
                <el-button type="warning" @click="submit_repairend" size="small">故障排除</el-button>
                <el-popover placement="left-end" width="800" trigger="click">
                  <el-table>
                    <el-table-column width="150" label="维修时间"></el-table-column>
                    <el-table-column width="150" label="故障原因"></el-table-column>
                    <el-table-column width="150" label="维修状态"></el-table-column>
                    <el-table-column width="150" label="备注"></el-table-column>
                    <el-table-column width="150" label="操作人"></el-table-column>
                  </el-table>
                  <el-button style="margin-left:10px;" size="small" type="success" plain slot="reference" @click="OperateLogList(scope)">查看维修明细</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="admin-table-pager">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
            </el-pagination>
          </div>
        </el-card>
        <el-dialog width="30%" title="" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
          <label>备注：</label>
          <el-input></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="excluded()">确 定</el-button>
            <el-button @click="addDialog = false">取 消</el-button>
          </span>
        </el-dialog>
        <el-dialog width="30%" title="" :visible.sync="delDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
          <label>备注：</label>
          <el-input></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="replace()">确 定</el-button>
            <el-button @click="delDialog = false">取 消</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="普通货车">
        <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
          <el-row :gutter="30">
            <el-col :span="6">
              <el-form-item label-width="100px" label="故障提交时间">
                <el-date-picker value-format="yyyyMMdd" v-model="tableQuery.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车牌号">
                <el-input v-model="tableOrdinary.license"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户名称">
                <el-input v-model="tableQuery.real_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label="故障类型">
                <el-select v-model="tableQuery.fault_type" style="width:100%;" :clearable="true">
                  <el-option label="设备故障" value="1">设备故障</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label-width="100px" label="状态">
                <el-select v-model="tableQuery.repair_state" style="width:100%;" :clearable="true">
                  <el-option label="未处理" value="1">未处理</el-option>
                  <el-option label="已修复" value="2">已修复</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="isCollapse?24:6" style="text-align: right;">
              <el-form-item>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
                <el-button type="primary">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-card shadow="always">
          <el-table :data="tableData.data" style="width: 100%" class="admin-table-list">
            <el-table-column prop="" label="故障时间" :formatter="(row)=>{return this.$utils.formatDate(row.last_backtime)}"> </el-table-column>
            <el-table-column prop="" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="联系人" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="联系方式" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="所属公司/用户" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="故障类型" :formatter="$utils.baseFormatter"></el-table-column>
            <el-table-column prop="" label="故障原因" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="状态" :formatter="(row)=>{return this.$dict.get_vehiclerepair_state(row.repair_state)}"> </el-table-column>
            <el-table-column label="操作" width="400">
              <template slot-scope="scope">
                <el-button type="warning" size="small">故障排除</el-button>
                <el-popover placement="left-end" width="800" trigger="click">
                  <el-table>
                    <el-table-column width="150" label="维修时间"></el-table-column>
                    <el-table-column width="150" label="故障原因"></el-table-column>
                    <el-table-column width="150" label="维修状态"></el-table-column>
                    <el-table-column width="150" label="备注"></el-table-column>
                    <el-table-column width="150" label="操作人"></el-table-column>
                  </el-table>
                  <el-button style="margin-left:10px;" size="small" type="success" plain slot="reference" @click="OperateLogList(scope)">查看维修明细</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="admin-table-pager">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
            </el-pagination>
          </div>
        </el-card>
        <el-dialog width="30%" title="" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
          <label>备注：</label>
          <el-input></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="excluded()">确 定</el-button>
            <el-button @click="addDialog = false">取 消</el-button>
          </span>
        </el-dialog>
        <el-dialog width="30%" title="" :visible.sync="delDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
          <label>备注：</label>
          <el-input></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="replace()">确 定</el-button>
            <el-button @click="delDialog = false">取 消</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="危险品车辆">
        <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
          <el-row :gutter="30">
            <el-col :span="6">
              <el-form-item label-width="100px" label="故障提交时间">
                <el-date-picker value-format="yyyyMMdd" v-model="tableQuery.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车牌号">
                <el-input v-model="tableOrdinary.license"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户名称">
                <el-input v-model="tableQuery.real_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label="故障类型">
                <el-select v-model="tableQuery.fault_type" style="width:100%;" :clearable="true">
                  <el-option label="设备故障" value="1">设备故障</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label-width="100px" label="状态">
                <el-select v-model="tableQuery.repair_state" style="width:100%;" :clearable="true">
                  <el-option label="未处理" value="1">未处理</el-option>
                  <el-option label="已修复" value="2">已修复</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="isCollapse?24:6" style="text-align: right;">
              <el-form-item>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
                <el-button type="primary">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-card shadow="always">
          <el-table :data="tableData.data" style="width: 100%" class="admin-table-list">
            <el-table-column prop="" label="故障时间" :formatter="(row)=>{return this.$utils.formatDate(row.last_backtime)}"> </el-table-column>
            <el-table-column prop="" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="联系人" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="联系方式" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="所属公司/用户" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="故障类型" :formatter="$utils.baseFormatter"></el-table-column>
            <el-table-column prop="" label="故障原因" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="状态" :formatter="(row)=>{return this.$dict.get_vehiclerepair_state(row.repair_state)}"> </el-table-column>
            <el-table-column label="操作" width="400">
              <template slot-scope="scope">
                <el-button type="warning" size="small">故障排除</el-button>
                <el-popover placement="left-end" width="800" trigger="click">
                  <el-table>
                    <el-table-column width="150" label="维修时间"></el-table-column>
                    <el-table-column width="150" label="故障原因"></el-table-column>
                    <el-table-column width="150" label="维修状态"></el-table-column>
                    <el-table-column width="150" label="备注"></el-table-column>
                    <el-table-column width="150" label="操作人"></el-table-column>
                  </el-table>
                  <el-button style="margin-left:10px;" size="small" type="success" plain slot="reference" @click="OperateLogList(scope)">查看维修明细</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="admin-table-pager">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
            </el-pagination>
          </div>
        </el-card>
        <el-dialog width="30%" title="" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
          <label>备注：</label>
          <el-input></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="excluded()">确 定</el-button>
            <el-button @click="addDialog = false">取 消</el-button>
          </span>
        </el-dialog>
        <el-dialog width="30%" title="" :visible.sync="delDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
          <label>备注：</label>
          <el-input></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="replace()">确 定</el-button>
            <el-button @click="delDialog = false">取 消</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="客运车辆">
        <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
          <el-row :gutter="30">
            <el-col :span="6">
              <el-form-item label-width="100px" label="故障提交时间">
                <el-date-picker value-format="yyyyMMdd" v-model="tableQuery.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车牌号">
                <el-input v-model="tableOrdinary.license"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户名称">
                <el-input v-model="tableQuery.real_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label="故障类型">
                <el-select v-model="tableQuery.fault_type" style="width:100%;" :clearable="true">
                  <el-option label="设备故障" value="1">设备故障</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label-width="100px" label="状态">
                <el-select v-model="tableQuery.repair_state" style="width:100%;" :clearable="true">
                  <el-option label="未处理" value="1">未处理</el-option>
                  <el-option label="已修复" value="2">已修复</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="isCollapse?24:6" style="text-align: right;">
              <el-form-item>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
                <el-button type="primary">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-card shadow="always">
          <el-table :data="tableData.data" style="width: 100%" class="admin-table-list">
            <el-table-column prop="" label="故障时间" :formatter="(row)=>{return this.$utils.formatDate(row.last_backtime)}"> </el-table-column>
            <el-table-column prop="" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="联系人" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="联系方式" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="所属公司/用户" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="故障类型" :formatter="$utils.baseFormatter"></el-table-column>
            <el-table-column prop="" label="故障原因" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="" label="状态" :formatter="(row)=>{return this.$dict.get_vehiclerepair_state(row.repair_state)}"> </el-table-column>
            <el-table-column label="操作" width="400">
              <template slot-scope="scope">
                <el-button type="warning" size="small">故障排除</el-button>
                <el-popover placement="left-end" width="800" trigger="click">
                  <el-table>
                    <el-table-column width="150" label="维修时间"></el-table-column>
                    <el-table-column width="150" label="故障原因"></el-table-column>
                    <el-table-column width="150" label="维修状态"></el-table-column>
                    <el-table-column width="150" label="备注"></el-table-column>
                    <el-table-column width="150" label="操作人"></el-table-column>
                  </el-table>
                  <el-button style="margin-left:10px;" size="small" type="success" plain slot="reference" @click="OperateLogList(scope)">查看维修明细</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="admin-table-pager">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
            </el-pagination>
          </div>
        </el-card>
        <el-dialog width="30%" title="" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
          <label>备注：</label>
          <el-input></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="excluded()">确 定</el-button>
            <el-button @click="addDialog = false">取 消</el-button>
          </span>
        </el-dialog>
        <el-dialog width="30%" title="" :visible.sync="delDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
          <label>备注：</label>
          <el-input></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="replace()">确 定</el-button>
            <el-button @click="delDialog = false">取 消</el-button>
          </span>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getVehicleList } from "@/api/index.js";
import selectCityInput from "@/components/select-city-input.vue";
export default {
  components: { selectCityInput },
  created() {
    this.getTable();
  },
  props: {
    vehicle_type: Number, //vehicle_type区分普货和其他类型车辆
    state: Number //state: 1新增车辆 2定位车辆 3到期车辆
  },
  data() {
    return {
      addDialog: false,
      delDialog: false,
      addKey: 0,
      isCollapse: false,
      first_online_time: [], //首次入网 时间范围
      tableQuery: {
        type: this.$props.type,
        state: this.$props.state,
        user_id: 1,
        size: 10,
        page: 1
      },
      tableOrdinary: {
        real_name: "",
        license: "",
        start_time: "",
        stop_time: "",
        time: [],
        fault_type: "",
        repair_state: ""
      },
      tableData: {
        area: [],
        total: 0,
        data: []
      },
      tableLoading: true,
      pickerOptions: {
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
    first_online_time: function() {
      this.tableQuery.first_online_time_start = this.first_online_time[0];
      this.tableQuery.first_online_time_end = this.first_online_time[1];
    }
  },
  methods: {
    handleClick(tab) {
      console.log(tab.label);
    },
    // 故障排除
    submit_repairend() {
      this.addKey++;
      this.addDialog = true;
    },
    excluded() {},
    // 设备更换
    submit_devicechange() {
      this.addKey++;
      this.delDialog = true;
    },
    replace() {},
    // 查看维修明细
    OperateLogList() {
      // getOperateLogList({ device_id: scope.row.device_id }).then(res => {
      //   if (res.data.code == 0) {
      //     this.gridData = res.data.data;
      //   } else {
      //     this.$message.error(res.data.msg);
      //   }
      // });
    },
    //获取故障列表
    getTable() {
      this.tableLoading = true;
      var query = Object.assign({}, this.tableQuery, this.tableQuery.area);
      delete query.area;
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
    },
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
    }
  }
};
</script>
