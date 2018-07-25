export const dict = {
  //全局字典
  plate_color: {
    "1": {
      backgroundColor: "#FFBF00",
      borderColor: "#ffa500",
      name: "黄色",
      style: "background:#FFBF00;border:1px solid #ffa500;"
    },
    "2": {
      backgroundColor: "#005aff",
      borderColor: "#005aff",
      name: "蓝色",
      style: "background:#005aff;border:1px solid #005aff;"
    },
    "3": {
      backgroundColor: "#18ce65",
      borderColor: "#000",
      name: "绿色",
      style: "background:#18ce65;border:1px solid #000;"
    }
  },
  get_plate_color: function(key) {
    return this.plate_color[key] || {};
  },
  fule_type: {
    "1": { name: "柴油" },
    "2": { name: "汽油" },
    "3": { name: "电" },
    "4": { name: "乙醇" },
    "5": { name: "液化天然气(LNG)" },
    "6": { name: "压缩天然气(CNG)" }
  },
  get_fule_type: function(key) {
    return this.fule_type[key] || {};
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
  state: {
    "1": "正常",
    "2": "删除"
  },
  get_state: function(key) {
    return this.state[key] || "--";
  },
  save_media: {
    "1": "硬盘",
    "2": "sd卡"
  },
  get_save_media: function(key) {
    return this.save_media[key] || "--";
  },
  repair_state: {
    "1": "维修",
    "2": "已修复",
    "3": "报废",
    "4": "更换"
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
  }
};
