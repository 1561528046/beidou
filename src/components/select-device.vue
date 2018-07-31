<template>
    <div>
        <el-select style="width: 100%; " v-model="device_id" placeholder="请选择" filterable>
            <el-option v-for="item in list" :key="item.device_id" :label="item.device_no" :value="item.device_id">
            </el-option>
        </el-select>
    </div>
</template>
<script>
    import { getDeviceAll } from "@/api/index.js";
    export default {
        name: "select-user",
        data() {
            return {
                device_id: "",
                list: []
            }
        },
        watch: {
            device_id: function () {
                this.$emit("input", this.device_id);
            }
        },
        props: {
            value: String,
            query: Object
        },
        created() {
            getDeviceAll(this.$props.query).then(res => {
                if (res.data.code == 0 && res.data.data.length) {
                    this.$set(this.$data, "list", res.data.data);
                    this.device_id = this.value;
                }
            })
        },

    }
</script>