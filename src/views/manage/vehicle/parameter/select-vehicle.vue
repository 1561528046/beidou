<template>
  <div style="margin-bottom:15px;">
    <el-button type="primary" size="small" @click="vehicleClick" style="margin-right:10px;">选择车辆</el-button>
    <label>已选择车辆{{length}}</label>
    <el-dialog width="60%" title="车辆信息" :visible.sync="vehicleDialog " :append-to-body="true " :close-on-click-modal="false " :close-on-press-escape="false " :center="true " class="admin-dialog">
      <choose-parameter :selected="selectedVehicles" @choose="vehicleArr"></choose-parameter>
    </el-dialog>
    <hr/>
  </div>

</template>
<script>
import chooseParameter from "@/components/choose-parameter.vue";
export default {
  components: { chooseParameter },
  data() {
    return {
      selectedVehicles: [],
      length: 0,
      vehicleDialog: false,
      tableQuery: {
        license: "",
        user_name: "",
        type: 1
      },
      tableData: {
        total: 0,
        data: []
      },
      tableLoading: true
    };
  },
  watch: {},
  computed: {},
  props: {},
  created() {},
  methods: {
    vehicleClick() {
      this.vehicleDialog = true;
    },
    vehicleArr(scope) {
      this.vehicleDialog = false;
      this.length = scope.length;
      scope.map(item => {
        item.operating = "--";
      });
      this.$emit("choose", scope);
    }
  }
};
</script>
