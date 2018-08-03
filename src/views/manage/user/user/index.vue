<template>
    <div class="admin-table-container">
        <el-card shadow="always" class="admin-table-search">
            <el-form :model="tableQuery" label-width="82px" label-position="left" class="table-search" size="small">
                <el-row :gutter="30">
                    <el-col :span="6 ">
                        <el-form-item label="登录账号 ">
                            <el-input v-model="tableQuery.user_name " placeholder="登录账号 "></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label-width="110px" label="个人/公司名称">
                            <el-input v-model=" tableQuery.real_name " placeholder="请输入 "></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="所属地区">
                            <city-select v-model="tableQuery.area" style="width:100%;"></city-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="isCollapse">
                        <el-form-item label="所属行业 ">
                            <industry-select v-model="tableQuery.industry" style="width:100%;"></industry-select>
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
        </el-card>
        <el-card shadow="always ">
            <div class="admin-table-actions ">
                <!-- <router-link :to="user_type==1?{name: 'user_person_add'}:{name: 'user_company_add'} ">
                    <el-button type="primary " size="small ">
                        <i class="el-icon-upload el-icon--right "></i> 添加
                    </el-button>
                </router-link> -->
                <el-button type="primary" size="small" @click="addFrom">
                    <i class="el-icon-upload el-icon--right"></i> 添加
                </el-button>
            </div>
            <el-table :data="tableData.data" v-loading="tableLoading " style="width: 100% " class="admin-table-list ">
                <el-table-column prop="user_name" label="登陆帐号 " :formatter="$utils.baseFormatter"></el-table-column>
                <el-table-column prop="province_name" label="所属地区 ">
                    <template slot-scope="scope ">
                        {{scope.row.province_name}} {{scope.row.city_name}} {{scope.row.county_name}}
                    </template>
                </el-table-column>
                <el-table-column prop="real_name" v-if="user_type==1" label="联系人" :formatter="$utils.baseFormatter"></el-table-column>
                <el-table-column prop="real_name" v-if="user_type==2" label="公司名称" :formatter="$utils.baseFormatter"></el-table-column>
                <el-table-column prop="tel" label="联系电话 " :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column prop="industry" label="所属行业 " :formatter="$utils.baseFormatter"></el-table-column>
                <!-- :formatter="(row)=>{return this.$dict.get_industry(row.vehicle_type)}" -->
                <el-table-column prop="address" v-if="user_type==2" label="地址" :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column prop="device_total" label="授权终端数量" :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column prop="role_name" label="所属角色" :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="updateForm(scope)" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="small" icon="el-icon-delete" @click="delRow(scope)">删除</el-button>
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
    import { getUserList, delUser } from "@/api/index.js";
    import citySelect from "@/components/city-select.vue";
    import addComponents from "./add.vue";
    import updateComponents from "./update.vue";
    import industrySelect from "@/components/select-industry.vue";
    export default {
        created() {
            this.getTable();
        },
        data() {
            return {
                isCollapse: false,
                tableQuery: {
                    area: [],
                    user_name: "",
                    linkman: "",
                    real_name: "",
                    industry: "",
                    size: 10,
                    page: 1,
                    user_type: this.$props.user_type
                },
                tableData: {
                    total: 0,
                    data: []
                },
                tableLoading: true,
                addKey: 0
            };
        },
        props: ["user_type"],//来自router的user_type 根据user_type 区分公司和个人
        methods: {
            delRow(scope) {//删除
                this.$confirm('确认删除？')
                    .then(() => {
                        delUser(scope.row).then((res) => {
                            if (res.data.code == 0) {
                                this.$message.success(res.data.msg);
                                this.getTable();
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        })
                    })
                    .catch(() => { });
            },
            addFrom() {//添加
                var vNode = this.$createElement(addComponents, {
                    key: this.addKey++,
                    props: {
                        user_type: this.$props.user_type
                    },
                    on: {
                        success: () => {
                            this.getTable();
                            this.$msgbox.close();
                        },
                        error: function () {
                        }
                    }
                });
                this.$msgbox({
                    showConfirmButton: false,//是否显示确定按钮	
                    customClass: "admin-message-form",
                    title: "添加",
                    closeOnClickModal: false,//是否可通过点击遮罩关闭 MessageBox	
                    closeOnPressEscape: false,//是否可通过按下 ESC 键关闭 MessageBox
                    message: vNode
                }).catch(() => { })
            },
            updateForm(scope) {//编辑
                var vNode = this.$createElement(updateComponents, {
                    key: this.addKey++,
                    props: {
                        user_id: scope.row.user_id,
                        user_type: this.user_type
                    },
                    on: {
                        success: () => {
                            this.getTable();
                            this.$msgbox.close();
                        },
                        error: function () {
                        }
                    }
                });
                this.$msgbox({
                    showConfirmButton: false,//是否显示确定按钮	
                    customClass: "admin-message-form",
                    title: "编辑",
                    closeOnClickModal: false,//是否可通过点击遮罩关闭 MessageBox	
                    closeOnPressEscape: false,//是否可通过按下 ESC 键关闭 MessageBox
                    message: vNode
                }).catch(() => { })
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
                        for (var i = 0; i < res.data.data.length; i++) {
                            if (res.data.data[i].device_total == 0) {
                                res.data.data[i].device_total = "";
                            }
                        }
                        this.$set(this.$data, "tableData", res.data);
                        this.tableLoading = false;
                    })
                    .catch(() => { });
            },
            delRow(scope) {
                this.$confirm('确认删除？')
                    .then(_ => {
                        delUser(scope.row).then((res) => {
                            if (res.data.code == 0) {
                                this.$message.success(res.data.msg);
                                this.getTable();
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        })
                    })
                    .catch(_ => { });
            }
        },
        components: { citySelect, industrySelect }
    };
</script>