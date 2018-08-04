<template>
    <el-select v-model="user_id" :placeholder="placeholder" filterable remote :remote-method="remoteMethod" :loading="loading"
        style="width: 100%;" :clearable="clearable">
        <el-option v-for="item in users" :key="item.user_id" :label="item.user_name" :value="item.user_id">
        </el-option>
    </el-select>
</template>
<script>
    import { getUserAll, getUser } from "@/api/index.js";
    export default {
        name: "select-user",
        data() {
            return {
                loading: false,
                user_id: "",
                users: []
            }
        },
        watch: {
            user_id: function () {
                this.$emit("input", this.user_id);
            }
        },
        props: {
            value: [String, Number],
            clearable: Boolean,
            placeholder: {
                type: [String],
                default: "请输入公司/个人名称搜索"
            }
        },
        created() {
            this.user_id = this.value;
            this.initData();
        },
        methods: {
            initData() {
                if (!this.user_id) {
                    return false;
                }
                getUser({ user_id: this.user_id }).then(res => {
                    if (res.data.code == 0) {
                        this.$set(this.$data, "users", res.data.data);
                    } else {
                        this.user_id = "";
                    }
                })
            },
            remoteMethod(query) {
                getUserAll({ real_name: query }).then(res => {
                    if (res.data.code == 0) {
                        this.$set(this.$data, "users", res.data.data);
                    } else {
                        this.$set(this.$data, "users", []);
                    }
                })
            }
        }

    }
</script>