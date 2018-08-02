<template>
    <div class="admin-table-container">
        <el-card shadow="always" class="admin-table-search">
            <el-form :model="tableQuery" label-width="80px" label-position="left" class="table-search" size="small">
                <el-row :gutter="30">
                    <el-col :span="6">
                        <el-form-item label="添加时间" label-width="82px">
                            <el-date-picker value-format="yyyyMMdd" v-model="value6" type="daterange" align="right" unlink-panels range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions2">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="ICCID卡号">
                            <el-input v-model="tableQuery.icc_id" placeholder="ICCID卡号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="SIM卡号">
                            <el-input v-model="tableQuery.sim_no" placeholder="SIM卡号"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="isCollapse">
                        <el-form-item label="所属运营商" label-width="82px">
                            <el-input v-model="tableQuery.belong" placeholder="所属运营商"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="isCollapse">
                        <el-form-item label="分配用户">
                            <el-input v-model="tableQuery.user_name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="isCollapse?18:6" style="text-align: right;">
                        <el-form-item>
                            <el-button type="primary" @click="isCollapse=!isCollapse" v-if="!isCollapse">展开</el-button>
                            <el-button type="primary" @click="isCollapse=!isCollapse" v-if="isCollapse">收起</el-button>
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

                <router-link :to="{name:'sim-binding'}" style="margin-left: 15px;">
                    <el-button type="primary" size="small">
                        <i class="el-icon-upload el-icon--right"></i> SIM卡绑定管理
                    </el-button>
                </router-link>
                <el-dropdown>
                    <el-button size="small" style="margin-left: 15px;" type="primary">
                        批量上传
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <el-upload action="medium " accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                                    application/vnd.ms-excel " :show-file-list="false " :http-request="uploadFunc " style="display: inline-block; ">
                                <el-button style="padding: 0 15px;" type="primary ">
                                    <i class="el-icon-upload el-icon--right "></i> 点击上传
                                </el-button>
                            </el-upload>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <a href="/assets/SIM卡模板.xls" target="_blank" download style="padding: 0 15px;" type="primary ">
                                <i class="el-icon-upload el-icon--right "></i> 模版下载
                            </a>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <!-- <el-select size="small" placeholder="批量上传" style="width: 150px; margin-left: 20px;">
                    <el-option style="margin-bottom: 10px; height: 38px;">
                        <el-upload action="medium " accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                    application/vnd.ms-excel " :show-file-list="false " :http-request="uploadFunc " style="display: inline-block; ">
                            <el-button style="padding: 0 15px;" type="primary ">
                                <i class="el-icon-upload el-icon--right "></i> 点击上传
                            </el-button>
                        </el-upload>
                    </el-option>
                    <el-option style="height: 38px;">
                        <el-upload action="medium " accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                            application/vnd.ms-excel " :show-file-list="false " :http-request="uploadFunc " style="display: inline-block; ">
                            <el-button style="padding: 0 15px;" type="primary ">
                                <i class="el-icon-upload el-icon--right "></i> 模版下载
                            </el-button>
                        </el-upload>
                    </el-option>
                </el-select> -->

            </div>
            <el-table :data="tableData.data " v-loading="tableLoading " style="width: 100% " class="admin-table-list ">
                <el-table-column prop="time " label="添加时间 " :formatter="(row)=>{return this.$utils.formatDate(row.time)}"></el-table-column>
                <el-table-column prop="icc_id" label="ICCID" :formatter="$utils.baseFormatter">
                </el-table-column>
                <el-table-column prop="sim_no" label="Sim卡号" :formatter="$utils.baseFormatter">
                </el-table-column>
                <el-table-column prop="belong" label="所属运营商" :formatter="$utils.baseFormatter"> </el-table-column>
                <el-table-column prop="user_name" label="分配用户" :formatter="$utils.baseFormatter"></el-table-column>
                <el-table-column prop="state" label="当前状态" :formatter="(row)=>{return this.$dict.get_sim_state(row.state)}"></el-table-column>
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
    import { getSimList, delSim } from "@/api/index.js";
    import selectUser from "@/components/select-user.vue"
    import addComponents from "./add.vue";
    import updateComponents from "./update.vue";
    export default {
        created() {
            this.getTable();
            this.keyupSubmit();
        },
        data() {
            return {
                isCollapse: false,
                tableQuery: {
                    sim_no: "",
                    state: "",
                    belong: "",
                    icc_id: "",
                    user_id: "",
                    startDate: "",
                    endDate: "",
                    size: 10,
                    page: 1
                },
                tableData: {
                    total: 0,
                    data: []
                },
                tableLoading: true,
                addKey: 0,
                pickerOptions2: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                value6: '',
                value7: '',
                userdetailShow: false
            };
        },
        methods: {
            uploadFunc(uploadObj) {
                var formData = new FormData();
                formData.append("ff", uploadObj.file);
                this.$ajax.post("/public/UploadExcel", formData, {
                    params: { table: 1 }
                }).then((res) => {
                    if (res.data.code == 0) {
                        this.$message.success("成功！");
                        this.getTable();
                    } else {
                        this.$message.error(res.data.msg);
                    }

                }).catch((err, a) => {
                    this.$message.error("接口错误，错误码：" + err.response.status)
                })
            },
            uploadSuccess() { },
            uploadError() {
                alert(1);
            },
            uploadProgress() { },
            delRow(scope) {//删除
                this.$confirm('确认删除？')
                    .then(() => {
                        delSim({ id: scope.row.sim_no }).then((res) => {
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
                        sim_no: scope.row.sim_no
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
            handleSizeChange(val) {
                this.tableQuery.page = 1;
                this.tableQuery.limit = val;
                this.getTable();
            },
            handleCurrentChange(val) {
                this.tableQuery.page = val;
                this.getTable();
            },
            keyupSubmit() {
                document.onkeydown = e => {
                    let _key = window.event.keyCode;
                    if (_key === 13) {
                        this.getTable()
                    }
                }
            },
            getTable() {
                this.tableLoading = true;
                if (this.value6) {
                    this.tableQuery.startDate = this.value6[0]
                    this.tableQuery.endDate = this.value6[1]
                }
                getSimList(this.tableQuery)
                    .then(res => {
                        this.$set(this.$data, "tableData", res.data);
                        this.tableLoading = false;
                    })
                    .catch(() => { });
            },
            handleClick() {
                alert('button click');
            }
        },
        components: { selectUser }
    };
</script>