<template>
  <div style="padding:20px;">
    <el-tabs type="border-card" @tab-click="handleClick">
      <!-- <el-tab-pane label="全国联动车辆">
        <el-form :model="tableRepair" label-width="80px" label-position="left" class="table-search" size="small">
          <el-row :gutter="30">
            <el-col :span="6">
              <el-form-item label-width="100px" label="故障提交时间">
                <el-date-picker value-format="yyyyMMdd" v-model="tableRepair.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车牌号">
                <el-input v-model="tableRepair.license"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户名称">
                <el-input v-model="tableRepair.owner"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label="故障类型">
                <el-select v-model="tableRepair.fault_type" style="width:100%;" :clearable="true">
                  <el-option label="设备故障" value="1">设备故障</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label-width="100px" label="状态">
                <el-select v-model="tableRepair.repair_state" style="width:100%;" :clearable="true">
                  <el-option label="未处理" value="1">未处理</el-option>
                  <el-option label="已修复" value="2">已修复</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="isCollapse?24:6" style="text-align: right;">
              <el-form-item>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
                <el-button type="primary" @click="getTable">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-card shadow="always">
          <el-table :data="tableData.data" style="width: 100%" class="admin-table-list">
            <el-table-column prop="fault_time" label="故障时间" :formatter="(row)=>{return this.$utils.formatDate(row.fault_time)}"> </el-table-column>
            <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="linkman" label="联系人" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="tel" label="联系方式" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="owner" label="所属公司/用户" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="fault_type" label="故障类型" :formatter="(row)=>{return this.$dict.get_vehiclefault_type(row.fault_type)}"></el-table-column>
            <el-table-column prop="reason" label="故障原因" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="repair_state" label="状态" :formatter="(row)=>{return this.$dict.get_vehiclerepair_state(row.repair_state)}"> </el-table-column>
            <el-table-column label="操作" width="400">
              <template slot-scope="scope">
                <el-button @click="submit_repairend(scope)" size="small" :type="faultType(scope)" :disabled="faultDisabled(scope)">故障排除</el-button>
                <el-popover placement="left-end" width="800" trigger="click">
                  <el-table :data="gridData.data">
                    <el-table-column width="180" label="维修时间" prop="RepairTime" :formatter="repairtime"></el-table-column>
                    <el-table-column width="150" label="故障原因" prop="Reason" :formatter="$utils.baseFormatter"></el-table-column>
                    <el-table-column width="150" label="维修状态" prop="RepairState">
                      <template slot-scope="scope">
                        <label v-if="scope.row.RepairState==''">
                          --
                        </label>
                        <el-tag type="danger" v-if="scope.row.RepairState==1">
                          未处理
                        </el-tag>
                        <el-tag type="success" v-if="scope.row.RepairState==2">
                          已修复
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column width="150" label="备注" prop="Desc" :formatter="$utils.baseFormatter"></el-table-column>
                    <el-table-column width="150" label="操作人" prop="RealName" :formatter="$utils.baseFormatter"></el-table-column>
                  </el-table>
                  <el-button style="margin-left:10px;" size="small" type="success" plain slot="reference" @click="OperateLogList(scope)">查看维修明细</el-button>
                </el-popover>
                <el-dialog width="30%" title="" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
                  <label>备注：</label>
                  <el-input v-model="tableRepair.desc"></el-input>
                  <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="excluded(scope,2)">确 定</el-button>
                    <el-button @click="addDialog = false">取 消</el-button>
                  </span>
                </el-dialog>
              </template>
            </el-table-column>
          </el-table>
          <div class="admin-table-pager">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
            </el-pagination>
          </div>
        </el-card>
        <el-dialog width="30%" title="" :visible.sync="delDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
          <label>备注：</label>
          <el-input></el-input>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="replace()">确 定</el-button>
            <el-button @click="delDialog = false">取 消</el-button>
          </span>
        </el-dialog>
      </el-tab-pane> -->
      <el-tab-pane label="普通货车">
        <el-form :model="tableRepair" label-width="80px" label-position="left" class="table-search" size="small">
          <el-row :gutter="30">
            <el-col :span="6">
              <el-form-item label-width="100px" label="故障提交时间">
                <el-date-picker value-format="yyyyMMdd" v-model="tableRepair.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车牌号">
                <el-input v-model="tableRepair.license"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户名称">
                <el-input v-model="tableRepair.owner"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label="故障类型">
                <el-select v-model="tableRepair.fault_type" style="width:100%;" :clearable="true">
                  <el-option label="设备故障" value="1">设备故障</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label-width="100px" label="状态">
                <el-select v-model="tableRepair.repair_state" style="width:100%;" :clearable="true">
                  <el-option label="未处理" value="1">未处理</el-option>
                  <el-option label="已修复" value="2">已修复</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="isCollapse?24:6" style="text-align: right;">
              <el-form-item>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
                <el-button type="primary" @click="getTable">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-card shadow="always">
          <div class="admin-table-actions">
            <el-button style="margin-left:10px" type="primary" @click="exportExcel" size="small">
              <i class="el-icon-download"></i> 导出
            </el-button>
          </div>
          <el-table :data="tableData.data" style="width: 100%" class="admin-table-list" v-loading="tableLoading">
            <el-table-column prop="fault_time" label="故障时间" :formatter="(row)=>{return this.$utils.formatDate(row.fault_time)}"> </el-table-column>
            <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="linkman" label="联系人" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="tel" label="联系方式" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="owner" label="所属公司/用户" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="fault_type" label="故障类型" :formatter="(row)=>{return this.$dict.get_vehiclefault_type(row.fault_type)}"></el-table-column>
            <el-table-column prop="reason" label="故障原因" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="repair_state" label="状态" :formatter="(row)=>{return this.$dict.get_vehiclerepair_state(row.repair_state)}"> </el-table-column>
            <el-table-column label="操作" width="400">
              <template slot-scope="scope">
                <el-button @click="submit_repairend(scope)" size="small" :type="faultType(scope)" :disabled="faultDisabled(scope)">故障排除</el-button>
                <el-popover placement="left-end" width="800" trigger="click">
                  <el-table :data="gridData.data">
                    <el-table-column width="150" label="维修时间" prop="RepairTime" :formatter="repairtime"></el-table-column>
                    <el-table-column width="150" label="故障原因" prop="Reason" :formatter="$utils.baseFormatter"></el-table-column>
                    <el-table-column width="150" label="维修状态" prop="RepairState" :formatter="$utils.baseFormatter">
                      <template slot-scope="scope">
                        <label v-if="scope.row.RepairState==''">
                          --
                        </label>
                        <el-tag type="danger" v-if="scope.row.RepairState==1">
                          未处理
                        </el-tag>
                        <el-tag type="success" v-if="scope.row.RepairState==2">
                          已修复
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column width="150" label="备注" prop="Desc" :formatter="$utils.baseFormatter"></el-table-column>
                    <el-table-column width="150" label="操作人" prop="RealName" :formatter="$utils.baseFormatter"></el-table-column>
                  </el-table>
                  <el-button style="margin-left:10px;" size="small" type="success" plain slot="reference" @click="OperateLogList(scope)">查看维修明细</el-button>
                </el-popover>
                <el-dialog width="30%" title="" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
                  <label>备注：</label>
                  <el-input v-model="tableRepair.desc"></el-input>
                  <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="excluded(scope,2)">确 定</el-button>
                    <el-button @click="addDialog = false">取 消</el-button>
                  </span>
                </el-dialog>
              </template>
            </el-table-column>
          </el-table>
          <div class="admin-table-pager">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
            </el-pagination>
          </div>
        </el-card>
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
        <el-form :model="tableRepair" label-width="80px" label-position="left" class="table-search" size="small">
          <el-row :gutter="30">
            <el-col :span="6">
              <el-form-item label-width="100px" label="故障提交时间">
                <el-date-picker value-format="yyyyMMdd" v-model="tableRepair.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车牌号">
                <el-input v-model="tableRepair.license"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户名称">
                <el-input v-model="tableRepair.owner"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label="故障类型">
                <el-select v-model="tableRepair.fault_type" style="width:100%;" :clearable="true">
                  <el-option label="设备故障" value="1">设备故障</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label-width="100px" label="状态">
                <el-select v-model="tableRepair.repair_state" style="width:100%;" :clearable="true">
                  <el-option label="未处理" value="1">未处理</el-option>
                  <el-option label="已修复" value="2">已修复</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="isCollapse?24:6" style="text-align: right;">
              <el-form-item>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
                <el-button type="primary" @click="getTable">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-card shadow="always">
          <div class="admin-table-actions">
            <el-button style="margin-left:10px" type="primary" @click="exportExcel" size="small">
              <i class="el-icon-download"></i> 导出
            </el-button>
          </div>
          <el-table :data="tableData.data" style="width: 100%" class="admin-table-list">
            <el-table-column prop="fault_time" label="故障时间" :formatter="(row)=>{return this.$utils.formatDate(row.fault_time)}"> </el-table-column>
            <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="linkman" label="联系人" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="tel" label="联系方式" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="owner" label="所属公司/用户" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="fault_type" label="故障类型" :formatter="(row)=>{return this.$dict.get_vehiclefault_type(row.fault_type)}"></el-table-column>
            <el-table-column prop="reason" label="故障原因" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="repair_state" label="状态" :formatter="(row)=>{return this.$dict.get_vehiclerepair_state(row.repair_state)}"> </el-table-column>
            <el-table-column label="操作" width="400">
              <template slot-scope="scope">
                <el-button @click="submit_repairend(scope)" size="small" :type="faultType(scope)" :disabled="faultDisabled(scope)">故障排除</el-button>
                <el-popover placement="left-end" width="800" trigger="click">
                  <el-table :data="gridData.data">
                    <el-table-column width="150" label="维修时间" prop="RepairTime" :formatter="repairtime"></el-table-column>
                    <el-table-column width="150" label="故障原因" prop="Reason" :formatter="$utils.baseFormatter"></el-table-column>
                    <el-table-column width="150" label="维修状态" prop="RepairState" :formatter="$utils.baseFormatter">
                      <template slot-scope="scope">
                        <label v-if="scope.row.RepairState==''">
                          --
                        </label>
                        <el-tag type="danger" v-if="scope.row.RepairState==1">
                          未处理
                        </el-tag>
                        <el-tag type="success" v-if="scope.row.RepairState==2">
                          已修复
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column width="150" label="备注" prop="Desc" :formatter="$utils.baseFormatter"></el-table-column>
                    <el-table-column width="150" label="操作人" prop="RealName" :formatter="$utils.baseFormatter"></el-table-column>
                  </el-table>
                  <el-button style="margin-left:10px;" size="small" type="success" plain slot="reference" @click="OperateLogList(scope)">查看维修明细</el-button>
                </el-popover>
                <el-dialog width="30%" title="" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
                  <label>备注：</label>
                  <el-input v-model="tableRepair.desc"></el-input>
                  <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="excluded(scope,2)">确 定</el-button>
                    <el-button @click="addDialog = false">取 消</el-button>
                  </span>
                </el-dialog>
              </template>
            </el-table-column>
          </el-table>
          <div class="admin-table-pager">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
            </el-pagination>
          </div>
        </el-card>
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
        <el-form :model="tableRepair" label-width="80px" label-position="left" class="table-search" size="small">
          <el-row :gutter="30">
            <el-col :span="6">
              <el-form-item label-width="100px" label="故障提交时间">
                <el-date-picker value-format="yyyyMMdd" v-model="tableRepair.time" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车牌号">
                <el-input v-model="tableRepair.license"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="用户名称">
                <el-input v-model="tableRepair.owner"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label="故障类型">
                <el-select v-model="tableRepair.fault_type" style="width:100%;" :clearable="true">
                  <el-option label="设备故障" value="1">设备故障</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="isCollapse">
              <el-form-item label-width="100px" label="状态">
                <el-select v-model="tableRepair.repair_state" style="width:100%;" :clearable="true">
                  <el-option label="未处理" value="1">未处理</el-option>
                  <el-option label="已修复" value="2">已修复</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="isCollapse?24:6" style="text-align: right;">
              <el-form-item>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
                <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
                <el-button type="primary" @click="getTable">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-card shadow="always">
          <div class="admin-table-actions">
            <el-button style="margin-left:10px" type="primary" @click="exportExcel" size="small">
              <i class="el-icon-download"></i> 导出
            </el-button>
          </div>
          <el-table :data="tableData.data" style="width: 100%" class="admin-table-list">
            <el-table-column prop="fault_time" label="故障时间" :formatter="(row)=>{return this.$utils.formatDate(row.fault_time)}"> </el-table-column>
            <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="linkman" label="联系人" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="tel" label="联系方式" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="owner" label="所属公司/用户" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="fault_type" label="故障类型" :formatter="(row)=>{return this.$dict.get_vehiclefault_type(row.fault_type)}"></el-table-column>
            <el-table-column prop="reason" label="故障原因" :formatter="$utils.baseFormatter"> </el-table-column>
            <el-table-column prop="repair_state" label="状态" :formatter="(row)=>{return this.$dict.get_vehiclerepair_state(row.repair_state)}"> </el-table-column>
            <el-table-column label="操作" width="400">
              <template slot-scope="scope">
                <el-button @click="submit_repairend(scope)" size="small" :type="faultType(scope)" :disabled="faultDisabled(scope)">故障排除</el-button>
                <el-popover placement="left-end" width="800" trigger="click">
                  <el-table :data="gridData.data">
                    <el-table-column width="150" label="维修时间" prop="RepairTime" :formatter="repairtime"></el-table-column>
                    <el-table-column width="150" label="故障原因" prop="Reason" :formatter="$utils.baseFormatter"></el-table-column>
                    <el-table-column width="150" label="维修状态" prop="RepairState" :formatter="$utils.baseFormatter">
                      <template slot-scope="scope">
                        <label v-if="scope.row.RepairState==''">
                          --
                        </label>
                        <el-tag type="danger" v-if="scope.row.RepairState==1">
                          未处理
                        </el-tag>
                        <el-tag type="success" v-if="scope.row.RepairState==2">
                          已修复
                        </el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column width="150" label="备注" prop="Desc" :formatter="$utils.baseFormatter"></el-table-column>
                    <el-table-column width="150" label="操作人" prop="RealName" :formatter="$utils.baseFormatter"></el-table-column>
                  </el-table>
                  <el-button style="margin-left:10px;" size="small" type="success" plain slot="reference" @click="OperateLogList(scope)">查看维修明细</el-button>
                </el-popover>
                <el-dialog width="30%" title="" :visible.sync="addDialog" :append-to-body="true" :close-on-click-modal="false" :close-on-press-escape="false" :center="true" class="admin-dialog">
                  <label>备注：</label>
                  <el-input v-model="tableRepair.desc"></el-input>
                  <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="excluded(scope,2)">确 定</el-button>
                    <el-button @click="addDialog = false">取 消</el-button>
                  </span>
                </el-dialog>
              </template>
            </el-table-column>
          </el-table>
          <div class="admin-table-pager">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]" :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
            </el-pagination>
          </div>
        </el-card>
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
import {
  getRepairListByPage,
  getUpdateVehicleState,
  getVehicleOperateLog
} from "@/api/index.js";
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
      gridData: {
        data: []
      },
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
      tableRepair: {
        page: 1,
        size: 10,
        type: 1,
        time: [],
        start_time: "",
        end_time: "",
        license: "",
        owner: "",
        fault_type: "",
        repair_state: "",
        is_enter: 2,
        desc: ""
      },
      tableData: {
        area: [],
        total: 0,
        data: []
      },
      tableLoading: false,
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
    //导出excel
    exportExcel() {
      var wsCol = [
        {
          A: "故障时间",
          B: "车牌号",
          C: "联系人",
          D: "联系方式",
          E: "所属公司/用户",
          F: "故障类型",
          G: "故障原因",
          H: "状态"
        }
      ];
      this.tableData.data.map(data => {
        wsCol.push({
          A: this.$utils.formatDate(data.fault_time),
          B: data.license,
          C: data.linkman,
          D: data.tel,
          E: data.owner,
          F: this.$dict.get_vehiclefault_type(data.fault_type),
          G: data.reason,
          H: this.$dict.get_vehiclerepair_state(data.repair_state)
        });
      });
      this.$utils.exportExcel({
        data: wsCol,
        sheetName: "维修车辆管理",
        fileName: "维修车辆管理.xlsx"
      });
    },
    repairtime(row) {
      return this.$utils.formatDate14(row.RepairTime);
    },
    // type值
    handleClick(tab) {
      this.tableRepair.type = "";
      this.tableRepair.time = [];
      this.tableRepair.start_time = "";
      this.tableRepair.end_time = "";
      this.tableRepair.license = "";
      this.tableRepair.owner = "";
      this.tableRepair.fault_type = "";
      this.tableRepair.repair_state = "";
      this.tableRepair.is_enter = "";
      this.tableRepair.desc = "";
      if (tab.label == "全国联动车辆") {
        this.tableRepair.is_enter = 1;
        this.tableRepair.type = 1;
      } else if (tab.label == "普通货车") {
        this.tableRepair.is_enter = 2;
        this.tableRepair.type = 1;
      } else if (tab.label == "危险品车辆") {
        this.tableRepair.is_enter = 2;
        this.tableRepair.type = 2;
      } else if (tab.label == "客运车辆") {
        this.tableRepair.is_enter = 2;
        this.tableRepair.type = 3;
      }
      this.getTable();
    },
    // 故障排除按钮样式
    faultType(scope) {
      if (scope.row.repair_state == 2) {
        return "info";
      }
      return "warning";
    },
    // 故障排除按钮是否禁用
    faultDisabled(scope) {
      if (scope.row.repair_state == 2) {
        return true;
      }
      return false;
    },
    // 故障排除
    submit_repairend() {
      this.addKey++;
      this.addDialog = true;
    },
    excluded(scope, state) {
      scope.row.desc = this.tableRepair.desc;
      scope.row.repair_state = state;
      getUpdateVehicleState(scope.row).then(res => {
        if (res.data.code == 0) {
          this.addDialog = false;
          this.getTable();
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.meg);
        }
      });
      this.tableRepair.desc = "";
    },
    // 设备更换
    submit_devicechange() {
      this.addKey++;
      this.delDialog = true;
    },
    replace() {},
    // 查看维修明细
    OperateLogList(scope) {
      getVehicleOperateLog({ vehicle_id: scope.row.vehicle_id }).then(res => {
        if (res.data.code == 0) {
          this.gridData.data = res.data.data;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //获取故障列表
    getTable() {
      this.tableRepair.start_time = this.tableRepair.time[0];
      this.tableRepair.end_time = this.tableRepair.time[1];
      var query = Object.assign({}, this.tableRepair);
      this.tableLoading = true;
      getRepairListByPage(query)
        .then(res => {
          if (res.data.code == 0) {
            this.$set(this.$data, "tableData", res.data);
          } else {
            this.$set(this.$data, "tableData", []);
            this.$message.error(res.data.msg);
          }
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
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
