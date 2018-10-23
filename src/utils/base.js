var BASE_URL = "http://192.168.88.100:725/";
var API_URL = "http://192.168.88.100:725/api";
var MONITOR_URL = "ws://192.168.88.88:5002";
// var BASE_URL = "http://192.168.88.88:10462/";
// var API_URL = "http://192.168.88.88:10462/api";
var INSTRUCTION_URL = "ws://192.168.88.88:5000";
if (process.env.NODE_ENV == "production") {
  BASE_URL = "http://192.168.88.6:827/";
  API_URL = "http://192.168.88.6:827/api";
  INSTRUCTION_URL = "ws://192.168.88.88:5000";
  MONITOR_URL = "ws://192.168.88.88:5002";
}
export const dict = {
  //全局字典
  AMAP_KEY: "1effb3317ab25b91eb7b163d5febd226", //高德 key
  BMAP_KEY: "E6CTjsauEoavEzCYG4WM1zt0S5OB6dAf", //百度key
  BASE_URL: BASE_URL, //web站点路径
  API_URL: API_URL, //API具体路径
  MONITOR_URL: MONITOR_URL, //监控端websocket地址
  INSTRUCTION_URL: INSTRUCTION_URL, //指令websocket地址
  ONLINE_TIMEOUT: "30000000", //300000 = 5分钟上线超时时间（当前系统时间-定为时间 < 5分钟  即为上线）
  license_color: {
    "1": {
      backgroundColor: "#006DD9",
      borderColor: "#0b64bd",
      name: "蓝色",
      style: "background:#006DD9;border:1px solid #0b64bd;color:#FFF;"
    },
    "2": {
      backgroundColor: "#ffbf00",
      borderColor: "#efb404",
      name: "黄色",
      style: "background:#ffbf00;border:1px solid #ffa500;color:#000;"
    },

    // "3": {
    //   backgroundColor: "#fff",
    //   borderColor: "#fff",
    //   name: "白色",
    //   style: "background:#fff;border:1px solid #fff;color:#000; "
    // },
    // "4": {
    //   backgroundColor: "#000",
    //   borderColor: "#000",
    //   name: "黑色",
    //   style: "background:#000;border:1px solid #000;color:#FFF; "
    // },
    "5": {
      backgroundColor: "#79bb0f",
      borderColor: "#669e0b",
      name: "黄绿色",
      style: "background:#79bb0f;border:1px solid #669e0b;color:#000;"
    },
    "6": {
      backgroundColor: "#79bb0f",
      borderColor: "#669e0b",
      name: " 渐变绿",
      style: "background:#79bb0f;border:1px solid #669e0b;color:#000;"
    }
  },
  alarm: {
    "1": "紧急报警",
    "2": "超速报警",
    "4": "疲劳驾驶",
    "8": "危险预警",
    "16": "GNSS 模块发生故障",
    "32": "GNSS 天线未接或被剪断",
    "64": "GNSS 天线短路",
    "128": "终端主电源欠压",
    "256": "终端主电源掉电",
    "512": "终端 LCD 或显示器故障",
    "1024": "TTS 模块故障",
    "2048": "摄像头故障",
    "4096": "IC 卡模块故障",
    "8192": "超速预警",
    "16384": "疲劳驾驶预警",
    "262144": "当天累计驾驶超时",
    "524288": "超时停车",
    "1048576": "进出区域",
    "2097152": "进出路线",
    "4194304": "路段行驶时间不足/过长",
    "8388608": "路线偏离报警",
    "16777216": "车辆 VSS 故障",
    "33554432": "车辆油量异常",
    "67108864": "车辆被盗",
    "134217728": "车辆非法点火",
    "268435456": "车辆非法位移",
    "536870912": "碰撞预警",
    "1073741824": "侧翻预警",
    "2147483648": "非法开门报警"
  },
  getAlarm: function(num) {
    var str = [];
    for (var key in this.alarm) {
      if ((num & key) == key) {
        str.push(this.alarm[key]);
      }
    }
    return str.join(",");
  },
  get_license_color: function(key) {
    return this.license_color[key] || {};
  },
  fuel_type: {
    "1": "柴油",
    "2": "汽油",
    "3": "电",
    "4": "乙醇",
    "5": "液化天然气(LNG)",
    "6": "压缩天然气(CNG)"
  },
  get_fuel_type: function(key) {
    return this.fuel_type[key] || {};
  },
  device_type: {
    "1": "定位终端",
    "2": "视频终端"
  },
  get_device_type: function(key) {
    return this.device_type[key] || "--";
  },
  protocol_type: {
    "1": "808部标协议",
    "2": "1078部标协议"
  },
  get_protocol_type: function(key) {
    return this.protocol_type[key] || "--";
  },
  device_state: {
    "1": "未安装",
    "2": "已安装",
    "3": "维修中",
    "4": "报废"
  },
  get_device_state: function(key) {
    return this.device_state[key] || "--";
  },
  save_media: {
    "1": "硬盘",
    "2": "sd卡"
  },
  get_save_media: function(key) {
    return this.save_media[key] || "--";
  },
  repair_state: {
    "1": "安装",
    "2": "解绑",
    "3": "维修",
    "4": "修复",
    "5": "报废"
  },
  get_repair_state: function(key) {
    return this.repair_state[key] || "--";
  },
  company_type: {
    "1": "前装厂商",
    "2": "后装厂商"
  },
  vehiclerepair_state: {
    "1": "未处理",
    "2": "已修复",
    "3": "已更换"
  },
  get_vehiclerepair_state: function(key) {
    return this.vehiclerepair_state[key] || "--";
  },
  get_company_type: function(key) {
    return this.company_type[key] || "--";
  },
  fence_type: {
    "1048576": "进出区域 ",
    "2097152": "进出路线",
    "4194304": "路段行驶时间不足/过长",
    "8388608": "路线偏离"
  },
  get_fence_type: function(key) {
    return this.fence_type[key] || "--";
  },
  alarm_type: {
    "1": "紧急报警",
    "2": "超速报警",
    "4": "疲劳驾驶",
    "8": "危险预警",
    "8192": "超速预警",
    "16384": "疲劳驾驶预警",
    "262144": "当天累计驾驶超时",
    "524288": "超时停车",
    "1048576": "进出区域",
    "2097152": "进出路线",
    "4194304": "路段行驶时间不足/过长",
    "8388608": "路线偏离报警",
    "33554432": "车辆油量异常",
    "67108864": "车辆被盗(通过车辆防盗器)",
    "134217728": "车辆非法点火",
    "268435456": "车辆非法位移",
    "536870912": "碰撞预警",
    "1073741824": "侧翻预警",
    "2147483648": "非法开门报警"
  },
  fault_type: {
    "16": "GNSS 模块发生故障",
    "32": "GNSS 天线未接或被剪断",
    "64": "GNSS 天线短路",
    "128": "终端主电源欠压",
    "256": "终端主电源掉电",
    "512": "终端 LCD 或显示器故障",
    "1024": "TTS 模块故障",
    "2048": "摄像头故障",
    "4096": "道路运输证 IC 卡模块故障",
    "16777216": "车辆 VSS 故障"
  },
  get_fault_type: function(key) {
    return this.fault_type[key] || "--";
  },
  vehiclefault_type: {
    "1": "设备故障"
  },
  get_vehiclefault_type: function(key) {
    return this.vehiclefault_type[key] || "--";
  },
  get_alarm_type: function(key) {
    return this.alarm_type[key] || "--";
  },
  //所属行业(单纯记录 非必填):普货，长途，出租，校车，公交车等等
  industry: {
    "1": "物流运输（普货）",
    "2": "危险品车辆",
    "3": "长途客运、班线车辆",
    "4": "出租车",
    "5": "私家车",
    "6": "校车",
    "7": "城市公共交通车辆",
    "8": "网约车",
    "9": "警务车辆",
    "10": "其他车辆"
  },
  get_industry: function(key) {
    return this.industry[key] || "--";
  },
  sim_state: {
    "1": "已使用",
    "2": "未使用"
  },
  get_sim_state: function(key) {
    return this.sim_state[key] || "未使用";
  },
  order_paytype: {
    "1": "计费",
    "2": "扣费"
  },
  get_order_paytype: function(key) {
    return this.order_paytype[key] || "--";
  },
  order_state: {
    "1": "前装车待审核",
    "2": "正常",
    "3": "拒绝开通前装车",
    "4": "取消订单审核通过",
    "5": "取消订单审核",
    "6": "取消订单审核未通过"
  },
  get_order_state: function(key) {
    return this.order_state[key] || "--";
  },
  order_detailtype: {
    "1": "授权车辆",
    "2": "授权厂商",
    "3": "短信",
    "4": "SIM卡"
  },
  get_order_detailtype: function(key) {
    return this.order_detailtype[key] || "--";
  },
  //所属行业(单纯记录 非必填):普货，长途，出租，校车，公交车等等
  vehicle_type: {
    "1": "物流运输（普货）",
    "2": "危险品车辆",
    "3": "长途客运、班线车辆"
    // "4": "出租车",
    // "5": "私家车",
    // "6": "校车",
    // "7": "城市公共交通车辆",
    // "8": "网约车",
    // "9": "警务车辆",
    // "10": "其他车辆"
  },
  get_vehicle_type: function(key) {
    return this.vehicle_type[key] || "--";
  },
  vtype: {
    t105: "半挂车",
    t115: "爆破器材运输车",
    t120: "仓栅式货车",
    t136: "仓栅式运输车",
    t156: "大型非载货专项作业车",
    t108: "大型货车",
    t26: "大型载货专项作业车",
    t119: "大型专项作业车",
    t110: "低速载货汽车",
    t128: "非封闭厢式",
    t129: "非厢式",
    t123: "粉粒物料运输车",
    t127: "封闭厢式",
    t133: "挂车",
    t102: "罐车",
    t137: "混凝土搅拌运输车",
    t104: "集装箱车",
    t131: "农用车",
    t121: "平头柴油载货汽车",
    t153: "平头柴油自卸货车",
    t101: "普通货车",
    t103: "牵引车",
    t148: "轻型仓栅式货车",
    t162: "轻型非载货专项作业车",
    t161: "轻型普通货车",
    t163: "轻型特殊结构货车",
    t159: "轻型厢式货车",
    t157: "轻型自卸货车",
    t122: "洒布车",
    t109: "厢式货车",
    t130: "载货汽车",
    t132: "整车",
    t138: "中型半挂牵引车",
    t143: "中型仓栅式货车",
    t24: "中型非载货专项作业车",
    t149: "中型罐式货车",
    t22: "中型普通货车",
    t140: "中型特殊结构货车",
    t146: "中型厢式货车",
    t160: "中型载货专项作业车",
    t145: "中型专项作业车",
    t116: "中型自卸货车",
    t124: "重型半挂牵引车",
    t25: "重型仓栅式半挂车",
    t135: "重型仓栅式货车",
    t164: "重型车辆运输车",
    t144: "重型非载货专项作业车",
    t139: "重型封闭货车",
    t158: "重型罐式半挂车",
    t113: "重型罐式货车",
    t29: "重型罐式自卸货车",
    t114: "重型货车",
    t154: "重型集装箱半挂车",
    t142: "重型集装箱车",
    t28: "重型平板半挂车",
    t125: "重型平板货车",
    t155: "重型平板自卸货车",
    t152: "重型普通半挂车",
    t126: "重型普通货车",
    t118: "重型特殊结构货车",
    t165: "重型特殊结构自卸货车",
    t27: "重型厢式半挂车",
    t112: "重型厢式货车",
    t23: "重型载货专项作业车",
    t117: "重型专项作业车",
    t134: "重型自卸货车",
    t111: "专用运输车",
    t106: "自卸车"
  },
  get_vtype: function(key) {
    // key = key.slice(1);
    return this.vtype[key] || "--";
  },
  communication: {
    Ox0001: "终端心跳发送间隔",
    Ox0002: "TCP消息应答超时时间",
    Ox0003: "TCP消息重传次数",
    Ox0004: "UDP消息应答超时时间",
    Ox0005: "UDP消息重传次数",
    Ox0006: "SMS消息应答超时时间",
    Ox0007: "SMS消息重传次数",
    Ox0010: "主服务器APN",
    Ox0013: "主服务器地址IP或域名",
    Ox0014: "备份服务器APN",
    Ox0017: "备份服务器地址IP或域名",
    Ox0018: "服务器TCP端口",
    Ox0019: "服务器UDP端口",
    Ox0020: "位置汇报策略",
    Ox0021: "位置汇报方案",
    Ox0022: "驾驶员未登录汇报时间间隔",
    Ox0027: "休眠时汇报时间间隔",
    Ox0028: "紧急报警时汇报时间间隔",
    Ox0029: "缺省时间汇报时间间隔",
    Ox002c: "缺省距离汇报距离间隔",
    Ox002d: "驾驶员未登录汇报距离间隔",
    Ox002e: "休眠时汇报距离间隔",
    Ox002f: "紧急报警时汇报距离间隔",
    Ox0040: "监控平台电话号码",
    Ox0041: "复位电话号码",
    Ox0043: "监控平台SMS电话号码",
    Ox0044: "接收终端SMS文本报警号码",
    Ox0045: "终端电话接听策略",
    Ox0046: "每次最长通话时间",
    Ox0048: "监听电话号码",
    Ox0049: "监管平台特权短信号码",
    Ox0050: "报警屏蔽字",
    Ox0051: "报警发送文本SMS开关",
    Ox0052: "报警拍摄开关",
    Ox0053: "报警拍摄存储标志",
    Ox0054: "关键标志",
    Ox0055: "最高速度",
    Ox0056: "超速持续时间",
    Ox0057: "连续驾驶时间门限",
    Ox0058: "当天累计驾驶时间门限",
    Ox0059: "最小休息时间",
    Ox005a: "最长停车时间",
    Ox005b: "超速报警预警差值",
    Ox005c: "疲劳驾驶预警差值",
    Ox005d: "碰撞报警参数设置",
    Ox005e: "侧翻报警参数设置",
    Ox0064: "定时拍照控制",
    Ox0065: "定距拍照控制",
    Ox0070: "图像/视频质量",
    Ox0071: "亮度",
    Ox0072: "对比度",
    Ox0073: "饱和度",
    Ox0074: "色度",
    Ox0081: "车辆所在的省域ID",
    Ox0082: "车辆所在的市域ID",
    Ox0083: "机动车号牌",
    Ox0084: "车牌颜色"
  },
  get_communication: function(key) {
    return this.communication[key] || "";
  },
  special: {
    "1": "雷雨天气",
    "2": "路面潮湿",
    "3": "雾天",
    "4": "山体滑坡",
    "5": "台风",
    "6": "地震",
    "7": "隧道冒顶",
    "8": "洪水",
    "9": "风沙",
    "10": "泥石流"
  },
  get_special: function(key) {
    return this.special[key] || "";
  }
};
import utils from "@/utils/utils";
export { utils };
