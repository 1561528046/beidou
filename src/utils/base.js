export const dict = {
  //全局字典
  /**
   * @param key 颜色ID
   */
  plate_color: function(key = "") {
    const dict = {
      "1": {
        backgroundColor: "#FFBF00",
        borderColor: "#ffa500",
        name: "黄色",
        style: "background:#FFBF00;border:1px solid #ffa500;"
      },
      "2": {
        backgroundColor: "",
        borderColor: "",
        name: "蓝色",
        style: "background:#08ad4e;border:1px solid #000;"
      },
      "3": {
        backgroundColor: "#08ad4e",
        borderColor: "#000",
        name: "绿色",
        style: "background:#08ad4e;border:1px solid #000;"
      }
    };
    return dict[key] || {};
  }
};
