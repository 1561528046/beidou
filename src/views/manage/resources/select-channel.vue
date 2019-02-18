<template>
  <div>
    <el-table :data="channelData" style="width: 100%">
      <el-table-column prop="video_channel" label="通道名称"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="chooseChannel(scope)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getChannel } from "@/api/index.js";
export default {
  created() {
    this.$set(this.formData, "license", this.$props.channel.license);
    if (this.$props.channel.area.length == 2) {
      this.$set(this.formData, "province_id", this.$props.channel.area[0]);
      this.$set(this.formData, "city_id", this.$props.channel.area[1]);
    } else if (this.$props.channel.area.length == 3) {
      this.$set(this.formData, "province_id", this.$props.channel.area[0]);
      this.$set(this.formData, "city_id", this.$props.channel.area[1]);
      this.$set(this.formData, "county_id", this.$props.channel.area[2]);
    }
    this.getChannel();
  },
  data() {
    return {
      channelData: [],
      formData: {
        province_id: "",
        city_id: "",
        county_id: "",
        license: ""
      }
    };
  },
  props: {
    channel: Object
  },
  methods: {
    getChannel() {
      getChannel(this.formData).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "channelData", res.data.data);
        } else {
          return this.$notify({
            message: res.data.msg,
            title: "提示",
            type: "error"
          });
        }
      });
    },
    chooseChannel(scope) {
      this.$emit("choose", scope.row);
    }
  }
};
</script>