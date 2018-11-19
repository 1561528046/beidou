<template>
  <div>
    <el-table :data="list" size="mini">
      <el-table-column prop="VEHICLE_NO" label="车牌号"></el-table-column>
      <el-table-column prop="VEHICLE_COLOR" label="车牌颜色"></el-table-column>
      <el-table-column prop="MSG_SN" label="报文序列号"></el-table-column>
      <el-table-column label="类型" :formatter="getType"></el-table-column>
      <el-table-column label="子业务类型" :formatter="getSubType"></el-table-column>
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
              <el-table :data="scope.row.GNSS_DATAS">
                <el-table-column min-width="150" prop="EXCRYPT" label="地图是否加密"> </el-table-column>
                <el-table-column min-width="150" prop="DATE" label="时间"> </el-table-column>
                <el-table-column width="150" prop="LON" label="经度"> </el-table-column>
                <el-table-column width="150" prop="LAT" label="纬度"> </el-table-column>
                <el-table-column prop="VEC1" label="速度"> </el-table-column>
                <el-table-column width="150" prop="VEC2" label="行驶记录速度"> </el-table-column>
                <el-table-column width="150" prop="VEC3" label="总里程"> </el-table-column>
                <el-table-column prop="DIRECTION" label="方向"> </el-table-column>
                <el-table-column prop="ALTITUDE" label="海拔"> </el-table-column>
                <el-table-column prop="STATE" label="状态"> </el-table-column>
                <el-table-column prop="ALARM" label="报警状态"> </el-table-column>
              </el-table>
              <div slot="reference">
                <el-tag size="medium">详细信息</el-tag>
              </div>
            </el-popover>
          </template>

          <template v-if="scope.row.DATA_TYPE.toString(16) == '9204'">
            <el-popover trigger="hover" placement="top">
              <p>交换车辆静态信息</p>
              <p v-if="scope.row.CAR_INFO.VIN">
                车牌号:{{scope.row.CAR_INFO.VIN}}
              </p>
              <p v-if="scope.row.CAR_INFO.TRANS_TYPE">
                运输行业编码:{{scope.row.CAR_INFO.TRANS_TYPE}}
              </p>
              <p v-if="scope.row.CAR_INFO.TRACTION">
                牵引总质量:{{scope.row.CAR_INFO.TRACTION}}
              </p>
              <p v-if="scope.row.CAR_INFO.TRAILER_VIN">
                挂车车牌号:{{scope.row.CAR_INFO.TRAILER_VIN}}
              </p>
              <p v-if="scope.row.CAR_INFO.VEHICLE_NATIONALITY">
                车籍地:{{scope.row.CAR_INFO.VEHICLE_NATIONALITY}}
              </p>
              <p v-if="scope.row.CAR_INFO.VEHICLE_TYPE">
                车辆类型:{{scope.row.CAR_INFO.VEHICLE_TYPE}}
              </p>
              <p v-if="scope.row.CAR_INFO.RTPN">
                道路运输证号:{{scope.row.CAR_INFO.RTPN}}
              </p>
              <p v-if="scope.row.CAR_INFO.OWERS_NAME">
                业户名称:{{scope.row.CAR_INFO.OWERS_NAME}}
              </p>
              <p v-if="scope.row.CAR_INFO.OWERS_ORIG_ID">
                业户原 ID:{{scope.row.CAR_INFO.OWERS_ORIG_ID}}
              </p>
              <p v-if="scope.row.CAR_INFO.WOERS_TEL">
                业户联系电话:{{scope.row.CAR_INFO.WOERS_TEL}}
              </p>
              <p v-if="scope.row.CAR_INFO.RTOLN">
                经营许可证号:{{scope.row.CAR_INFO.RTOLN}}
              </p>
              <p v-if="scope.row.CAR_INFO.VEHICLE_MODE">
                车辆厂牌型号:{{scope.row.CAR_INFO.VEHICLE_MODE}}
              </p>
              <p v-if="scope.row.CAR_INFO.VEHICLE_COLOR">
                车辆颜色:{{scope.row.CAR_INFO.VEHICLE_COLOR}}
              </p>
              <p v-if="scope.row.CAR_INFO.VEHICLE_ORIG_ID">
                车辆原编号:{{scope.row.CAR_INFO.VEHICLE_ORIG_ID}}
              </p>
              <p v-if="scope.row.CAR_INFO.DRIVER_INFO">
                驾驶员情况:{{scope.row.CAR_INFO.DRIVER_INFO}}
              </p>
              <p v-if="scope.row.CAR_INFO.GUARDS_INFO">
                押运员情况:{{scope.row.CAR_INFO.GUARDS_INFO}}
              </p>
              <p v-if="scope.row.CAR_INFO.APPROVED_TONNAGE">
                核定吨位:{{scope.row.CAR_INFO.APPROVED_TONNAGE}}
              </p>
              <p v-if="scope.row.CAR_INFO.DRIVER_INFO">
                危险品货物分类:{{scope.row.CAR_INFO.DG_TYPE}}
              </p>
              <p v-if="scope.row.CAR_INFO.CARGO_NAME">
                货物品名:{{scope.row.CAR_INFO.CARGO_NAME}}
              </p>
              <p v-if="scope.row.CAR_INFO.CARGO_TONNAGE">
                货物吨位:{{scope.row.CAR_INFO.CARGO_TONNAGE}}
              </p>
              <p v-if="scope.row.CAR_INFO.TRANSPORT_ORIGIN">
                运输出发地:{{scope.row.CAR_INFO.TRANSPORT_ORIGIN}}
              </p>
              <p v-if="scope.row.CAR_INFO.TRANSPORT_DES">
                运输目的地:{{scope.row.CAR_INFO.TRANSPORT_DES}}
              </p>
              <p v-if="scope.row.CAR_INFO.TSSL">
                运输起止时间:{{scope.row.CAR_INFO.TSSL}}
              </p>
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
        "9200": "从链路动态信息交换消息",
        "9300": "从链路平台间信息交互消息",
        "9400": "从链路报警信息交互消息"
      };
      return dict[row.MessageID] || "--";
    },
    getSubType(row) {
      var key = Number(row.DATA_TYPE)
        .toString(16)
        .toUpperCase();
      var dict = {
        "9202": "交换车辆定位信息",
        "9203": "车辆定位信息交换补发",
        "9204": "交换车辆静态信息",
        "9205": "启动车辆定位信息交换请求",
        "9206": "结束车辆定位信息交换请求",
        "9207": "申请交换指定车辆定位信息应答",
        "9208": "取消交换指定车辆定位信息应答",
        "9209": "补发车辆定位信息应答",
        "920A": "上报车辆驾驶员身份信息请求",
        "920B": "上报车辆电子运单请求",
        "9301": "平台查岗请求",
        "9302": "下发平台间报文请求",
        "9401": "报警督办请求",
        "9402": "报警预警",
        "9403": "实时交换报警信息",
        "9501": "车辆单向监听请求",
        "9502": "车辆拍照请求",
        "9503": "下发车辆报文请求",
        "9504": "上报车辆行驶记录请求",
        "9505": "车辆应急接入监管平台请求",
        "9601": "补报车辆静态信息请求"
      };
      return dict[key] || "--";
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
