<template slot-scope="scope">
  <div>
    <el-checkbox-group v-model="roleList">
      <el-checkbox v-for="role in list" :label="role" :key="role.role_id">{{role.role_name}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>
<script>
import { getRoleAll } from "@/api/index.js";
export default {
  name: "select-company",
  data() {
    return {
      role_id: "",
      list: [],
      roleList: []
    };
  },
  watch: {
    roleList: function() {
      this.$emit("role", this.roleList);
    },
    role_id: function() {
      this.$emit("input", this.role_id);
    },
    value: function() {
      this.role_id = this.value;
      if (this.list.length == 0) {
        this.init();
      }
    }
  },
  props: {
    value: String,
    clearable: Boolean
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getRoleAll().then(res => {
        if (res.data.code == 0 && res.data.data.length) {
          this.$set(this.$data, "list", res.data.data);
          if (this.value && this.value.length) {
            this.role_id = this.value;
          }
        }
      });
    }
  }
};
</script>