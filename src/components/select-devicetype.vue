<template>
    <el-select v-model="device_type" placeholder="请选择">
        <el-option v-for="(item,index) in device_types" :key="item" :label="item" :value="index">
        </el-option>
    </el-select>
</template>
<script>
    export default {
        name: "select-devicetype",
        data() {
            return {
                device_type: "",
                device_types: this.$dict.device_type
            }
        },
        watch: {
            device_type: function () {
                this.$emit("input", this.device_type);
            }
        },
        props: {
            value: String
        },
        created() {

        },

    }
</script>