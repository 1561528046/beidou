<template>
    <div>
        <el-select v-model="company_id" placeholder="请选择" filterable>
            <el-option v-for="item in list" :key="item.company_id" :label="item.company_name" :value="item.company_id">
            </el-option>
        </el-select>
    </div>
</template>
<script>
    import { getDeviceCompany } from "@/api/index.js";
    export default {
        name: "select-user",
        data() {
            return {
                company_id: "",
                list: []
            }
        },
        watch: {
            company_id: function () {
                this.$emit("input", this.company_id);
            }
        },
        props: {
            value: String
        },
        created() {
            getDeviceCompany().then(res => {
                if (res.data.code == 0 && res.data.data.length) {
                    this.$set(this.$data, "list", res.data.data);
                    this.company_id = this.value;
                }
            })
        },

    }
</script>