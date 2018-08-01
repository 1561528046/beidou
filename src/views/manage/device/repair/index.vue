<template>
    <div class="admin-table-container">
        <el-card shadow="always" class="admin-table-search">

            <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
                <el-row :gutter="30">
                    <el-col :span="8">
                        <el-form-item label="维修状态">
                            <select-repairstate v-model="tableQuery.state" style="width: 100%;"></select-repairstate>
                        </el-form-item>
                    </el-col>
                    <el-col :span="isCollapse?24:8" style="text-align: right;">
                        <el-form-item>
                            <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
                            <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
                            <el-button type="primary" @click="getListTable">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card shadow="always">
            <div class="admin-table-actions">
                <el-button type="primary" size="small" @click="addFrom">
                    <i class="el-icon-upload el-icon--right"></i> 添加
                </el-button>
            </div>
            <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
                <el-table-column prop="back_time" label="返厂时间" :formatter="$utils.baseFormatter">
                </el-table-column>
                <el-table-column prop="reason" label="维修原因" :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column prop="logistics" label="物流信息" :formatter="$utils.baseFormatter"></el-table-column>
                <el-table-column prop="state" label="维修状态" :formatter="(row)=>{return this.$dict.get_repair_state(row.state)}"></el-table-column>
                <el-table-column prop="time" label="添加时间" :formatter="(row)=>{return this.$utils.formatDate(row.time)}">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="repaired(scope,2)">已修复</el-button>
                        <el-button type="text" size="small" @click="repaired(scope,3)">报废</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="admin-table-pager">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page" :page-sizes="[10, 20, 50, 100]"
                    :page-size="tableQuery.size" :total="tableData.total" layout="total, sizes, prev, pager, next, jumper" background>
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>
<script>
    /* eslint-disable */
    import selectRepairstate from "@/components/select-repairstate.vue";
    import repair_add from "./add.vue"
    import { getDeviceRepairList, updateDeviceRepair } from "@/api/index.js";
    export default {
        created() {
            this.getListTable();
        },
        data() {
            return {
                isCollapse: false,
                tableQuery: {
                    state: "",
                    size: 10,
                    page: 1
                },
                tableData: {
                    total: 0,
                    data: []
                },
                tableLoading: true,
                addKey: 0,
            };
        },
        methods: {
            repaired(scope, state) {
                scope.row.state = state
                updateDeviceRepair(scope.row).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success(res.data.msg);
                        scope.row.state = state;
                    } else {
                        this.$message.error(res.data.msg);
                    }

                })

            },
            addFrom() {//添加
                var vNode = this.$createElement(repair_add, {
                    key: this.addKey++,
                    on: {
                        success: () => {
                            this.getListTable();
                            this.$msgbox.close();
                        },
                        error: function () {
                        }
                    }
                })
                this.$msgbox({
                    showConfirmButton: false,//是否显示确定按钮	
                    customClass: "admin-message-form",
                    title: "添加维修设备信息",
                    closeOnClickModal: false,//是否可通过点击遮罩关闭 MessageBox	
                    closeOnPressEscape: false,//是否可通过按下 ESC 键关闭 MessageBox
                    message: vNode
                })
            },
            //列表信息
            getListTable() {
                this.tableLoading = true;
                var query = Object.assign({}, this.tableQuery);
                getDeviceRepairList(query)
                    .then(res => {
                        if (res.data.code == 0) {
                            this.$set(this.$data, "tableData", res.data);
                        } else {
                            this.$set(this.$data, "tableData", []);
                            this.$message.error(res.data.msg);
                        }
                        this.tableLoading = false;
                    })
                    .catch(() => { });
            },
            handleSizeChange(val) {
                this.tableQuery.page = 1;
                this.tableQuery.limit = val;
                this.getListTable();
            },
            handleCurrentChange(val) {
                this.tableQuery.page = val;
                this.getListTable();
            },
        },
        components: { selectRepairstate }
    };
</script>