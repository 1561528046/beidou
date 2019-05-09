<template>
  <div>
    <el-form :model="formData" label-width="130px" size="small">
      <el-row :gutter="20">
        <el-col>
          <el-form-item label="休眠唤醒模式">
            <el-checkbox-group v-model="formData.wakeList">
              <el-checkbox :label="2">条件唤醒</el-checkbox>
              <el-checkbox :label="1">定时唤醒</el-checkbox>
              <el-checkbox :label="0">手动唤醒</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="condition">
          <el-form-item label="唤醒条件类型">
            <el-checkbox-group v-model="formData.wakeLogo">
              <el-checkbox label="2">紧急报警</el-checkbox>
              <el-checkbox label="1">碰撞侧翻报警</el-checkbox>
              <el-checkbox label="0">车辆开门</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="timing">
          <el-form-item label="定时唤醒日设置">
            <el-checkbox-group v-model="formData.wakeUP">
              <el-checkbox label="6">周一</el-checkbox>
              <el-checkbox label="5">周二</el-checkbox>
              <el-checkbox label="4">周三</el-checkbox>
              <el-checkbox label="3">周四</el-checkbox>
              <el-checkbox label="2">周五</el-checkbox>
              <el-checkbox label="1">周六</el-checkbox>
              <el-checkbox label="0">周日</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="timing">
          <el-form-item label="定时唤醒启用标志">
            <el-checkbox-group v-model="formData.enableLogo">
              <el-checkbox label="3">时间段1</el-checkbox>
              <el-checkbox label="2">时间段2</el-checkbox>
              <el-checkbox label="1">时间段3</el-checkbox>
              <el-checkbox label="0">时间段4</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.enableLogo.includes('0')" :span="12">
          <el-form-item label="时间段1唤醒时间">
            <el-time-picker
              format="HH:mm"
              value-format="HH:mm"
              v-model="formData.time.WakeTime1"
              placeholder="任意时间点"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.enableLogo.includes('0')" :span="12">
          <el-form-item label="时间段1关闭时间">
            <el-time-picker
              format="HH:mm"
              value-format="HH:mm"
              v-model="formData.time.CloseTime1"
              placeholder="任意时间点"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.enableLogo.includes('1')" :span="12">
          <el-form-item label="时间段2唤醒时间">
            <el-time-picker
              format="HH:mm"
              value-format="HH:mm"
              v-model="formData.time.WakeTime2"
              placeholder="任意时间点"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.enableLogo.includes('1')" :span="12">
          <el-form-item label="时间段2关闭时间">
            <el-time-picker
              format="HH:mm"
              value-format="HH:mm"
              v-model="formData.time.CloseTime2"
              placeholder="任意时间点"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.enableLogo.includes('2')" :span="12">
          <el-form-item label="时间段3唤醒时间">
            <el-time-picker
              format="HH:mm"
              value-format="HH:mm"
              v-model="formData.time.WakeTime3"
              placeholder="任意时间点"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.enableLogo.includes('2')" :span="12">
          <el-form-item label="时间段3关闭时间">
            <el-time-picker
              format="HH:mm"
              value-format="HH:mm"
              v-model="formData.time.CloseTime3"
              placeholder="任意时间点"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.enableLogo.includes('3')" :span="12">
          <el-form-item label="时间段4唤醒时间">
            <el-time-picker
              format="HH:mm"
              value-format="HH:mm"
              v-model="formData.time.WakeTime4"
              placeholder="任意时间点"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.enableLogo.includes('3')" :span="12">
          <el-form-item label="时间段4关闭时间">
            <el-time-picker
              format="HH:mm"
              value-format="HH:mm"
              v-model="formData.time.CloseTime4"
              placeholder="任意时间点"
            ></el-time-picker>
          </el-form-item>
        </el-col>
        <el-col style="text-align:center">
          <el-form-item label-width="0">
            <el-button @click="submitForm" type="primary">提交</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  created() {
    if (this.$props.simid) {
      this.$set(this.formData, "sim_id", "0" + this.$props.simid);
    }
    this.$instruction.on("x0104", evt => {
      var data = JSON.parse(evt.data);
      if (data.Parameters[0].ParameterId == 124) {
        if (data.Parameters[0].x007CItem[0].SleepWakeMode != 0) {
          // 终端休眠唤醒模式
          var num = data.Parameters[0].x007CItem[0].SleepWakeMode.toString(2);
          for (var i = num.length; i < 3; i++) {
            num = "0" + num;
          }
          num.split("").map((item, index) => {
            if (item == "1") {
              this.formData.wakeList.push(index);
            }
          });
        }
        if (data.Parameters[0].x007CItem[0].WakeConditionType != 0) {
          // 唤醒条件
          this.condition = true;
        }
        if (data.Parameters[0].x007CItem[0].WakeConditionType != 0) {
          // 定时唤醒
          this.timing = true;
        }
      }
    });
  },
  data() {
    return {
      timing: false, //定时唤醒
      condition: false, //条件唤醒
      formData: {
        sim_id: "",
        wakeList: [], //唤醒模式
        wakeLogo: [], //唤醒标志
        enableLogo: [], //启用标志
        wakeUP: [], //唤醒日
        time: {
          WakeTime1: "00:00",
          CloseTime1: "00:00",
          WakeTime2: "00:00",
          CloseTime2: "00:00",
          WakeTime3: "00:00",
          CloseTime3: "00:00",
          WakeTime4: "00:00",
          CloseTime4: "00:00"
        }
      }
    };
  },
  watch: {
    "formData.enableLogo": function() {
      if (!this.formData.enableLogo.includes("0")) {
        this.formData.time.WakeTime1 = "00:00";
        this.formData.time.CloseTime1 = "00:00";
      }
      if (!this.formData.enableLogo.includes("1")) {
        this.formData.time.WakeTime2 = "00:00";
        this.formData.time.CloseTime2 = "00:00";
      }
      if (!this.formData.enableLogo.includes("2")) {
        this.formData.time.WakeTime3 = "00:00";
        this.formData.time.CloseTime3 = "00:00";
      }
      if (!this.formData.enableLogo.includes("3")) {
        this.formData.time.WakeTime4 = "00:00";
        this.formData.time.CloseTime4 = "00:00";
      }
    },
    "formData.wakeList": function() {
      if (this.formData.wakeList.includes(1)) {
        this.timing = true;
      } else {
        this.timing = false;
      }
      if (this.formData.wakeList.includes(2)) {
        this.condition = true;
      } else {
        this.condition = false;
      }
    }
  },
  props: ["simid"],
  methods: {
    submitForm() {
      if (this.formData.sim_id == "") {
        return this.$notify({
          message: "请选择车辆",
          title: "提示",
          type: "error"
        });
      }
      var wakeList = [0, 0, 0]; //唤醒模式
      var wakeLogo = [0, 0, 0]; //唤醒标志
      var enableLogo = [0, 0, 0, 0]; //启用标志
      var wakeUP = [0, 0, 0, 0, 0, 0, 0]; //唤醒日
      this.formData.wakeList.map(item => {
        wakeList[item] = 1;
      });
      this.formData.wakeLogo.map(itcm => {
        wakeLogo[itcm] = 1;
      });
      this.formData.enableLogo.map(ibem => {
        enableLogo[ibem] = 1;
      });
      this.formData.wakeUP.map(ibem => {
        wakeUP[ibem] = 1;
      });
      var data = {};
      data = {
        MessageID: "x8103",
        SimID: this.formData.sim_id,
        ParameterId: 124,
        x007CItem: {
          SleepWakeMode: parseInt(wakeList.join(""), 2), //休眠唤醒模式
          WakeConditionType: parseInt(wakeLogo.join(""), 2), //唤醒条件类型
          TimedWakeDaySetting: parseInt(wakeUP.join(""), 2), //定时唤醒日设置
          WakeParameter: {
            TimedWakeEnableFlag: parseInt(enableLogo.join(""), 2), //定时唤醒启用标志
            WakeTime1: this.formData.time.WakeTime1.replace(":", ""), //时间段1唤醒时间
            CloseTime1: this.formData.time.CloseTime1.replace(":", ""), //时间段1关闭时间
            WakeTime2: this.formData.time.WakeTime2.replace(":", ""), //时间段2唤醒时间
            CloseTime2: this.formData.time.CloseTime2.replace(":", ""), //时间段2关闭时间
            WakeTime3: this.formData.time.WakeTime3.replace(":", ""), //时间段3唤醒时间
            CloseTime3: this.formData.time.CloseTime3.replace(":", ""), //时间段3关闭时间
            WakeTime4: this.formData.time.WakeTime4.replace(":", ""), //时间段4唤醒时间
            CloseTime4: this.formData.time.CloseTime4.replace(":", "") //时间段4关闭时间
          } //日定时唤醒参数列表
        }
      };
      this.$instruction.send(JSON.stringify(data));
    }
  }
};
</script>