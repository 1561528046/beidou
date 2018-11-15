<template>
  <div>
    <el-row>
      <el-button>申请交换指定车辆定位信息请求消息 0x1207</el-button>
      <el-button> 取消交换指定车辆定位信息请求消息 0x1208</el-button>
      <el-button>补发车辆定位信息请求 0x1209</el-button>
      <el-button>主动上报驾驶员身份信息 0x120C</el-button>
      <el-button>主动上报车辆电子运单信息 0x120D</el-button>
      <el-button>平台查岗应答 0x1301</el-button>

      <el-button>报警督办应答 0x1401</el-button>
      <el-button>上报报警信息 0x1402</el-button>
      <el-button>主动上报报警处理结果 0x1403</el-button>

    </el-row>
    <el-table :data="list" size="mini">
      <el-table-column prop="VEHICLE_NO" label="车牌号"></el-table-column>
      <el-table-column prop="VEHICLE_COLOR" label="车牌颜色"></el-table-column>
      <el-table-column label="类型" :formatter="getType"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <template v-if="scope.row.DATA_TYPE.toString(16) == '9202'">
            <el-popover trigger="hover" placement="top">
              <p>交换车辆定位信息</p>
              <p>地图是否加密: {{ ["未加密","已加密"][scope.row.GNSS_DATA.EXCRYPT] }}</p>
              <p>时间: {{ scope.row.GNSS_DATA.DATE }} {{ scope.row.GNSS_DATA.TIME }}</p>
              <p>经度: {{ scope.row.GNSS_DATA.LON }}</p>
              <p>纬度: {{ scope.row.GNSS_DATA.LAT }}</p>
              <p>速度: {{ scope.row.GNSS_DATA.VEC1 }} km/h</p>
              <p>行驶记录速度: {{ scope.row.GNSS_DATA.VEC2 }} km/h</p>
              <p>总里程: {{ scope.row.GNSS_DATA.VEC3 }} km</p>
              <p>方向: {{ scope.row.GNSS_DATA.DIRECTION }}</p>
              <p>海拔: {{ scope.row.GNSS_DATA.ALTITUDE }} m</p>
              <p>状态: {{ scope.row.GNSS_DATA.STATE }}</p>
              <p>报警状态: {{ scope.row.GNSS_DATA.ALARM }}</p>
              <div slot="reference">
                <el-tag size="medium">详细信息</el-tag>
              </div>
            </el-popover>
          </template>

          <template v-if="scope.row.DATA_TYPE.toString(16) == '9203'">
            <el-popover trigger="hover" placement="top">
              <p>车辆定位信息交换补发</p>
              <p>
                {{scope.row}}
              </p>
              <div slot="reference">
                <el-tag size="medium">详细信息</el-tag>
              </div>
            </el-popover>
          </template>

          <template v-if="scope.row.DATA_TYPE.toString(16) == '9204'">
            <el-popover trigger="hover" placement="top">
              <p>交换车辆静态信息</p>
              <p>
                {{scope.row.CAR_INFO}}
              </p>
              <!-- TRANS TYPE:=030;VIN:=i 浙 A25307; TRACTION:=30;TRAILER_V1N:=浙 A21107
桂;VEHICLE_NATIONALIT:=330108; VEHICLE_TYPE:=40;
RTPN:=330101212280;OWERS_NAME:=杭州货运代理公司;OWERS_ORIG
ID :=1000;OWERS_TEL:=13516814499; RTOLN:=330101200006; VEHICLE-MODE:=解放
5163;VEI-IICLG COLOR:=1;VEI-IICLE_ORIG_ID:=12345; DRIVER-INFO:=阮孟禄
13301011060008040000}13854389438;GUARDS_INFO:=刘二
3301011050108030000113717660901;APPROVED_TONNAGE:=5;DG_TYPE:=03115;CARGO
_NAME:=天燃气;CARGO_TONNAGE:=3;TRANSPO_ORIGIN=萧山区;TRANSPORT_DES:=
长宁区；TSSL:= 126148659111261488899。 -->
              <div slot="reference">
                <el-tag size="medium">详细信息</el-tag>
              </div>
            </el-popover>
          </template>
          <template v-if="scope.row.DATA_TYPE.toString(16) == '9301'">
            <el-popover trigger="hover" placement="top">
              <p>平台查岗请求</p>
              <el-button>平台查岗应答 0x1301</el-button>
              <div slot="reference">
                <el-tag size="medium">详细信息</el-tag>
              </div>
            </el-popover>
          </template>

          <template v-if="scope.row.DATA_TYPE.toString(16) == '9302'">
            <el-popover trigger="hover" placement="top">
              <p>平台间报文</p>
              <div slot="reference">
                <el-tag size="medium">详细信息</el-tag>
              </div>
            </el-popover>
          </template>

          <template v-if="scope.row.DATA_TYPE.toString(16) == '9401'">
            <el-popover trigger="hover" placement="top">
              <p>报警督办请求</p>
              <div slot="reference">
                <el-tag size="medium">详细信息</el-tag>
              </div>
            </el-popover>
          </template>
          <template v-if="scope.row.DATA_TYPE.toString(16) == '9402'">
            <el-popover trigger="hover" placement="top">
              <p>报警预警</p>
              <div slot="reference">
                <el-tag size="medium">详细信息</el-tag>
              </div>
            </el-popover>
          </template>
          <template v-if="scope.row.DATA_TYPE.toString(16) == '9403'">
            <el-popover trigger="hover" placement="top">
              <p>实时交换报警信息</p>
              <p>报警信息来源: {{ {"1":"车载终端","2":"企业监控平台","3":"政府监管平台","9":"其他"}[scope.row.WARN_SRC] }}</p>
              <p>报警类型: {{ getWARN_TYPE(scope.row.WARN_TYPE) }}</p>
              <p>报警时间: {{ scope.row.WARN_TIME }}</p>
              <p>报警描述: {{ scope.row.WARN_CONTENT }}</p>
              <div slot="reference">
                <el-tag size="medium">详细信息</el-tag>
              </div>
            </el-popover>
          </template>
          <template v-if="scope.row.DATA_TYPE.toString(16) == '9601'">
            <el-popover trigger="hover" placement="top">
              <p>补报车辆静态信息</p>
              <el-botton>补报车辆静态信息应答 0x1601</el-botton>
              <div slot="reference">
                <el-tag size="medium">详细信息</el-tag>
              </div>
            </el-popover>
          </template>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
export default {
  data() {
    return {
      answer: "",
      showBody: false
    };
  },
  computed: {
    list: function() {
      return this.$store.getters["x809In/list"];
    }
  },
  created() {},
  methods: {
    getType(row) {
      var dict = {
        x9200: "从链路动态信息交换消息",
        x9300: "从链路平台间信息交互消息",
        x9400: "从链路报警信息交互消息"
      };
      return dict[row.MSG_ID] || "--";
    },
    getWARN_TYPE(key) {
      return [
        "",
        "超速报警",
        "疲劳驾驶报警",
        "紧急报警",
        "进入指定区域报警",
        "离开指定区域报警",
        "路段赌赛报警",
        "危险路段报警",
        "越界报警",
        "盗警",
        "劫警",
        "偏离路线报警",
        "车辆移动报警",
        "超时驾驶报警",
        "其他报警"
      ][key];
    },
    send() {},
    remove(row) {
      this.$store.commit("x809In/remove", row.id);
    }
  }
};
</script>
