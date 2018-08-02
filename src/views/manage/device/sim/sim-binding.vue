<template>
    <div class="admin-table-container">
        <el-card shadow="always ">
            <ul>
                <li v-for="user in userList" :key="user.user_id" @click="changeUser(user)"> {{user.user_name}}</li>
            </ul>
            <el-transfer v-model="rightValues" filterable :titles="titles" :button-texts="['到左边', '到右边']" @change="handleChange" :data="list"
                :props="{
                    key: 'sim_no',
                    label: 'sim_no'
                  }">
                <!-- <span slot-scope="{ option }">{{ option.key }} - {{ option.label }}</span> -->
                <!-- <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
                <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button> -->
            </el-transfer>
        </el-card>
    </div>
</template>
<style>
</style>
<script>
    /* eslint-disable */
    import { getUserAll, getUserSim, getSimAll } from "@/api/index.js";
    import citySelect from "@/components/city-select.vue";
    import addComponents from "./add.vue";
    import updateComponents from "./update.vue";
    export default {
        created() {
            getUserAll().then((res) => {
                if (res.data.code == 0) {
                    this.$set(this.$data, "userList", res.data.data);
                }
            })
            getSimAll().then((res) => {
                if (res.data.code == 0) {
                    this.$set(this.$data, "list", res.data.data);
                }
            })
        },
        data() {
            return {
                titles: ['所有SIM卡', ''],
                userList: [],
                list: [
                    // { key: 1, label: "备选项 1", disabled: false },
                    // { key: 2, label: "备选项 1", disabled: false },
                    // { key: 3, label: "备选项 1", disabled: false }
                ],
                rightValues: [],
            };
        },
        props: ["user_type"],//来自router的user_type 根据user_type 区分公司和个人
        methods: {
            handleChange() { },
            changeUser(user) {
                this.titles[1] = user.user_name;
                getUserSim({ user_id: user.user_id }).then((res) => {
                    this.rightValues = [];
                    if (res.data.code == 0) {

                        var userSims = res.data.data.map((simObj) => {
                            return simObj.sim_no;
                        })
                        this.$set(this.$data, "rightValues", userSims)
                    }
                })

            }

        },

        components: { citySelect }
    };
</script>