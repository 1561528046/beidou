<template>
    <el-select v-model="company_type" placeholder="请选择">
        <el-option v-for="(item,index) in company_types" :key="item" :label="item" :value="index">
        </el-option>
    </el-select>
</template>
<script>
    export default {
        name: "select-companytype",
        data() {
            return {
                company_type: "",
                company_types: this.$dict.company_type
            }
        },
        watch: {
            company_type: function () {
                this.$emit("input", this.company_type);
            }
        },
        props: {
            value: String
        },
        created() {
            console.log(this.$dict.company_type)
        },

    }
</script>