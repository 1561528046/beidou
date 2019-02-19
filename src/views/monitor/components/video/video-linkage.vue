<template>
  <div>
    <div>
      <el-button size="small" @click="addAlarm" type="primary">新增</el-button>
    </div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop label="报警类型"></el-table-column>
      <el-table-column prop label="视频预览"></el-table-column>
      <el-table-column prop label="警音提醒"></el-table-column>
      <el-table-column prop label="联动时间"></el-table-column>
      <el-table-column prop label="是否启用"></el-table-column>
      <el-table-column prop label="操作">
        <template slot-scope="scope">
          <el-button size="mini" icon="el-icon-edit" type="warning">编辑</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="addDialog" :append-to-body="true" width="40%" title="添加">
      <div>
        <div style="width:40%">
          <!-- <el-checkbox-group v-model="alarmList">
            <el-checkbox v-for="linkage in linkageList" :label="linkage" :key="linkage">{{linkage}}</el-checkbox>
          </el-checkbox-group>-->
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    for (var i in this.$dict.alarm) {
      this.linkageList.push({
        alarm_type: i,
        alarm_name: this.$dict.getAlarm(i)
      });
    }
    console.log(this.linkageList);
  },
  data() {
    return {
      addKey: 0,
      addDialog: false,
      tableData: [],
      alarmList: [],
      linkageList: []
    };
  },
  methods: {
    addAlarm() {
      this.addKey++;
      this.addDialog = true;
    }
  }
};
</script>