<template>
    <el-select v-model="protocol_type" placeholder="请选择">
        <el-option v-for="(item,index) in protocol_types" :key="item" :label="item" :value="index">
        </el-option>
    </el-select>
</template>
<script>
    export default {
        name: "select-protocoltype",
        data() {
            return {
                protocol_type: "",
                protocol_types: this.$dict.protocol_type
            }
        },
        watch: {
            protocol_type: function () {
                this.$emit("input", this.protocol_type);
            }
        },
        props: {
            value: String
        },
        created() {
            console.log(this.$dict.protocol_type)
        },

    }
</script>