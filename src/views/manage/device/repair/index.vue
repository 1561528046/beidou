<template>
    <div class="admin-table-container">
        <el-card shadow="always" class="admin-table-search">

            <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
                <el-row :gutter="30">
                    <el-col :span="6">
                        <el-form-item label="维修状态">
                            <select-repairstate v-model="tableQuery.state"></select-repairstate>
                        </el-form-item>
                    </el-col>
                    <el-col :span="isCollapse?24:6" style="text-align: right;">
                        <el-form-item>
                            <!-- <el-button type="primary" @click="isCollapse=!isCollapse">展开</el-button> -->
                            <el-button type="primary" @click="getTable">查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card shadow="always">
            <div class="admin-table-actions">
                <router-link :to="{name:'repair-add'}">
                    <el-button type="primary" size="small">
                        <i class="el-icon-upload el-icon--right"></i> 添加
                    </el-button>
                </router-link>
                <!-- 
                <el-button type="primary" size="small">导出
                    <i class="el-icon-upload el-icon--right"></i>
                </el-button> -->
            </div>
            <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
                <el-table-column prop="back_time" label="返厂时间">
                </el-table-column>
                <el-table-column prop="reason" label="维修原因"> </el-table-column>
                <el-table-column prop="logistics" label="物流信息"></el-table-column>
                <el-table-column prop="state" label="维修状态" :formatter="(row)=>{return this.$dict.get_repair_state(row.state)}"></el-table-column>
                <el-table-column prop="time" label="添加时间">
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
    import { getDeviceRepairList, updateDeviceRepair } from "@/api/index.js";
    export default {
        created() {
            this.getListTable();
        },
        data() {
            return {
                isCollapse: false,
                tableQuery: {
                    user: "",
                    region: "",
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
            getTable() {
                if (this.tableQuery.state == undefined) {
                    alert(1);
                }
                console.log(this.tableQuery)
                // getDeviceRepairList(this.tableQuery.state)
                //     .then(res => {
                //         console.log(res)
                //         // this.$set(this.$data, "tableData", res.data);
                //         // this.tableLoading = false;
                //     })
            },
            repaired(scope, state) {
                updateDeviceRepair(scope.row).then(res => {
                    if (res.data.code == 0) {
                        this.$message.success(res.data.msg);
                        scope.row.state = state;
                    } else {
                        this.$message.error(res.data.msg);
                    }

                })

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
            getListTable() {
                this.tableLoading = true;
                console.log(this.tableQuery)
                getDeviceRepairList(this.tableQuery)
                    .then(res => {
                        // console.log(res)
                        this.$set(this.$data, "tableData", res.data);
                        this.tableLoading = false;
                    })
                    .catch(() => { });
            }
        },
        components: { selectRepairstate }
    };
</script>