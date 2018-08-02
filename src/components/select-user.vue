<template>
    <el-select v-model="user_id" placeholder="请选择" filterable style="width: 100%;">
        <el-option v-for="item in users" :key="item.user_id" :label="item.user_name" :value="item.user_id">
        </el-option>
    </el-select>
</template>
<script>
    import { getUserAll } from "@/api/index.js";
    export default {
        name: "select-user",
        data() {
            return {
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
            value: String
        },
        created() {
            getUserAll().then(res => {
                if (res.data.code == 0 && res.data.data.length) {
                    this.$set(this.$data, "users", res.data.data);
                    this.user_id = this.value;
                }
            })
        },

    }
</script>