<template>
  <div class="post-form">
    <el-form label-position="top" status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
      <el-row :gutter="30">
        <el-col :span="24">
          <el-form-item label="角色名称" prop="role_name">
            <el-input v-model="formData.role_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-collapse v-model="activeNames">
            <el-collapse-item :title="item.name" :name="index+1" v-for="(item,index) in rightsDict" :key="item.name">
              <div v-for="(model,modelIndex) in item.children">
                <div>
                  <el-checkbox :label="model" @change="(val)=>{modelCheckAll(val,index,modelIndex)}"></el-checkbox>
                </div>
                <el-checkbox v-for="right in rightsAll" :label="right.name" v-model="right.checked" :key="right.rights_id" v-if="isInModel(right,index,modelIndex)">{{right.name}}</el-checkbox>
              </div>

            </el-collapse-item>
          </el-collapse>
        </el-col>
      </el-row>

      <el-form-item style="text-align:center; padding-top:20px;">
        <el-button type="primary" @click="formSubmit" size="large">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { addRole, getRightsAll } from "@/api/index.js";
export default {
  data() {
    return {
      activeNames: [1], //展开那个
      device_total_turn: false,
      expiry_time_turn: false,
      rightsAll: [
        // {rights_id:"1-1-1",name:"新增车辆-添加"}
      ],
      rightsDict: [
        //权限字典
        {
          name: "车辆管理",
          children: ["新增车辆", "定位车辆", "到期车辆", "故障车辆", "车辆数据"]
        },
        { name: "终端管理", children: ["设备", "设备维修", "SIM卡"] },
        {
          name: "用户管理",
          children: ["车辆分组", "公司用户", "个人用户", "司机", "角色"]
        }
      ],
      rightsRelation: {
        //权限依赖关系
        "1-1-1": ["2-1-4", "2-3-4"] //"新增车辆-添加"
      },
      formData: {
        role_name: "",
        rights: []
      },
      rules: {
        role_name: [
          { required: true, message: "必须填写角色名称", trigger: "change" }
        ]
      }
    };
  },
  computed: {},
  watch: {
    device_total_turn: function() {
      this.formData.device_total = "";
    },
    expiry_time_turn: function() {
      this.formData.expiry_time = "";
    }
  },
  created() {
    getRightsAll().then(res => {
      if (res.data.code == 0) {
        var formatData = res.data.data[0];
        formatData = Object.keys(formatData).map(key => {
          //转换格式
          // {"1-1-1": "新增车辆-添加","1-1-2": "新增车辆-删除",}
          // 转换为 [{rights_id:"1-1-1",name:"新增车辆-添加"}]
          return { rights_id: key, name: formatData[key], checked: true };
        });
        this.$set(this.$data, "rightsAll", formatData);
      }
    });
  },
  methods: {
    isInModel(right, index, modelIndex) {
      //验证权限是否属于某分组内
      var path = right.rights_id.split("-");
      return (
        path[0] == parseInt(index) + 1 && path[1] == parseInt(modelIndex) + 1
      );
    },
    modelCheckAll(val, index, modelIndex) {
      this.rightsAll.map(item => {
        var path = item.rights_id.split("-");
        if (this.isInModel(item, index, modelIndex)) {
          item.checked = val;
        }
      });
    },
    formSubmit() {
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var areaObj = this.$utils.formatArea(this.formData.area);
          var postData = Object.assign({}, this.formData, areaObj);
          postData.device_total = postData.device_total || 0;
          postData.expiry_time = postData.expiry_time || 0;
          postData.user_type = this.user_type;
          postData.pass_word = postData.pass_word.MD5(16);
          delete postData.re_pass_word;
          addRole(postData)
            .then(res => {
              if (res.data.code == 0) {
                this.$emit("success");
                this.$notify.success({
                  title: "成功",
                  message: res.data.msg
                });
              } else {
                this.$emit("error");
                this.$notify.error({
                  title: "失败",
                  message: res.data.msg
                });
              }
            })
            .catch(() => {
              this.$notify.error({
                title: "失败",
                message: "接口错误"
              });
              this.$emit("error");
            });
        } else {
          var errormsg = "";
          for (var key in errorItem) {
            errormsg += errorItem[key][0].message + "<br>";
          }
          this.$notify.error({
            title: "错误",
            dangerouslyUseHTMLString: true,
            message: errormsg
          });
        }
      });
    }
  }
};
</script>
