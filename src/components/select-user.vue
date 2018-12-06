<template>
  <el-select
    v-model="user_id"
    :placeholder="placeholder"
    filterable
    :loading="loading"
    style="width: 100%;"
    :clearable="clearable"
  >
    <el-option
      v-for="item in users"
      :key="item.user_id"
      :label="item.real_name"
      :value="item.user_id"
    ></el-option>
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
    };
  },
  watch: {
    user_id: function() {
      this.$emit("input", this.user_id);
    }
  },
  props: {
    value: [String, Number],
    clearable: Boolean,
    placeholder: {
      type: [String],
      default: "请输入企业名称搜索"
    }
  },
  created() {
    this.user_id = this.value;
    this.initData();
  },
  methods: {
    initData() {
      getUserAll({ real_name: "" }).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "users", res.data.data);
        } else {
          this.$set(this.$data, "users", []);
          this.setUser();
        }
      });
    },
    setUser() {
      getUser({ user_id: this.user_id }).then(res => {
        if (res.data.code == 0) {
          this.$set(this.$data, "users", res.data.data);
        } else {
          this.user_id = "";
        }
      });
    }
  }
};
</script>