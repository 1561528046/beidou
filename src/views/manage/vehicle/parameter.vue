<template>
    <div class="admin-table-container" style="position: absolute;left:0;right:0;bottom:0;top:107px;">
        <el-card shadow="always" style="height:100%;" class="full-box">
            <div class="bind-box" style="height:100%;">
                <el-tabs style=" width: 100%;position: relative; background-color:#fff;" type="border-card" @tab-click="handleClick">
                    <el-tab-pane label="通讯设置">
                        <template>
                            <el-button type="primary" size="small">选择车辆</el-button>
                        </template>
                        <el-form label-width="165px" label-position="left" class="table-search" size="small">
                            <el-row :gutter="30">
                                <el-col :span="8">
                                    <el-form-item label="TCP消息应答超时时间">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="TCP消息重传次数">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="UDP消息应答超时时间">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="UDP消息重传次数">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="SMS消息应答超时时间">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="SMS消息重传次数">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="主服务器APN">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="备份服务器APN">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="主服务器地址IP或域名">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="备份服务器地址IP或域名">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="服务器TCP端口">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="服务器UDP端口">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="位置汇报策略">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="位置汇报方案">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="车辆信息设置">
                        <el-form label-width="165px" label-position="left" class="table-search" size="small">
                            <el-row :gutter="30">
                                <el-col :span="8">
                                    <el-form-item label="车辆所在的省域ID">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="车辆所在的市域ID">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="机动车号牌">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="车牌颜色">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="行车报警设置">
                        <el-form label-width="165px" label-position="left" class="table-search" size="small">
                            <el-row :gutter="30">
                                <el-col :span="8">
                                    <el-form-item label="报警设置">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="最高速度(km/h)">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="超速持续时间">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="连续驾驶时间门限">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="当天累计驾驶时间门限">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="最小休息时间">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="最长停车时间">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="超速报警预警差值">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="疲劳驾驶预警差值">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="碰撞报警参数设置">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="侧翻报警参数设置">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="报警屏蔽策略设置">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="终端上报时间间隔设置">
                        <el-form label-width="180px" label-position="left" class="table-search" size="small">
                            <el-row :gutter="30">
                                <el-col :span="8">
                                    <el-form-item label="休眠时汇报时间间隔">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="紧急报警时汇报时间间隔">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="缺省时间汇报间隔">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="缺省距离汇报间隔">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="驾驶员未登录汇报时间间隔">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="驾驶员未登录汇报距离间隔">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="休眠时汇报距离间隔">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="超速报警预警差值">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="疲劳驾驶预警差值">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="紧急报警时汇报距离间隔">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="终端通讯设置">
                        <el-form label-width="180px" label-position="left" class="table-search" size="small">
                            <el-row :gutter="30">
                                <el-col :span="8">
                                    <el-form-item label="监控平台电话号码">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="监控平台SMS电话号码">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="接收终端SMS文本报警号码">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="终端电话接听策略">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="监听电话号码">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="监管平台特权短信号码">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="拍照设置">
                        <el-form label-width="130px" label-position="left" class="table-search" size="small">
                            <el-row :gutter="30">
                                <el-col :span="8">
                                    <el-form-item label="定时拍照控制">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="定距拍照控制">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="图像/视频质量">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="亮度">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="对比度">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="饱和度">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item label="色度">
                                        <el-input></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </el-card>
    </div>
</template>
<script>
export default {
  components: {},
  created() {},
  props: {
    vehicle_type: Number, //vehicle_type区分普货和其他类型车辆
    state: Number //state: 1新增车辆 2定位车辆 3到期车辆
  },
  data() {
    return {
      tableQuery: {
        license: "",
        user_name: "",
        type: 1
      },
      tableLoading: true,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  watch: {
    tableQuery: {
      handler: function() {
        if (this.tableQuery.type == 1) {
          this.tableQuery.user_name = "";
          this.getTable();
        } else {
          this.tableQuery.license = "";
          this.getTable();
        }
      },
      deep: true
    }
  },
  methods: {
    tabsClick(tab) {
      if (tab.label == "车牌号") {
        this.tableQuery.type = 1;
      }
      if (tab.label == "用户名") {
        this.tableQuery.type = 2;
      }
    },
    handleClick() {},
    getTable() {
      console.log(this.tableQuery);
    },
    handleSizeChange(val) {
      //每页数量切换
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      //翻页
      this.tableQuery.page = val;
      this.getTable();
    }
  }
};
</script>
<style>
.bind-box {
  display: flex;
  margin: -20px;
  font-size: 14px;
  height: 100%;
}
.user-header {
  height: 40px;
  line-height: 40px;
  background: #f5f7fa;
  margin: 0;
  border-bottom: 1px solid #ebeef5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #000;
}
.user-list {
  position: absolute;
  top: 100px;
  bottom: 32px;
  width: 100%;
  overflow: auto;
}
.user-pager {
  background: #f1f1f1;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 32px;
  line-height: 32px;
  text-align: center;
}
.el-input__inner {
  text-align: center;
}
ul,
li {
  margin: 0;
  padding: 0;
}
li {
  height: 32px;
  line-height: 32px;
  overflow: hidden;
  list-style-type: none;
  box-sizing: border-box;
  padding: 0 15px;
}
li.active {
  color: #fff;
  background-color: #1890ff !important;
}
li:hover {
  background-color: #f5f7fa;
  cursor: pointer;
}
.el-card__body {
  height: 100%;
}
</style>
