<template>
    <div class="admin-table-container" style="position: absolute;left:0;right:0;bottom:0;top:107px;">
        <el-card shadow="always" class="full-box">
            <div class="bind-box">
                <div class="user-box">
                    <div class="user-filter" :class="{active:userFilterOpen}">
                        <el-form :model="userTableQuery" size="small">
                            <el-form-item>
                                <el-input placeholder="公司/个人名称" size="small" v-model="userTableQuery.real_name">
                                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-select v-model="userTableQuery.user_type" style="width:100%;">
                                    <el-option value="1">个人用户</el-option>
                                    <el-option value="2">企业用户</el-option>
                                </el-select>
                            </el-form-item>

                        </el-form>

                        <div class="user-load-more" @click="userFilterOpen=!userFilterOpen">
                            <i class="el-icon-caret-bottom"></i>
                        </div>
                    </div>
                    <ul class="user-list">
                        <li v-for="user in userList" :key="user.user_id" @click="changeUser(user)" :class="{active:user==currentUser}"> {{user.user_name}}</li>
                    </ul>
                    <div class="user-pager">
                        <el-input placeholder="页码" size="small" v-model="userTableQuery.page">
                            <el-button slot="prepend" icon="el-icon-caret-left" @click="userPagerPrev()"></el-button>
                            <el-button slot="append" icon="el-icon-caret-right" @click="userPagerNext()"></el-button>
                        </el-input>
                    </div>
                </div>
                <div class="transfer-box">
                    <admin-transfer @onLeft="onleft" :lists="list" :titles="titles" @onRight="onright" style="width:100%;"></admin-transfer>
                </div>
            </div>


        </el-card>
    </div>
</template>
<style lang="less">
    .full-box {
        height: 100%;
        .el-card__body {
            height: 100%;
        }
    }

    .bind-box {
        display: flex;
        margin: -20px;
        font-size: 14px;
        height: 100%;

    }

    .transfer-box {
        width: 100%;
    }

    .transfer-fiter {
        height: 50px;
        background: #f5f7fa;
    }




    .el-card__body {
        height: 100%;
    }

    .user-box {
        width: 300px;
        border-right: 1px solid #ccc;
        position: relative;
    }

    .user-load-more {
        background: #edf2f9;
        text-align: center;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 15px;
        border-top: 1px solid #e3e9f1;
        border-bottom: 1px solid #e3e9f1;
        cursor: pointer;
    }

    .user-filter {
        position: absolute;
        width: 100%;
        height: 60px;
        box-sizing: border-box;
        overflow: hidden;
        padding: 4px;
        background: #edf2f9;
        z-index: 2;
        transition: all .2s;
        &.active {
            overflow: visibility;
            height: 165px;
        }
    }

    .user-pager {
        background: #f1f1f1;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 32px;
        line-height: 32px;
        text-align: center;
        .el-input__inner {
            text-align: center;
        }
    }

    .user-list {
        position: absolute;
        top: 60px;
        bottom: 32px;
        width: 100%;
        overflow: auto;
        ul,
        li {
            margin: 0;
            padding: 0;
        }
        li {
            height: 32px;
            line-height: 32px;
            overflow: hidden;
            list-style-type: none;
            box-sizing: border-box;
            padding: 0 15px;
        }
        li.active {
            color: #1890ff;
            background: #FFF;
        }
    }
</style>
<script>
    /* eslint-disable */
    import { getUserList, getUserSim, getSimAllUnbind, addUserSim, delUserSim } from "@/api/index.js";
    import adminTransfer from "@/components/transfer.vue"
    export default {
        created() {
            this.renderUser();
        },
        computed: {
            list: function () {
                return this.leftList.concat(this.rightList);

            }
        },
        data() {
            return {
                userFilterOpen: false,//用户筛选展开关闭
                userTableQuery: {
                    user_name: "",
                    user_type: "",
                    real_name: "",
                    size: 10,
                    page: 1,
                },
                currentUser: {},
                titles: ['', '未绑定SIM卡'],
                userList: [],
                leftList: [],
                rightList: [],

            };
        },
        props: ["user_type"],//来自router的user_type 根据user_type 区分公司和个人
        methods: {
            renderUser() {
                getUserList(this.userTableQuery).then((res) => {
                    if (res.data.code == 0) {
                        this.$set(this.$data, "userList", res.data.data);
                    }
                })
            },
            userPagerPrev() {
                if (isNaN(Number(parseInt(this.userTableQuery.page)))) {
                    this.userTableQuery.page = 1;
                } else {
                    if (this.userTableQuery.page - 1 <= 0) {
                        this.userTableQuery.page = 1;
                    } else {
                        this.userTableQuery.page = parseInt(this.userTableQuery.page) - 1;
                    }
                }

            },
            userPagerNext() {
                if (isNaN(Number(parseInt(this.userTableQuery.page)))) {
                    this.userTableQuery.page = 1;
                } else {
                    this.userTableQuery.page = parseInt(this.userTableQuery.page) + 1;
                }
            },
            onleft(items, next) {//右到左
                if (!this.currentUser.user_id) {
                    this.$message.warning("请选择一个用户！");
                    next(false);
                    return false;
                }
                var postData = {
                    user_id: this.currentUser.user_id,
                    sim_nos: []
                }
                items.map((item) => {
                    postData.sim_nos.push(item.key);
                })
                postData.sim_nos = postData.sim_nos.join(",");
                addUserSim(postData).then((res) => {
                    if (res.data.code == 0) {
                        next(true);
                    } else {
                        this.$message.error(res.data.msg);
                        next(false);
                    }
                }).catch(() => {
                    next(false);
                })
            },
            onright(items, next) {//左到右
                var postData = {
                    user_id: this.currentUser.user_id,
                    sim_nos: []
                }
                items.map((item) => {
                    postData.sim_nos.push(item.key);
                })
                postData.sim_nos = postData.sim_nos.join(",");
                delUserSim(postData).then((res) => {
                    if (res.data.code == 0) {
                        next(true);
                    } else {
                        this.$message.error(res.data.msg);
                        next(false);
                    }
                }).catch(() => {
                    next(false);
                })
            },
            changeUser(user) {
                this.titles[0] = user.user_name;
                this.$set(this.$data, "leftList", []);
                this.currentUser = user;
                getUserSim({ user_id: user.user_id }).then((res) => {
                    this.rightValues = [];
                    if (res.data.code == 0) {
                        var arr = [];
                        res.data.data.map((item) => {
                            arr.push({
                                parent: "left",
                                key: item.sim_no,
                                label: item.sim_no
                            })
                        })
                        this.$set(this.$data, "leftList", arr);
                    }
                });
                getSimAllUnbind().then((res) => {
                    if (res.data.code == 0) {
                        var arr = [];
                        res.data.data.map(item => {
                            arr.push({
                                parent: "right",
                                key: item.sim_no,
                                label: item.sim_no
                            })
                        });
                        this.$set(this.$data, "rightList", arr);
                        console.log(this.rightList);
                    }
                })

            }

        },

        components: { adminTransfer }
    };
</script>