<template>
    <div class="admin-table-container">
        <el-card shadow="always" class="admin-table-search">

            <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
                <el-row :gutter="30">
                    <el-col :span="6">
                        <el-form-item label="维修状态">
                            <select-devicetype v-model="tableQuery.state"></select-devicetype>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-form-item label="审批人">
                            <el-input v-model="tableQuery.user" placeholder="审批人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审批人">
                            <el-input v-model="tableQuery.user" placeholder="审批人"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <!-- <el-col :span="6" v-show="isCollapse">
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
                    </el-col>-->
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
                <el-button type="primary" size="small">
                    <router-link :to="{name:'repair-add'}" style="display: block;">
                        <i class="el-icon-upload el-icon--right"></i> 添加
                    </router-link>
                </el-button>
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
                        <el-button type="text" size="small">已修复</el-button>
                        <el-button @click="handleClick(scope.row)" type="text" size="small">报废</el-button>
                        <el-button @click="handleClick(scope.row)" type="text" size="small">更换</el-button>
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
    import selectDevicetype from "@/components/select-devicetype.vue";
    import { getDeviceRepairList } from "@/api/index.js";
    export default {
        created() {
            this.getTable();
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
            formatter(row) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            filterHandler(value, row, column) {
                const property = column["property"];
                return row[property] === value;
            },
            handleSizeChange(val) {
                this.tableQuery.page = 1;
                this.tableQuery.limit = val;
                this.getTable();
            },
            handleCurrentChange(val) {
                this.tableQuery.page = val;
                this.getTable();
            },
            getTable() {
                this.tableLoading = true;
                getDeviceRepairList(this.tableQuery)
                    .then(res => {
                        this.$set(this.$data, "tableData", res.data);
                        this.tableLoading = false;
                    })
                    .catch(() => { });
            }
        },
        components: { selectDevicetype }
    };
</script>