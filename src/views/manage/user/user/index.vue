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
                <router-link :to="user_type==1?{name:'user_person_add'}:{name:'user_company_add'}">
                    <el-button type="primary" size="small">
                        <i class="el-icon-upload el-icon--right"></i> 添加
                    </el-button>
                </router-link>
            </div>
            <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
                <el-table-column prop="user_name" label="用户帐号"></el-table-column>
                <el-table-column prop="province_name" label="所属地区">
                    <template slot-scope="scope">
                        {{scope.row.province_name}} {{scope.row.city_name}} {{scope.row.county_name}}
                    </template>
                </el-table-column>
                <el-table-column prop="linkman" label="联系人"></el-table-column>
                <el-table-column prop="tel" label="联系电话"> </el-table-column>
                <el-table-column prop="vehicle_type" label="所属行业" :formatter="(row)=>{return this.$dict.get_industry(row.vehicle_type)}">
                </el-table-column>
                <el-table-column prop="address" label="地址"> </el-table-column>
                <el-table-column prop="device_num" label="授权总量"> </el-table-column>
                <el-table-column prop="role_name" label="所属角色"> </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <router-link :to="{name: 'user_person_update',params:{user_id:scope.row.user_id}}">编辑</router-link>
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
        props: ["user_type"],//来自router的user_type 根据user_type 区分公司和个人
        methods: {
            formatter(row, column) {
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