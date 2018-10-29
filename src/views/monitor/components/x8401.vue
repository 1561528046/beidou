<template>
  <el-form ref="form" :model="form" label-width="80px" @submit.native.prevent>
    <el-form-item label="设置方式" required>
      <el-select v-model="form.SetType">
        <el-option label="覆盖" value="1"></el-option>
        <el-option label="追加" value="2"></el-option>
        <el-option label="修改" value="3"></el-option>
        <el-option label="全部删除" value="0"></el-option>
      </el-select>
    </el-form-item>

    <ul class="concat-list">
      <el-table :data="form.LinkManItems" style="width: 100%">
        <el-table-column label="联系人">
          <template slot-scope="scope">
            <el-input v-model="form.LinkManItems[scope.$index].LinkMan"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="电话号码">
          <template slot-scope="scope">
            <el-input v-model="form.LinkManItems[scope.$index].PhoneNumber"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="号码类型">
          <template slot-scope="scope">
            <el-select v-model="form.LinkManItems[scope.$index].CallFlag">
              <el-option label="呼入" value="1"></el-option>
              <el-option label="呼出" value="2"></el-option>
              <el-option label="呼入/呼出" value="3"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="remove(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <li class="add" style="padding-top:15px;">
        <el-button @click="add"><i class="el-icon-plus"></i>添加联系人</el-button>
      </li>
    </ul>

    <el-form-item>
      <el-button type="primary" native-type="submit" @click="formSubmit" :loading="loading">立即下发</el-button>
    </el-form-item>
  </el-form>
</template>
<style lang="less" scoped>
.concat-list {
  li {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  .add {
    text-align: center;
  }
}
</style>
<script>
export default {
  data() {
    return {
      loading: false,
      form: {
        MessageID: "x8401",
        SimID: this.$utils.formatSim(this.vehicle.sim_id),
        SetType: "2",
        LinkManItems: [
          // {CallFlag:"",PhoneNumber:"",LinkMan:""},
        ]
      }
    };
  },
  props: ["vehicle"],
  created() {
    this.$instruction.on("x8401", this.vehicle.sim_id, evt => {
      var msg = JSON.parse(evt.data);
      if (msg.code == 0) {
        this.$message.success("执行成功！");
      } else {
        this.$message.warning("执行失败");
      }
      this.loading = false;
    });
  },
  methods: {
    add() {
      this.form.LinkManItems.push({
        CallFlag: "",
        PhoneNumber: "",
        LinkMan: ""
      });
    },
    remove(index) {
      this.form.LinkManItems.splice(index, 1);
    },
    formSubmit() {
      this.loading = true;
      this.$instruction.send(JSON.stringify(this.form));
    }
  },
  beforeDestroy() {
    this.$instruction.offAll("x8401", this.$props.vehicle.sim_id);
  }
};
</script>
<style>
</style>