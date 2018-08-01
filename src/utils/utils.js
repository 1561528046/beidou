export default {
  /**
   *
   * @param {Array} area
   */
  formatArea(area) {
    var result = {
      province_id: area[0],
      city_id: area[1],
      county_id: area[2]
    };
    return result;
  },
  baseFormatter(row, column, cellValue) {
    return cellValue || "--";
  },
  /**
   *
   * @param {String} date 20170808 20170808010101
   * @param {String} separator 分隔符 如 / 结果为 2017/08/08
   * @returns {String}
   *  20170808 = 2017-08-08
   *  20170808010101 = 2017-08-08 01:01:01
   */
  formatDate(date, separator = "-") {
    if (!date) {
      return "--";
    }
    if (date.length == 8) {
      return (
        date.substring(0, 4) +
        separator +
        date.substring(4, 6) +
        separator +
        date.substring(6, 8)
      );
    }
    if (date.length == 14) {
      return (
        date.substring(0, 4) +
        separator +
        date.substring(4, 6) +
        separator +
        date.substring(6, 8) +
        " " +
        date.substring(8, 10) +
        ":" +
        date.substring(10, 12) +
        ":" +
        date.substring(12, 14)
      );
    }
    return date;
  }
};
