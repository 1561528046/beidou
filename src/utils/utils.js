import moment from "moment";
import XLSX from "xlsx";
export default {
  /**
   *
   * @param {Array} area
   */
  formatArea(area) {
    var result = {
      province_id: area[0] || "",
      city_id: area[1] || "",
      county_id: area[2] || ""
    };
    return result;
  },
  baseFormatter(row, column, cellValue) {
    return cellValue || "--";
  },
  baseForm(value) {
    if (value) {
      return value;
    } else {
      return "--";
    }
  },
  /**
   *
   * @param {String} date 20170808 20170808010101
   * @param {String} separator 分隔符 如 / 结果为 2017/08/08
   * @returns {String}
   *  20170808 = 2017-08-08
   *  20170808010101 = 2017-08-08 01:01:01
   * 除监控外，其他时间不包括时分秒，监控方法另外重写！
   */
  DateTime(date) {
    var day = parseInt(date / 86400000); //天
    var time = date % 86400000; //余数
    var datetime = moment.duration(time, "milliseconds");
    var hours = datetime.get("hours");
    var minutes = datetime.get("minutes");
    var seconds = datetime.get("seconds");
    day = day == "0" ? "" : day + "天";
    hours = hours == "0" ? "" : hours + "小时";
    minutes = minutes == "0" ? "" : minutes + "分钟";
    seconds = seconds == "0" ? "" : seconds + "秒";
    // 00天00小时00分钟30秒
    return day + hours + minutes + seconds;
  },
  formatDate(date, separator = "-") {
    date = date.toString();
    if (!date || date == 0) {
      return "--";
    }
    if (date.length == 8 || date.length == 14) {
      return (
        date.substring(0, 4) +
        separator +
        date.substring(4, 6) +
        separator +
        date.substring(6, 8)
      );
    }
    // if (date.length == 14) {
    //   return (
    //     date.substring(0, 4) +
    //     separator +
    //     date.substring(4, 6) +
    //     separator +
    //     date.substring(6, 8) +
    //     " " +
    //     date.substring(8, 10) +
    //     ":" +
    //     date.substring(10, 12) +
    //     ":" +
    //     date.substring(12, 14)
    //   );
    // }
    return date;
  },
  formatDateUtc(date) {
    var d = new Date(date);
    return (
      d.getFullYear() +
      "-" +
      (d.getMonth() + 1) +
      "-" +
      d.getDate() +
      " " +
      d.getHours() +
      ":" +
      d.getMinutes() +
      ":" +
      d.getSeconds()
    );
  },
  formatDate14(date, separator = "-") {
    date = date.toString();
    if (!date) {
      return "--";
    }
    if (date.length == 14) {
      var result =
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
        date.substring(12, 14);
      return result;
    }
    return date;
  },
  momentDate(date) {
    if (date == "0001-01-01T00:00:00+08:00") {
      return "--";
    }
    return moment(date).format("YYYY-MM-DD HH:mm:ss") || "--";
  },
  areaFormatter(row) {
    var area = [row.province_name, row.city_name, row.county_name];
    let result = area.map(item => {
      return item;
    });
    return result.join("-") || "--";
  },
  exportExcel({ data, sheetName, fileName }) {
    var ws = XLSX.utils.json_to_sheet(data, { skipHeader: true });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, fileName);
  },
  downloadFile(fileName, url) {
    var iframe = document.getElementById("downloadiframe");
    iframe = iframe ? iframe : document.createElement("iframe");
    iframe.id = "downloadiframe";
    iframe.src = url;
    iframe.addEventListener("load", function() {
      iframe.remove();
    });
    document.body.appendChild(iframe);
  },
  /**
   *
   *
   * @param {number} [stateCode] state值
   * @param {number} [position] 第几位
   */
  getState(stateCode, position) {
    if (stateCode == undefined || position == undefined) {
      return false;
    }
    var positionNum = Math.pow(2, position);
    return (stateCode & positionNum) == positionNum;
  },
  getStateLoad(stateCode) {
    stateCode = parseInt(stateCode) || 0;
    /*获取实载
    8-9位
    00：空车；01：半载；10：保留；11：满载
    （可用于客车的空、重车及货车的空载、满载状态表示，人工输入或传感器获取）
    */
    var num = parseInt(stateCode.toString(2).slice(8, 10), 2) || 0;
    return ["空车", "半载", "保留", "满载"][num];
  },
  getIOState(stateCode, position) {
    if (stateCode == undefined || position == undefined) {
      return false;
    }
    var positionNum = Math.pow(2, position);
    return (stateCode & positionNum) == positionNum;
  },
  getVehicleSignalState(stateCode, position) {
    if (stateCode == undefined || position == undefined) {
      return false;
    }
    var positionNum = Math.pow(2, position);
    return (stateCode & positionNum) == positionNum;
  }
};
