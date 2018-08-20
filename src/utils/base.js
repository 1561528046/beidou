export const dict = {
  //全局字典
  license_color: {
    "1": {
      backgroundColor: "#005aff",
      borderColor: "#005aff",
      name: "蓝色",
      style: "background:#005aff;border:1px solid #005aff;"
    },
    "2": {
      backgroundColor: "#FFBF00",
      borderColor: "#ffa500",
      name: "黄色",
      style: "background:#FFBF00;border:1px solid #ffa500;"
    },
    "3": {
      backgroundColor: "#18ce65",
      borderColor: "#000",
      name: "绿色",
      style: "background:#18ce65;border:1px solid #000;"
    }
  },
  get_license_color: function(key) {
    return this.license_color[key] || {};
  },
  flue_type: {
    "1": "柴油",
    "2": "汽油",
    "3": "电",
    "4": "乙醇",
    "5": "液化天然气(LNG)",
    "6": "压缩天然气(CNG)"
  },
  get_flue_type: function(key) {
    return this.flue_type[key] || {};
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
  get_company_type: function(key) {
    return this.company_type[key] || "--";
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
