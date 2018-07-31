<template>
    <el-select v-model="repair_state" placeholder="请选择">
        <el-option v-for="(item,index) in repair_states" :key="item" :label="item" :value="index">
        </el-option>
    </el-select>
</template>
<script>
    export default {
        name: "select-repairstate",
        data() {
            return {
                repair_state: "",
                repair_states: this.$dict.repair_state
            }
        },
        watch: {
            repair_state: function () {
                this.$emit("input", this.repair_state);
            }
        },
        props: {
            value: String
        },
        created() {
        },

    }
</script>