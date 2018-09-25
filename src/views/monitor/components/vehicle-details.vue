<template>
    <div class="details-container shadow-box" v-if="true||showVehicle.isShow">
        <div class="_header">
            <div class="_title">
                {{getShowVehicleTitle()}}
            </div>
            <div class="_text">
                {{showVehicle.sub_title}}
            </div>
            <div class="_close">
                <i class="el-icon-close" @click="closeShowVehicle"></i>
            </div>
        </div>
        <div class="_body" v-if="showVehicle.isShowAll">
            <el-table :data="tableData" size="small" style="width: 100%">
                <el-table-column prop="user_name" label="车牌号">
                </el-table-column>
                <el-table-column prop="total" label="报警总数">
                </el-table-column>
            </el-table>
        </div>
        <div class="_body" v-if="!showVehicle.isShowAll">

            <el-collapse accordion>
                <el-collapse-item class="group-container">
                    <template slot="title">
                        <div class="group-name">
                            子级分组1
                        </div>
                    </template>
                    <div class="group-body">
                        <el-select value="1" placeholder="全部分组" size="mini" style="width:100%;">
                            <el-option label="分组1" value="shanghai"></el-option>
                            <el-option label="分组2" value="beijing"></el-option>
                        </el-select>
                        <el-table :data="tableData" size="small" style="width: 100%">
                            <el-table-column prop="user_name" label="车牌号">
                            </el-table-column>
                            <el-table-column prop="total" label="报警总数">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-collapse-item>
                <el-collapse-item class="group-container">
                    <template slot="title">
                        <div class="group-name">
                            子级分组1
                        </div>
                    </template>
                    <div class="group-body">
                        <el-select value="1" placeholder="全部分组" size="mini" style="width:100%;">
                            <el-option label="分组1" value="shanghai"></el-option>
                            <el-option label="分组2" value="beijing"></el-option>
                        </el-select>
                        <el-table :data="tableData" size="small" style="width: 100%">
                            <el-table-column prop="user_name" label="车牌号">
                            </el-table-column>
                            <el-table-column prop="total" label="报警总数">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-collapse-item>
                <el-collapse-item class="group-container">
                    <template slot="title">
                        <div class="group-name">
                            子级分组1
                        </div>
                    </template>
                    <div class="group-body">
                        <el-select value="1" placeholder="全部分组" size="mini" style="width:100%;">
                            <el-option label="分组1" value="shanghai"></el-option>
                            <el-option label="分组2" value="beijing"></el-option>
                        </el-select>
                        <el-table :data="tableData" size="small" style="width: 100%">
                            <el-table-column prop="user_name" label="车牌号">
                            </el-table-column>
                            <el-table-column prop="total" label="报警总数">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-collapse-item>

            </el-collapse>

        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      timer: null,
      tableData: []
    };
  },
  props: ["showVehicle", "aaa"],
  computed: {},
  mounted() {},
  created() {
    var monitor = this.$monitor;
    var showVehicle = this.$props.showVehicle;
    this.timer = setInterval(() => {
      if (showVehicle.isShowAll) {
      }
      var groups = monitor.dict.groups.get(this.$props.showVehicle.group_id);
      if (groups) {
        console.log(groups.get(this.$props.showVehicle.type));
      }
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    getShowVehicleTitle() {
      return {
        total: "全部车辆",
        online: "在线车辆",
        alarm: "报警车辆",
        error: "异常车辆",
        offline: "离线车辆"
      }[this.showVehicle.type];
    },
    closeShowVehicle() {
      this.$emit("close");
    }
  }
};
</script>
<style lang="less">
@import "../../../style/var.less";
</style>