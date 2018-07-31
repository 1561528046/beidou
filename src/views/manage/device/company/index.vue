<template>
    <div class="admin-table-container">
        <el-card shadow="always" class="admin-table-search">

            <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
                <el-row :gutter="30">
                    <el-col :span="6">
                        <el-form-item label="厂商名称">
                            <el-input v-model="tableQuery.name" placeholder="请选择"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="厂商类型">
                            <select-companytype v-model="tableQuery.type" style="width:100%;"></select-companytype>
                        </el-form-item>
                    </el-col>
                    <el-col :offset="isCollapse?0:6" :span="isCollapse?24:6" style="text-align: right;">
                        <el-form-item>
                            <!-- <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
                            <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button> -->
                            <el-button type="primary" @click="getTable">查询</el-button>
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
                <!-- <el-button type="primary" size="small">导出
                    <i class="el-icon-upload el-icon--right"></i>
                </el-button> -->
            </div>
            <el-table :data="tableData.data" v-loading="tableLoading" style="width: 100%" class="admin-table-list">
                <el-table-column prop="company_name" label="设备厂商名称" :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column prop="company_type" label="设备厂商类型" :formatter="(row)=>{return this.$dict.get_company_type(row.company_type)}">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" @click="updateForm(scope)" type="primary" icon="el-icon-edit">编辑</el-button>
                        <el-button size="small" icon="el-icon-delete" @click="delRow(scope)">删除</el-button>
                    </template>
                    <!-- <template slot-scope="scope">
                        <el-button type="primary" size="small" @click="$router.push({name: 'company-update',params:{company_id:scope.row.company_id}})">
                            编辑
                        </el-button>
                    </template> -->
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
    import { getDeviceCompanyAll } from "@/api/index.js";
    import selectCompanytype from "@/components/select-companytype.vue";
    import addComponents from "./add.vue";
    import updateComponents from "./update.vue";
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
                tableLoading: true,
                addKey: 0,
            };
        },
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
                })
            },
            updateForm(scope) {//编辑
                var vNode = this.$createElement(updateComponents, {
                    key: this.addKey++,
                    props: {
                        company_id: scope.row.company_id
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
                })
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
                getDeviceCompanyAll(this.tableQuery)
                    .then(res => {
                        this.$set(this.$data, "tableData", res.data);
                        this.tableLoading = false;
                    })
                    .catch(() => { });
            }
        },
        components: { selectCompanytype }
    };
</script>