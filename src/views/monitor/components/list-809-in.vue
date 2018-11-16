<template>
  <div>
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
          <!-- <template v-if="scope.row.DATA_TYPE.toString(16) == '9301'">
            <el-popover trigger="hover" placement="top">
              <p>平台查岗请求</p>
              <el-button>平台查岗应答 0x1301</el-button>
              <div slot="reference">
                <el-tag size="medium">详细信息</el-tag>
              </div>
            </el-popover>
          </template> -->

          <template v-if="scope.row.DATA_TYPE.toString(16) == '9302'">
            <el-popover trigger="hover" placement="top">
              <p>平台间报文</p>
              <p>下发报文对象类型 {{getOBJECT_TYPE(scope.row.OBJECT_TYPE)}} </p>
              <p>下发报文对象 {{scope.row.OBJECT_ID}} </p>
              <p>信息内容 {{scope.row.INFO_CONTENT}} </p>
              <div slot="reference">
                <el-tag size="medium">详细信息</el-tag>
              </div>
            </el-popover>
          </template>

          <template v-if="scope.row.DATA_TYPE.toString(16) == '9401'">
            <el-popover trigger="hover" placement="top">
              <p>报警督办请求</p>
              <p>报警信息来源 {{getWARN_SRC(scope.row.WARN_SRC)}} </p>
              <p>报警信息来源 {{getWARN_TYPE(scope.row.WARN_TYPE)}} </p>
              <p>报警时间 {{scope.row.WARN_TIME}}</p>
              <p>报警督办ID {{scope.row.SUPERVISION_ID}}</p>
              <p>督办截止时间 {{scope.row.SUPERVISION_ENDTIME}}</p>
              <p>督办级别 {{["紧急","一般"][scope.row.SUPERVISION_LEVEL]}}</p>
              <p>督办人 {{scope.row.SUPERVISOR}}</p>
              <p>督办联系电话 {{scope.row.SUPERVISION_TEL}}</p>
              <p>督办联系电子邮件 {{scope.row.SUPERVISION_EMAL}}</p>
              <div slot="reference">
                <el-tag size="medium">详细信息</el-tag>
              </div>
            </el-popover>
          </template>
          <template v-if="scope.row.DATA_TYPE.toString(16) == '9402'">
            <el-popover trigger="hover" placement="top">
              <p>报警预警</p>
              <p>报警信息来源 {{getWARN_SRC(scope.row.WARN_SRC)}} </p>
              <p>报警信息来源 {{getWARN_TYPE(scope.row.WARN_TYPE)}} </p>
              <p>报警时间 {{scope.row.WARN_TIME}}</p>
              <p>报警描述 {{scope.row.WARN_CONTENT}}</p>
              <div slot="reference">
                <el-tag size="medium">详细信息</el-tag>
              </div>
            </el-popover>
          </template>
          <template v-if="scope.row.DATA_TYPE.toString(16) == '9403'">
            <el-popover trigger="hover" placement="top">
              <p>实时交换报警信息</p>
              <p>报警信息来源 {{getWARN_SRC(scope.row.WARN_SRC)}} </p>
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
      return this.$store.getters["x809In/list"].filter(item => {
        return item.DATA_TYPE != 0x9301;
      });
    }
  },
  created() {},
  methods: {
    getWARN_SRC(key) {
      return ["", "车载终端 ", "企业监控平台 ", "政府监管平台 ", "其他"][key];
    },
    getOBJECT_TYPE(key) {
      return [
        "",
        "下级平台所属单一平台 ",
        "当前连接的下级平台 ",
        "下级平台所属单一业户 ",
        "下级平台所属所有业户",
        "下级平台所属所有平台",
        "下级平台所属所有平台和业户",
        "下级平台所属所有政府监管平台（含监控端）",
        "下级平台所属所有企业监控平台",
        "下级平台所属所有经营性企业监控平台",
        "下级平台所属所有非经营性企业监控平台"
      ][key];
    },
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
