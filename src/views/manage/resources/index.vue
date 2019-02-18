<template>
  <div class="admin-table-container">
    <el-form
      :rules="rules"
      :model="tableQuery"
      label-position="left"
      size="small"
      ref="baseForm"
      label-width="95px"
    >
      <el-card shadow="always" style="float: left;width: 19%;height: 714px;">
        <el-row style="text-align:left;font-size: 14px; color: #606266;">
          <el-col>
            <el-form-item label="公安部"></el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="中交天枢"></el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="area" label="所属地区">
              <select-city
                v-model="tableQuery.area"
                :province_id.sync="tableQuery.province_id"
                :city_id.sync="tableQuery.city_id"
                :county_id.sync="tableQuery.county_id"
                style="width:100%;"
              ></select-city>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="企业名称">{{userForm.real_name}}</el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="license" label="车牌号">
              <el-input
                v-model="tableQuery.license"
                :disabled="license_type"
                style="width:100%;"
                @focus="getVehicle"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="video_channel" label="通道号">
              <el-input
                :disabled="channel_type"
                v-model="tableQuery.video_channel"
                style="width:100%;"
                @focus="getChannel"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <div style="width:80%;float:right">
        <el-card shadow="always" class="admin-table-search">
          <el-row :gutter="20">
            <el-col :span="7">
              <el-form-item prop="time" label-width="50px" label="时间">
                <el-date-picker
                  style="width:100%"
                  v-model="tableQuery.time"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="type" label="音视频类型">
                <el-select clearable v-model="tableQuery.type" style="width:100%">
                  <el-option value="1" label="视频资源">视频资源</el-option>
                  <el-option value="2" label="音频资源">音频资源</el-option>
                  <el-option value="3" label="照片抓拍">照片抓拍</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="from" label="资源来源">
                <el-select clearable v-model="tableQuery.from" style="width:100%">
                  <el-option value="1" label="自动报警">自动报警</el-option>
                  <el-option value="2" label="手动保存">手动保存</el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align:right">
              <el-form-item label-width="0">
                <el-button @click="getTable()" type="primary">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="always" class="admin-table-search">
          <div style="width: 80%;display:inline-block">
            <el-table :data="tableData.data" height="530px">
              <el-table-column prop="video_name" label="名称"></el-table-column>
              <el-table-column prop="license" label="车牌号"></el-table-column>
              <el-table-column prop="time_length" label="时长"></el-table-column>
              <el-table-column prop="create_time" label="时间"></el-table-column>
              <el-table-column prop="address" label="位置"></el-table-column>
              <el-table-column prop="size" label="大小"></el-table-column>
              <el-table-column
                prop="alarm_type"
                label="报警类型"
                :formatter="(row)=>{return this.$dict.getAlarm(row.alarm_type)}"
              ></el-table-column>
              <el-table-column prop="from" label="资源来源">
                <template slot-scope="scope">
                  <label v-if="scope.row.from=='1'">自动报警</label>
                  <label v-if="scope.row.from=='2'">手动保存</label>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="音视频类型">
                <template slot-scope="scope">
                  <label v-if="scope.row.type=='1'">视频资源</label>
                  <label v-if="scope.row.type=='2'">音频资源</label>
                  <label v-if="scope.row.type=='3'">照片抓拍</label>
                </template>
              </el-table-column>
              <el-table-column prop="note" label="备注"></el-table-column>
            </el-table>
            <div class="admin-table-pager">
              <el-pagination
                @size-change="handleSizeChange "
                @current-change="handleCurrentChange "
                :current-page="tableQuery.page "
                :page-sizes="[10, 20, 50, 100] "
                :page-size="tableQuery.size "
                :total="tableData.total "
                layout="total, sizes, prev, pager, next, jumper "
                background
              ></el-pagination>
            </div>
          </div>
          <div
            style="width:20%;height:530px; display:inline-block;border-left: solid 1px;position: absolute;"
          >
            <h4 style="width:100%;text-align:center">音视频资源统计</h4>
            <ul style="list-style: none;line-height: 32px;padding: 10px 66px;font-size:14px">
              <li>总计：{{tableData.total||"--"}}</li>
              <hr
                style="height:1px;border:none;border-top:1px dashed #0066CC;margin-top:5px;margin-bottom:5px"
              >
              <li>视频资源：{{statistical.video||"--"}}</li>
              <li>大小：{{statistical.video_size||"--"}}</li>
              <li>时长：{{statistical.video_duration||"--"}}</li>
              <li>自动报警：{{statistical.video_automatic||"--"}}</li>
              <li>手动保存：{{statistical.video_manual||"--"}}</li>
              <hr
                style="height:1px;border:none;border-top:1px dashed #0066CC;margin-top:5px;margin-bottom:5px"
              >
              <li>音频资源：{{statistical.audio||"--"}}</li>
              <li>大小：{{statistical.audio_size||"--"}}</li>
              <li>时长：{{statistical.audio_duration||"--"}}</li>
              <li>自动报警：{{statistical.audio_automatic||"--"}}</li>
              <li>手动保存：{{statistical.audio_manual||"--"}}</li>
              <hr
                style="height:1px;border:none;border-top:1px dashed #0066CC;margin-top:5px;margin-bottom:5px"
              >
              <li>照片抓拍：{{statistical.snap||"--"}}</li>
              <li>大小：{{statistical.snap_size||"--"}}</li>
            </ul>
          </div>
        </el-card>
      </div>
    </el-form>
    <el-dialog
      width="30%"
      title="选择车辆"
      :visible.sync="vehicleDialog"
      :append-to-body="true"
      class="admin-dialog"
    >
      <select-license :area="areaData" @choose="saveVehicle" :key="addKey"></select-license>
    </el-dialog>
    <el-dialog
      width="30%"
      title="选择通道"
      :visible.sync="channelDialog"
      :append-to-body="true"
      class="admin-dialog"
    >
      <select-channel @choose="saveChannel" :channel="channelData" :key="addKey"></select-channel>
    </el-dialog>
  </div>
</template>
<script>
import { rules } from "@/utils/rules.js";
import moment from "moment";
import { getCurrentUser, getVideo } from "@/api/index.js";
import selectLicense from "./select-license.vue";
import selectCity from "@/components/select-city.vue";
import selectChannel from "./select-channel.vue";
import { location2address, gps2amap } from "@/utils/map-tools.js";
export default {
  components: { selectCity, selectLicense, selectChannel },
  created() {
    getCurrentUser().then(res => {
      if (res.data.code == 0) {
        this.$set(this.$data, "userForm", res.data.data[0]);
      } else {
        return this.$notify({
          message: res.data.msg,
          title: "提示",
          type: "error"
        });
      }
    });
  },
  data() {
    return {
      areaData: [],
      channelData: {},
      userForm: {},
      channel_type: true,
      license_type: true,
      vehicleDialog: false,
      channelDialog: false,
      addKey: 0,
      statistical: {
        audio: 0, //音频资源
        audio_size: 0, //音频大小
        aidio_duration: 0, //音频时长
        audio_automatic: 0, //音频自动报警
        audio_manual: 0, //音频手动保存
        video: "", //视频资源
        video_size: 0, //视频大小
        video_duration: 0, //视频时长
        video_automatic: 0, //视频自动报警
        video_manual: 0, //视频手动保存
        snap: 0, //照片抓拍
        snap_size: 0 //照片抓拍大小
      },
      tableQuery: {
        page: 1,
        size: 10,
        source: "",
        time: "",
        area: [],
        province_id: "",
        city_id: "",
        county_id: "",
        license: "",
        video_channel: "",
        begin_time: "",
        end_time: "",
        type: "", //音视频类型
        from: "" //资源来源
      },
      rules: {
        ...rules,
        type: [
          { required: true, trigger: "change", message: "请选择音视频类型" }
        ],
        from: [
          { required: true, trigger: "change", message: "请选择资源来源" }
        ],
        time: [
          {
            required: true,
            trigger: "change",
            validator: this.validateTime
          }
        ],
        area: [
          {
            required: true,
            trigger: "blur",
            validator: this.validateArea
          }
        ],
        license: [
          {
            required: true,
            trigger: "change",
            message: "车牌号不能为空"
          }
        ],
        video_channel: [
          {
            required: true,
            trigger: "change",
            message: "通道不能为空"
          }
        ]
      },
      tableData: {
        data: [],
        total: 0
      }
    };
  },
  watch: {
    "tableQuery.area": function() {
      this.license_type = false;
    },
    "tableQuery.license": function() {
      this.channel_type = false;
    }
  },
  methods: {
    // 时间验证
    validateTime(rule, value, callback) {
      if (value) {
        this.tableQuery.begin_time = moment(value[0]).format("YYYYMMDDHHmmss");
        this.tableQuery.end_time = moment(value[1]).format("YYYYMMDDHHmmss");
        callback();
      } else {
        callback(new Error("请选择时间!"));
      }
    },
    // 所属地区验证
    validateArea(rule, value, callback) {
      if (value.length != 0) {
        callback();
      } else {
        callback(new Error("请选择所属地区!"));
      }
    },
    // 选择车辆
    getVehicle() {
      this.vehicleDialog = true;
      this.addKey++;
      this.$set(this.$data, "areaData", this.tableQuery.area);
    },
    // 选择车辆回调
    saveVehicle(data) {
      this.vehicleDialog = false;
      this.$set(this.tableQuery, "license", data.license);
    },
    // 查询视频
    getTable() {
      this.$refs.baseForm.validate(isVaildate => {
        if (isVaildate) {
          getVideo(this.tableQuery).then(res => {
            if (res.data.code == 0) {
              var data = [];
              this.resourcesStatistics(res.data.data);
              data = res.data.data;
              var loader = this.$loading({
                text: "正在转换坐标"
              });
              gps2amap({
                data: data,
                longKey: "longitude",
                latKey: "latitude"
              })
                .then(res => {
                  data.map((item, index) => {
                    item.amap_longitude = res[index].split(",")[0];
                    item.amap_latitude = res[index].split(",")[1];
                  });
                })
                .catch(() => {
                  loader.close();
                })
                .then(() => {
                  loader.close();
                  loader = this.$loading({
                    text: "正在转换地址"
                  });
                  location2address({
                    data: data,
                    longKey: "amap_longitude",
                    latKey: "amap_latitude"
                  })
                    .then(addressArr => {
                      loader.close();
                      data.map((item, index) => {
                        item.address = addressArr[index];
                      });
                      this.$set(this.tableData, "data", Object.freeze(data));
                      this.$set(
                        this.tableData,
                        "total",
                        this.tableData.data.length
                      );
                    })
                    .catch(() => {
                      loader.close();
                    });
                });
            } else {
              return this.$notify({
                message: res.data.msg,
                title: "提示",
                type: "error"
              });
            }
          });
        }
      });
    },
    // 音视频资源统计
    resourcesStatistics(data) {
      var video = [];
      var audio = [];
      var snap = [];
      var video_auto = [];
      var audio_auto = [];
      var video_manual = [];
      var audio_manual = [];
      data.map(item => {
        switch (item.type) {
          case "1":
            video.push(item);
            break;
          case "2":
            audio.push(item);
            break;
          case "3":
            snap.push(item);
            break;
        }
      });
      this.statistical.snap = snap.length;
      this.statistical.video = video.length;
      this.statistical.audio = audio.length;
      video.map(item => {
        item.size = Number(item.size);
        item.time_length = Number(item.time_length);
        if (item.from == "1") {
          video_auto.push(item);
        } else if (item.from == "2") {
          video_manual.push(item);
        }
        this.statistical.video_size = this.statistical.video_size + item.size;
        this.statistical.video_duration =
          this.statistical.video_duration + item.time_length;
      });
      audio.map(item => {
        item.size = Number(item.size);
        item.time_length = Number(item.time_length);
        if (item.from == "1") {
          audio_auto.push(item);
        } else if (item.from == "2") {
          audio_manual.push(item);
        }
        this.statistical.audio_duration =
          this.statistical.audio_duration + item.time_length;
        this.statistical.audio_size = this.statistical.audio_size + item.size;
      });
      snap.map(item => {
        item.size = Number(item.size);
        this.statistical.snap_size = this.statistical.snap_size + item.size;
      });
      this.$set(this.statistical, "audio_automatic", audio_auto.length);
      this.$set(this.statistical, "audio_manual", audio_manual.length);
      this.$set(this.statistical, "video_automatic", video_auto.length);
      this.$set(this.statistical, "video_manual", video_manual.length);
    },
    // 选择通道号
    getChannel() {
      this.addKey++;
      this.channelDialog = true;
      var data = {};
      data = {
        area: this.tableQuery.area,
        license: this.tableQuery.license
      };
      this.$set(this.$data, "channelData", data);
    },
    // 选择通道号回调
    saveChannel(data) {
      this.channelDialog = false;
      this.$set(this.tableQuery, "video_channel", data.video_channel);
    },
    // 分页
    handleSizeChange(val) {
      this.tableQuery.page = 1;
      this.tableQuery.size = val;
      this.getTable();
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val;
      this.getTable();
    }
  }
};
</script>
<style>
</style>