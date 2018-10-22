<template >
  <div>
    <el-table height="300" :data="communication.data" style="width: 100%" class="admin-table-list">
      <el-table-column prop="license" label="车牌号" :formatter="$utils.baseFormatter"> </el-table-column>
      <el-table-column prop="operating" label="操作状态"></el-table-column>
      <!-- <el-table-column prop="Ox8300" label="文本信息下发" :formatter="$utils.baseFormatter"> </el-table-column> -->
    </el-table>
    <el-form label-width="150px" label-position="left" class="table-search" size="small">
      <el-select @change="chooseSetting" v-model="parameter" style="margin-bottom:10px;">
        <el-option value="1" label="文本信息下发">文本信息下发</el-option>
        <el-option value="2" label="信息服务">信息服务</el-option>
        <el-option value="3" label="提问应答">提问应答</el-option>
      </el-select>
      <!-- 文本信息下发 -->
      <div v-if="text_Information" style="width:30%;margin:0 auto; text-align:center;">
        <el-form-item label="标志">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="文本信息">
          <el-input></el-input>
        </el-form-item>
        <el-button type="primary" @click="setup()" size="small">设置</el-button>
      </div>
      <!-- 信息服务 -->
      <div v-if="service" style="width:30%;margin:0 auto; text-align:center;">
        <el-form-item label="信息类型">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="信息长度">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="信息内容">
          <el-input></el-input>
        </el-form-item>
        <el-button type="primary" @click="setup()" size="small">设置</el-button>
      </div>
      <!-- 提问应答 -->
      <div v-if="questions" style="width:30%;margin:0 auto; text-align:center;">
        <el-form-item label="应答流水号">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="答案ID">
          <el-input></el-input>
        </el-form-item>
        <el-button type="primary" @click="setup()" size="small">设置</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import chooseParameter from "@/components/choose-parameter.vue";
export default {
  components: { chooseParameter },
  //   name: "choose-communication",
  data() {
    return {
      text_Information: false,
      service: false,
      questions: false,
      parameter: "",
      str: "",
      selectedVehicles: [],
      length: 0,
      vehicleDialog: false,
      communication: {
        data: []
      },
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
  watch: {
    message: {
      handler: function() {
        this.$set(this.communication, "data", this.$props.message);
      },
      deep: true
    },
    respond: {
      handler: function() {
        console.log(this.$props.respond);
      },
      deep: true
    }
  },
  computed: {},
  props: {
    message: Array,
    respond: String
  },
  created() {},
  methods: {
    //区域展示
    chooseSetting(type) {
      if (type == "1") {
        this.text_Information = true;
        this.service = false;
        this.questions = false;
      } else if (type == "2") {
        this.text_Information = false;
        this.service = true;
        this.questions = false;
      } else if (type == "3") {
        this.text_Information = false;
        this.service = false;
        this.questions = true;
      }
    },
    // 设置
    setup() {
      var parameter_id;
      // instructionset;
      if (this.parameter == "1") {
        parameter_id = "x8300";
      } else if (this.parameter == "2") {
        parameter_id = "x8304";
      } else if (this.parameter == "3") {
        parameter_id = "x0302";
      }
      console.log(parameter_id);
      // instructionset = "^" + parameter_id + "|" + "$";
    }
  }
};
</script>