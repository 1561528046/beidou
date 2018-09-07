<template>
  <div class="post-form">
    <div style="display:none;">{{rightsAll}}</div>
    <el-form label-position="top" status-icon :rules="rules" :model="formData" size="small" ref="baseForm" class="msg-form">
      <el-row :gutter="30">
        <el-col :span="24">
          <el-form-item label="角色名称" prop="role_name">
            <el-input v-model="formData.role_name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-alert title="注意：权限勾选自动选中有依赖关系的权限，并且为禁用状态" type="warning" close-text="知道了" style="margin-bottom:15px;">
          </el-alert>
          <el-collapse v-model="activeNames" class="rights-container">
            <el-collapse-item :name="key_1" v-for="(level_1,key_1) in rightsDict" :key="level_1.name">
              <template slot="title">
                <div class="_level_1-header">
                  <el-checkbox :indeterminate="level_1.indeterminate" v-model="level_1.checked" @change="(val)=>{ rightsCheckAll(val,'1',level_1)}">{{level_1.name}}</el-checkbox>
                  <span v-if="countDict[key_1]" style="padding-left:30px;">
                    <el-tag size="mini">
                      总共：{{countDict[key_1].total}} / 已选：{{countDict[key_1].selected}}
                    </el-tag>
                  </span>
                </div>
              </template>
              <div class="_level_1-body">
                <div v-for="(level_2) in level_1.children" :key="level_2.name" class="_level_2">
                  <div class="_level_2-title">
                    <el-checkbox :indeterminate="level_2.indeterminate" v-model="level_2.checked" @change="(val)=>{ rightsCheckAll(val,'2',level_2)}">{{level_2.name}}</el-checkbox>
                  </div>
                  <div class="_level_3">
                    <el-checkbox :disabled="right.disabled" @change="(val)=>{rightChange(val,right,level_2)}" v-for="right in level_2.children" :label="right.name" v-model="right.checked" :key="right.rights_id">
                      {{right.name}}
                      <el-tooltip effect="dark" :content="right.relation+'个权限依赖此项，不能操作！'" placement="right" v-if="right.relation>0">
                        <i class="el-icon-info"></i>
                      </el-tooltip>
                    </el-checkbox>
                  </div>
                </div>
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
<style scoped lang="less">
.rights-container {
  ._level_1-body {
    padding: 15px 15px 0 15px;
  }
  ._level_1-header {
    padding-left: 20px;
    background: #f5f7fa;
    border: 1px solid #ebeef5;
  }
  ._level_2 {
    border-bottom: 1px dotted #ddd;
    margin-bottom: 15px;
  }
  ._level_2-title {
  }
  ._level_3 {
    padding: 3px 25px;
    .el-checkbox__label {
      color: #888;
    }
  }
}
</style>
<script>
// eslint-disable-next-line
import { updateRole, getRightsAll, getRole } from "@/api/index.js";
import { rightsDict, rightsRelation } from "@/utils/rights.js";
export default {
  data() {
    return {
      activeNames: [], //展开那个
      device_total_turn: false,
      expiry_time_turn: false,
      rightsAll: [
        // {rights_id:"1-1-1",name:"新增车辆-添加"}
      ],
      rightsDict: {},
      countDict: {}, //计数，一共选中多少
      rightsRelation: {},
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
  props: {
    role_id: [Number, String]
  },
  watch: {
    rightsAll: {
      handler: function() {
        var countDict = {};
        this.rightsAll.map(item => {
          var path = item.rights_id.split("-")[0];
          countDict[path] = countDict[path] || { total: 0, selected: 0 };
          countDict[path].total++;
          if (item.checked) {
            countDict[path].selected++;
          }
        });
        this.$set(this.$data, "countDict", countDict);
      },
      deep: true
    }
  },
  created() {
    this.$set(this.$data, "rightsDict", JSON.parse(JSON.stringify(rightsDict)));
    this.$set(
      this.$data,
      "rightsRelation",
      JSON.parse(JSON.stringify(rightsRelation))
    );
    this.$nextTick(() => {
      this.activeNames.push("1");
    });
    getRightsAll().then(res => {
      if (res.data.code == 0) {
        var formatData = res.data.data[0];
        formatData = Object.keys(formatData).map(key => {
          //转换格式
          // {"1-1-1": "新增车辆-添加","1-1-2": "新增车辆-删除",}
          // 转换为 [{rights_id:"1-1-1",name:"新增车辆-添加"},{rights_id:"1-1-2",name:"新增车辆-删除"}]
          //relation 引用次数，用于解决一个权限 用于 多个依赖，引用次数为0的时候，即可清空选项
          return {
            rights_id: key,
            name: formatData[key],
            checked: false,
            relation: 0
          };
        });
        this.$set(this.$data, "rightsAll", formatData);
        this.initDict();
      }
    });
  },
  methods: {
    initDict() {
      //rightsDict中并入权限
      this.rightsAll.map(item => {
        var path = item.rights_id.split("-");
        var level1 = this.rightsDict[path[0]];
        if (!level1) {
          return false;
        }
        var level2 = level1.children[path[1]];
        if (!level2) {
          return false;
        }
        level2.children = level2.children || {};
        level2.selected = level2.selected || [];
        level2.children[path[2]] = item;
        if (item.checked) {
          level2.selected.push(item.rights_id);
          this.rightChange(true, item, level2);
        }
      });
      this.$set(this.$data, "rightsDict", this.rightsDict);

      //获取role，并设置对应值

      getRole({ role_id: this.$props.role_id }).then(res => {
        if (res.data.code == 0) {
          this.formData.role_name = res.data.data[0].role_name;
          var defaultChecked = res.data.data[0].rights.split(",");
          defaultChecked.map(rights_id => {
            var path = rights_id.split("-");
            var level1 = this.rightsDict[path[0]];
            var level2 = level1.children[path[1]];
            var right = level2.children[path[2]];
            right.checked = true;
            this.rightChange(true, right, level2);
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    rightsCheckAll(isChecked, level, levelObj) {
      //全选处理
      //levelObj.indeterminate = false;
      if (level == "2") {
        //levelObj.selected = [];
        Object.keys(levelObj.children).map(key => {
          var right = levelObj.children[key];
          if (right.checked != isChecked) {
            right.checked = isChecked;
            this.rightChange(isChecked, right, levelObj);
          }
        });
      }
      if (level == "1") {
        Object.keys(levelObj.children).map(key => {
          var rightGroup = levelObj.children[key];
          rightGroup.checked = isChecked;
          this.rightsCheckAll(isChecked, "2", rightGroup);
        });
      }
    },
    rightChange(isChecked, right, levelObj) {
      if (!isChecked) {
        //取消选择时，先判断引用次数，如果为0，不限制 如果大于0 不能取消选中
        if (right.relation > 0) {
          right.checked = true;
        }
      }
      //单个权限切换处理
      if (right.checked && levelObj.selected.indexOf(right.rights_id) == -1) {
        //加入到已选择
        levelObj.selected.push(right.rights_id);
      }
      if (!right.checked && levelObj.selected.indexOf(right.rights_id) != -1) {
        //在已选择中删除
        levelObj.selected.splice(levelObj.selected.indexOf(right.rights_id), 1);
      }
      //处理依赖
      this.resolveRelation(right);
      if (levelObj.selected.length == 0) {
        //如果已选择为空，消除未知状态并设置全选按钮
        levelObj.checked = false;
        levelObj.indeterminate = false;
        return false;
      }
      if (Object.keys(levelObj.children).length == levelObj.selected.length) {
        //如果已选择和所有的子元素数量相等，即为全选
        levelObj.checked = true;
        levelObj.indeterminate = false;
      } else {
        //已选择和子元素数量不相等，设置为未知状态
        levelObj.indeterminate = true;
      }
    },
    resolveRelation(right) {
      //如果选中某权限，其相关依赖会 自动选中，并且设置为disabled
      //如果取消某权限，其相关依赖会 不取消选中（因为可能存在相同依赖） 并且取消disabled限制
      var relation = this.rightsRelation[right.rights_id];
      if (relation) {
        //如果有依赖，就处理
        if (right.checked) {
          //处理选中
          this.rightsAll.map(item => {
            if (relation.indexOf(item.rights_id) != -1) {
              item.checked = true;
              item.disabled = true;
              item.relation++;
              if (item.relation > 1) {
                //从0次引用到1次，说明之前有引用次数，不用处理下面的逻辑
                return false;
              }
              var levelObj = this.getLevel2(item);
              this.rightChange(true, item, levelObj);
            }
          });
        } else {
          this.rightsAll.map(item => {
            if (relation.indexOf(item.rights_id) != -1) {
              item.relation--;
              if (item.relation > 0) {
                //如果还有引用次数，那么不做修改
                return false;
              } else {
                item.disabled = false;
              }
            }
          });
        }
      }
    },
    getLevel2(right) {
      //通过right找到父级
      var path = right.rights_id.split("-");
      var level1 = this.rightsDict[path[0]];
      if (!level1) {
        return null;
      }
      var level2 = level1.children[path[1]];
      if (!level2) {
        return null;
      }
      return level2;
    },
    formSubmit() {
      this.$refs.baseForm.validate((isVaildate, errorItem) => {
        if (isVaildate) {
          var postData = Object.assign({}, this.formData);
          postData.rights = [];
          this.rightsAll.map(item => {
            if (item.checked) {
              postData.rights.push(item.rights_id);
            }
          });
          postData.rights = postData.rights.join(",");
          postData.role_id = this.$props.role_id;
          updateRole(postData)
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
