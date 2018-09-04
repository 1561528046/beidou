export const dict = {
  //全局字典
  BASE_URL: "http://192.168.88.100:725/",
  API_URL: "http://192.168.88.100:725/api",
  // BASE_URL: "http://192.168.88.88:10462/",
  // API_URL: "http://192.168.88.88:10462/api",
  license_color: {
    "1": {
      backgroundColor: "#ffbf00",
      borderColor: "#efb404",
      name: "黄色",
      style: "background:#ffbf00;border:1px solid #ffa500;color:#000;"
    },
    "2": {
      backgroundColor: "#006DD9",
      borderColor: "#0b64bd",
      name: "蓝色",
      style: "background:#006DD9;border:1px solid #0b64bd;color:#FFF;"
    },
    "3": {
      backgroundColor: "#fff",
      borderColor: "#fff",
      name: "白色",
      style: "background:#fff;border:1px solid #fff;color:#000; "
    },
    "4": {
      backgroundColor: "#000",
      borderColor: "#000",
      name: "黑色",
      style: "background:#000;border:1px solid #000;color:#FFF; "
    },
    "5": {
      name: "其它"
    }
  },
  get_license_color: function(key) {
    return "(" + this.license_color[key].name + ")" || {};
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
    "1": "开通前装车待审核",
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
    "3": "长途客运、班线车辆",
    "4": "出租车",
    "5": "私家车",
    "6": "校车",
    "7": "城市公共交通车辆",
    "8": "网约车",
    "9": "警务车辆",
    "10": "其他车辆"
  },
  get_vehicle_type: function(key) {
    return this.vehicle_type[key] || "--";
  },
  vtype: {
    "22": "中型普通货车",
    "23": "重型载货专项作业车",
    "24": "中型非载货专项作业车",
    "25": "重型仓栅式半挂车",
    "26": "大型载货专项作业车",
    "27": "重型厢式半挂车",
    "28": "重型平板半挂车",
    "29": "重型罐式自卸货车",
    "101": "普通货车",
    "102": "罐车",
    "103": "牵引车",
    "104": "集装箱车",
    "105": "半挂车",
    "106": "自卸车",
    "108": "大型货车",
    "109": "厢式货车",
    "110": "低速载货汽车",
    "111": "专用运输车",
    "112": "重型厢式货车",
    "113": "重型罐式货车",
    "114": "重型货车",
    "115": "爆破器材运输车",
    "116": "中型自卸货车",
    "117": "重型专项作业车",
    "118": "重型特殊结构货车",
    "119": "大型专项作业车",
    "120": "仓栅式货车",
    "121": "平头柴油载货汽车",
    "122": "洒布车",
    "123": "粉粒物料运输车",
    "124": "重型半挂牵引车",
    "125": "重型平板货车",
    "126": "重型普通货车",
    "127": "封闭厢式",
    "128": "非封闭厢式",
    "129": "非厢式",
    "130": "载货汽车",
    "131": "农用车",
    "132": "整车",
    "133": "挂车",
    "134": "重型自卸货车",
    "135": "重型仓栅式货车",
    "136": "仓栅式运输车",
    "137": "混凝土搅拌运输车",
    "138": "中型半挂牵引车",
    "139": "重型封闭货车",
    "140": "中型特殊结构货车",
    "142": "重型集装箱车",
    "143": "中型仓栅式货车",
    "144": "重型非载货专项作业车",
    "145": "中型专项作业车",
    "146": "中型厢式货车",
    "148": "轻型仓栅式货车",
    "149": "中型罐式货车",
    "152": "重型普通半挂车",
    "153": "平头柴油自卸货车",
    "154": "重型集装箱半挂车",
    "155": "重型平板自卸货车",
    "156": "大型非载货专项作业车",
    "157": "轻型自卸货车",
    "158": "重型罐式半挂车",
    "159": "轻型厢式货车",
    "160": "中型载货专项作业车",
    "161": "轻型普通货车",
    "162": "轻型非载货专项作业车",
    "163": "轻型特殊结构货车",
    "164": "重型车辆运输车",
    "165": "重型特殊结构自卸货车"
  },
  get_vtype: function(key) {
    return this.vtype[key] || "--";
  }
};
import utils from "@/utils/utils";
export { utils };
