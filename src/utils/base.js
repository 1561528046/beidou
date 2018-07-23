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
    console.log(this.device_type[key]);
    if (typeof key == "object") {
      return this.device_type[key.device_type] || {};
    }
    return this.device_type[key] || {};
  }
};
