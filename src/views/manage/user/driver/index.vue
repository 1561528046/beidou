<template>
    <div class="admin-table-container">
        <el-card shadow="always" class="admin-table-search">
            <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
                <el-row :gutter="30">
                    <el-col :span="6">
                        <el-form-item label="所属区域">
                            <city-select v-model="tableQuery.area" style="width:100%;"></city-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="审批人">
                            <el-input v-model="tableQuery.user" placeholder="审批人"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="用户账号">
                            <el-input v-model="tableQuery.user_name" placeholder="用户账号"></el-input>
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
                <router-link :to="{name:'driver_add'}">
                    <el-button type="primary" size="small">
                        <i class="el-icon-upload el-icon--right"></i> 添加
                    </el-button>
                </router-link>
            </div>
            <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
                <el-table-column prop="driver_card_id" label="司机卡id"></el-table-column>
                <el-table-column prop="driver_name" label="姓名"></el-table-column>
                <el-table-column prop="tel" label="联系电话"> </el-table-column>
                <el-table-column prop="license_validity" label="驾驶证有效期"> </el-table-column>
                <el-table-column prop="identity_id" label="身份证 "> </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <router-link :to="{name: 'driver_update',params:{driver_card_id:scope.row.driver_card_id}}">编辑</router-link>
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
    import { getUserList } from "@/api/index.js";
    import citySelect from "@/components/city-select.vue";
    export default {
        created() {
            this.getTable();
        },
        data() {
            return {
                isCollapse: false,
                tableQuery: {
                    area: [],
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
                var areaObj = this.$utils.formatArea(this.tableQuery.area);
                var query = Object.assign({}, this.tableQuery, areaObj);
                getUserList(query)
                    .then(res => {
                        this.$set(this.$data, "tableData", res.data);
                        this.tableLoading = false;
                    })
                    .catch(() => { });
            }
        },
        components: { citySelect }
    };
</script>
<style scoped lang="less">
    .vehicle-form {
        padding: 20px;
        .el-card {
            margin-bottom: 20px;
        }
    }
</style>