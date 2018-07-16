/* eslint-disable */
var QuickDeal = function() {
  this.$vehicleNoId = $("#vehicleNoId");
  this.$plateColorId = $("#plateColorId");
  this.$vinCode = $("#vinCode");
  this.AllowExt = ".jpg,.jpeg,.JPG,.JPEG";
  this.needSameCityAreaCode = false;
  this.g_city = ""; //存储编辑车辆的市编码
  this.g_county = ""; //存储编辑车辆的县、区编码
  this.g_areaCode = "";
  this.repeatNum = 4; // 连续重复数字个数
  this.vehicleAuditStatus = ""; //车辆审核状态
  this.ismatchVBrandName = 2; //车辆品牌是否匹配，即录入的车辆品牌是否存在，0-不匹配，1-匹配,2-未到后台校验，用于编辑
  this.isCancelBut = false;
  this.isAutoComplete = false;
  this.CAR_OWNER_VERIFY_EXPIRETIME = 60; // REDIS中验证码超时时间（单位：秒）
  this.CAR_OWNER_VERIFY_FAIL_MAXNUM = 5; // 验证车主手机-验证错误次数阀值
  this.smsV = ""; //是否需要短信验证
  this.vehicleNoOld = "";
  this.vehicleOwnerPhoneOld = "";
  this.isTransEntSpecial = 0;
  //车辆类型：重型专项作业车(117),大型专项作业车(119),重型非载货专项作业车(144),中型专项作业车(145),中型非载货专项作业车(24)
  this.vehicleTypeLargeVehicle = ",117,119,144,145,24";
  this.vehicleProdName = "";
  this.vehicleProdCodeOld = "";
  this.smsVContent = "手机验证码为空，请填写！";
  this.timer = null; //弹出框定时器
  this.timeouttime = 540000; //9分钟超时9*60*1000
  this.isSaveImageTimeout = true;
  this.isAddCar = -1; //0: 加车，1：修改车
  this.removedPlateColorAry = ["1", "3", "4", "9"]; // 默认移除项-蓝色，3-黑色，4-白色，9-其它
  this.MSG_VEHICLE_NO_REPEAT =
    "您输入的车牌信息，存在不同颜色相同号码的情况，是否继续！";
  this.FirstPositionFlag = 0; // 是否已定位标志， 0未定位， 1(大于0)为已定位。
};
QuickDeal.prototype = {
  /** 验证车牌号*/
  validateVehicleNo: function(value) {
    var select_fule_type = $("#fule_type").val();
    var vehicleNo01, vehicleNo02, vehicleNo03;
    // 如果是电车，那么走新的判断，程超
    if (select_fule_type == "3") {
      vehicleNo01 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{7}$/;
      vehicleNo02 = /^[\u4e00-\u9fa5]{2}[A-Za-z0-9]{6}$/;
      vehicleNo03 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{6}[\u4e00-\u9fa5]{1}$/;
    } else {
      vehicleNo01 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{6}$/;
      vehicleNo02 = /^[\u4e00-\u9fa5]{2}[A-Za-z0-9]{5}$/;
      vehicleNo03 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{5}[\u4e00-\u9fa5]{1}$/;
    }
    var vehicleNo2 = /^[A-Za-z0-9]{8}$/;
    var vehicleNo3 = /^[A-Za-z0-9]{17}$/;
    var result =
      vehicleNo01.test(value) ||
      vehicleNo02.test(value) ||
      vehicleNo03.test(value) ||
      value == KCPT.shortName; //如果仅有一位且与所在省简称一致，也不提示错误
    return result || vehicleNo2.test(value) || vehicleNo3.test(value);
  },
  /** 验证车牌号首位*/
  validateVehicleNo_first: function(value) {
    var select_fule_type = $("#fule_type").val();
    // 如果是电车，那么走新的判断，程超
    if (select_fule_type == "3") {
      var vehicleNo01 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{7}$/;
      var vehicleNo02 = /^[\u4e00-\u9fa5]{2}[A-Za-z0-9]{6}$/;
      var vehicleNo03 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{6}[\u4e00-\u9fa5]{1}$/;
      var result =
        vehicleNo01.test(value) ||
        vehicleNo02.test(value) ||
        vehicleNo03.test(value);
      if (
        result &&
        value.length > 1 &&
        value.substring(0, 1) != KCPT.shortName
      ) {
        return false;
      }
      return true;
    } else {
      var vehicleNo01 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{6}$/;
      var vehicleNo02 = /^[\u4e00-\u9fa5]{2}[A-Za-z0-9]{5}$/;
      var vehicleNo03 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{5}[\u4e00-\u9fa5]{1}$/;
      var result =
        vehicleNo01.test(value) ||
        vehicleNo02.test(value) ||
        vehicleNo03.test(value);
      if (
        result &&
        value.length > 1 &&
        value.substring(0, 1) != KCPT.shortName
      ) {
        return false;
      }
      return true;
    }
  },
  /** 验证SIM卡*/
  validateSim: function(value) {
    /*var reg = "^0?(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]|64[0-9])[0-9]{8}$";*/
    /**
     * 2017.12.20新增
     * 移动：148、198 联通：146、166 电信：199 虚拟运营商：170
     * 2018.4.28新增400~499段
     */
    var reg =
      "^0?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9]|64[0-9]|4[0-9]{2})[0-9]{8}$";
    var r = value.match(new RegExp(reg));
    if (r) {
      return false;
    }
    return true;
  },
  //验证 【车辆识别代码/车架号】与【车牌号、车牌颜色】二者至少填一项；【核定载质量】与【准牵引总质量】二者至少填一项
  validRequiredInfo: function() {
    var _this = this;
    var vehicleType = "," + $("#vehicleTypeId").val();
    var loadTonSpan = $("#loadTonSpanId");
    var vehicleDrawTonSpan = $("#vehicleDrawTonSpanId");
    var loadTonVal = $.trim($("#loadTon").val()).replace("--", "");
    var vehicleDrawTonVal = $
      .trim($("#vehicleDrawTon").val())
      .replace("--", "");
    if (
      vehicleType != "," &&
      _this.vehicleTypeLargeVehicle.indexOf(vehicleType) >= 0
    ) {
      $("#loadTon").val(loadTonVal.length == 0 ? "--" : loadTonVal);
      $("#vehicleDrawTon").val(
        vehicleDrawTonVal.length == 0 ? "--" : vehicleDrawTonVal
      );
      $("#validRequiredDivId").html("");
      loadTonSpan.css("color", "#333");
      vehicleDrawTonSpan.css("color", "#333");
      return true;
    }
    var html = "";
    //验证  【核定载质量】与【准牵引总质量】二者至少填一项
    var isTonNull = false;
    if (loadTonVal.length == 0 && vehicleDrawTonVal.length == 0) {
      isTonNull = true;
      html += "【核定载质量】与【准牵引总质量】两项至少填一项！";
      loadTonSpan.css("color", "red");
      vehicleDrawTonSpan.css("color", "red");
    }
    $("#validRequiredDivId").html(html);
    if (loadTonVal.length == 0 && vehicleDrawTonVal.length == 0) {
      $("#loadTon").val(loadTonVal);
      $("#vehicleDrawTon").val(vehicleDrawTonVal);
    } else {
      $("#loadTon").val(loadTonVal.length == 0 ? "--" : loadTonVal);
      $("#vehicleDrawTon").val(
        vehicleDrawTonVal.length == 0 ? "--" : vehicleDrawTonVal
      );
    }

    if (html.length > 0) {
      if (!isTonNull) {
        loadTonSpan.css("color", "#333");
        vehicleDrawTonSpan.css("color", "#333");
      }
      return false;
    } else {
      loadTonSpan.css("color", "#333");
      vehicleDrawTonSpan.css("color", "#333");
      return true;
    }
  },
  // 验证车辆外廓、货厢内部-长
  /**
   * @param obj 目标对象
   * @param labelId 提示信息元素ID
   * @param isBox 是否为货厢内部尺寸
   * @param isCommit 是否为提交
   */
  validateVehicleLength: function(obj, labelId, isBox, isCommit) {
    var ret = true;
    var _this = this;
    if (obj && labelId) {
      var value = obj.val();
      var decimal = /^[1-9][\d]{0,4}(\.[\d]{1,2})?$/;
      var msg = $("#" + labelId);
      var isNull = msg.size() == 0;
      var type = isBox ? "货厢内部" : "外廓";
      var info =
          "请填写" + (isBox ? "--或" : "") + "正确的车辆" + type + "尺寸信息",
        nullInfo = "必选字段";
      var label = $(
        "<label id='" + labelId + "' class='red'>" + info + "</label>"
      );
      if ($.trim(value) == "") {
        if (isNull) {
          label = $(
            "<label id='" + labelId + "' class='red'>" + nullInfo + "</label>"
          );
          label.appendTo(obj.next());
        } else {
          if (msg.html().indexOf(nullInfo) < 0) {
            msg.html(nullInfo);
          }
        }
        ret = false;
      } else {
        msg = $("#" + labelId);
        isNull = msg.size() == 0;
        if (!isCommit) {
          _this.setBoxSizeNull(value, labelId); // 输入--自动赋值其他两项为--
        }
        if (
          (!isBox && (!decimal.test(value) || value < 1000)) ||
          (isBox && (value != "--" && (!decimal.test(value) || value < 1000)))
        ) {
          // 货厢内部尺寸可以输入--或数字
          if (isNull) {
            label = $(
              "<label id='" + labelId + "' class='red'>" + info + "</label>"
            );
            label.appendTo(obj.next());
          } else {
            if (msg.html().indexOf(info) < 0) {
              msg.html(info);
            }
          }
          ret = false;
        } else if (isBox && 0 == _this.checkBoxSizeAllNull()) {
          // 输入包含--与数字的数据，提示错误信息
          if (isNull) {
            label = $(
              "<label id='" + labelId + "' class='red'>" + info + "</label>"
            );
            label.appendTo(obj.next());
          } else {
            if (msg.html().indexOf(info) < 0) {
              msg.html(info);
            }
          }
          ret = false;
        } else {
          msg = $("#" + labelId);
          isNull = msg.size() == 0;
          if (isBox) {
            // 货厢内部尺寸需判断：同一辆车，货厢内部尺寸要小于该车的外部尺寸
            if (
              value != "--" &&
              parseFloat(value) >= parseFloat($("#vehicleLength").val())
            ) {
              if (isNull) {
                label = $(
                  "<label id='" + labelId + "' class='red'>" + info + "</label>"
                );
                label.appendTo(obj.next());
              } else {
                if (msg.html().indexOf(info) < 0) {
                  msg.html(info);
                }
              }
              ret = false;
            } else {
              if (!isNull) {
                msg.remove();
              }
              ret = true;
            }
          } else {
            if (!isNull) {
              msg.remove();
            }
            ret = true;
          }
        }
      }
    }
    return ret;
  },
  // 验证车辆外廓、货厢内部-宽、高
  /**
   * @param obj 目标对象
   * @param labelId 提示信息元素ID
   * @param isBox 是否为货厢内部尺寸
   * @param sizeType 类别 宽:1，高:2
   * @param isCommit 是否为提交
   */
  validateVehicleWidthHeight: function(
    obj,
    labelId,
    isBox,
    sizeType,
    isCommit
  ) {
    var _this = this;
    var ret = true;
    if (obj && labelId) {
      var value = obj.val();
      var decimal = /^[1-9][\d]{0,3}(\.[\d]{1,2})?$/;
      var msg = $("#" + labelId);
      var isNull = msg.size() == 0;
      var type = isBox ? "货厢内部" : "外廓";
      var info =
          "请填写" + (isBox ? "--或" : "") + "正确的车辆" + type + "尺寸信息",
        nullInfo = "必选字段";
      var label = $(
        "<label id='" + labelId + "' class='red'>" + info + "</label>"
      );
      var isNotExists = false,
        isNullNotExists = false;
      if (!isNull) {
        isNotExists = msg.html().indexOf(info) < 0;
        isNullNotExists = msg.html().indexOf(nullInfo) < 0;
      }
      if ($.trim(value) == "") {
        if (isNull) {
          label = $(
            "<label id='" + labelId + "' class='red'>" + nullInfo + "</label>"
          );
          label.appendTo(obj.next());
        } else {
          if (isNullNotExists) {
            msg.html(nullInfo);
          }
        }
        ret = false;
      } else {
        if (!isCommit) {
          _this.setBoxSizeNull(value, labelId); // 输入--自动赋值其他两项为--
        }
        if (
          (value != "--" &&
            !(isBox && sizeType == 2) &&
            (!decimal.test(value) || value < 1000)) ||
          (isBox && sizeType == 2 && !decimal.test(value) && value != "--")
        ) {
          // 货厢内部尺寸去除高大于1000限制
          if (isNull) {
            label = $(
              "<label id='" + labelId + "' class='red'>" + info + "</label>"
            );
            label.appendTo(obj.next());
          } else {
            if (isNotExists) {
              msg.html(info);
            }
          }
          ret = false;
        } else if (isBox && 0 == _this.checkBoxSizeAllNull()) {
          // 输入包含--与数字的数据，提示错误信息
          if (isNull) {
            label = $(
              "<label id='" + labelId + "' class='red'>" + info + "</label>"
            );
            label.appendTo(obj.next());
          } else {
            if (isNotExists) {
              msg.html(info);
            }
          }
          ret = false;
        } else {
          if (!isBox) {
            // 车辆外廓尺寸
            var vehicleLen = $("#vehicleLength");
            if (
              value != "--" &&
              parseFloat(value) >= parseFloat(vehicleLen.val())
            ) {
              // 宽、高小于长
              if (isNull) {
                label = $(
                  "<label id='" + labelId + "' class='red'>" + info + "</label>"
                );
                label.appendTo(obj.next());
              } else {
                if (isNotExists) {
                  msg.html(info);
                }
              }
              ret = false;
            } else {
              if (decimal.test(value) && value >= 1000) {
                if (!isNull) {
                  msg.remove();
                }
                ret = true;
              } else {
                ret = false;
              }
            }
          } else {
            msg = $("#" + labelId);
            isNull = msg.size() == 0;
            // 货厢内部尺寸需判断：同一辆车，货厢内部尺寸要小于该车的外部尺寸
            var vehicleWidthVal = $("#vehicleWidth").val(),
              vehicleHeightVal = $("#vehicleHeight").val(),
              boxLengthVal = $("#boxLength").val();
            if (
              value != "--" &&
              ((sizeType == 1 &&
                (vehicleWidthVal != "" &&
                  parseFloat(value) >= parseFloat(vehicleWidthVal))) ||
                (sizeType == 2 &&
                  vehicleHeightVal != "" &&
                  parseFloat(value) >= parseFloat(vehicleHeightVal)) ||
                (boxLengthVal != "" &&
                  parseFloat(value) >= parseFloat(boxLengthVal)))
            ) {
              // 货厢内部尺寸的宽、高要小于长
              if (isNull) {
                label = $(
                  "<label id='" + labelId + "' class='red'>" + info + "</label>"
                );
                label.appendTo(obj.next());
              } else {
                if (isNotExists) {
                  msg.html(info);
                }
              }
              ret = false;
            } else {
              if (!isNull) {
                msg.remove();
              }
              ret = true;
            }
          }
        }
      }
    }
    return ret;
  },
  // 检查货厢内部尺寸是否都为--
  checkBoxSizeAllNull: function() {
    var _this = this;
    var length = $("#boxLength").val(),
      width = $("#boxWidth").val(),
      height = $("#boxHeight").val();
    var counter = 0;
    if (length == "--") {
      counter++;
    }
    if (width == "--") {
      counter++;
    }
    if (height == "--") {
      counter++;
    }
    if (counter > 0 && counter < 3) {
      return 0;
    } else if (counter == 3) {
      $("#boxLengthForValid").html("");
      $("#boxWidthForValid").html("");
      $("#boxHeightForValid").html("");
    } else if (counter == 0) {
      var c = 0;
      if (
        !_this.validateVehicleLength2(
          $("#boxLength"),
          "boxLengthForValid",
          true
        )
      ) {
        c++;
      }
      if (
        !_this.validateVehicleWidthHeight2(
          $("#boxWidth"),
          "boxWidthForValid",
          true,
          1
        )
      ) {
        c++;
      }
      if (
        !_this.validateVehicleWidthHeight2(
          $("#boxHeight"),
          "boxHeightForValid",
          true,
          2
        )
      ) {
        c++;
      }
      if (c > 0) {
        return 2;
      }
      return 1;
    }
    return 1;
  },
  // 货厢内部尺寸任意一个输入--，其他两项赋值为--
  setBoxSizeNull: function(value, labelId) {
    if (value && labelId) {
      if (value == "--") {
        switch (labelId) {
          case "boxLengthForValid":
            $("#boxWidth").val("--");
            $("#boxHeight").val("--");
            break;
          case "boxWidthForValid":
            $("#boxLength").val("--");
            $("#boxHeight").val("--");
            break;
          case "boxHeightForValid":
            $("#boxLength").val("--");
            $("#boxWidth").val("--");
            break;
        }
      }
    }
  },
  // 验证车辆总质量、车辆核定载质量、准牵引总质量
  validateVehicleTon: function(obj, labelId, isVehicleTon) {
    var _this = this;
    var ret = true;

    var plcol = $("#plateColorId").val();
    var compareSize = 1000; //add 2017.8.21
    var decimal = /^[1-9][\d]{3,9}(\.[\d]{1,2})?$/;
    if (plcol == "1") {
      //蓝色不能小于100
      compareSize = 100;
      decimal = /^[1-9][\d]{2,9}(\.[\d]{1,2})?$/;
    } else if (plcol == "2") {
      //黄色不能小于1000
      compareSize = 1000;
      decimal = /^[1-9][\d]{3,9}(\.[\d]{1,2})?$/;
    } else {
      compareSize = 1000;
      decimal = /^[1-9][\d]{3,9}(\.[\d]{1,2})?$/;
    }

    if (obj && labelId) {
      var value = obj.val();
      /*var decimal = /^[1-9][\d]{3,9}(\.[\d]{1,2})?$/;*/
      var msg = $("#" + labelId);
      var isNull = msg.size() == 0;
      /* 2018.06.07
			 * var tonInfo = "请输入0、--、－－、/或大于"+compareSize+"且最多两位小数的数字",*/
      var tonInfo =
          "请输入0、--、或大于" + compareSize + "且最多两位小数的数字",
        repInfo = "不能连续输入" + _this.repeatNum + "位及以上的重复数字",
        decInfo = "请输入--或大于" + compareSize + "，小数部分最多两位的数字",
        lessInfo = "核定载质量需小于总质量",
        nullInfo = "必选字段";
      var label = $(
        "<label id='" + labelId + "' class='red'>" + tonInfo + "</label>"
      );
      //modify by haoyanhui  2017.3.21  总质量等不能输入包含空格
      /*value = $.trim(value);*/
      if (isVehicleTon) {
        // 总质量
        if (value == "") {
          if (isNull) {
            label = $(
              "<label id='" + labelId + "' class='red'>" + nullInfo + "</label>"
            );
            label.appendTo(obj.next());
          } else {
            if (msg.html().indexOf(nullInfo) < 0) {
              msg.html(nullInfo);
            }
          }
          ret = false;
        } else {
          //不为空
          ////if (!(decimal.test(value) && value >= compareSize) && !(value == "0" || value == "--" || value == "/" || value == "－－")) {
          if (
            !(decimal.test(value) && value >= compareSize) &&
            !(value == "0" || value == "--")
          ) {
            if (isNull) {
              label = $(
                "<label id='" +
                  labelId +
                  "' class='red'>" +
                  tonInfo +
                  "</label>"
              );
              label.appendTo(obj.next());
            } else {
              if (msg.html().indexOf(tonInfo) < 0) {
                msg.html(tonInfo);
              }
            }
            ret = false;
          } ///else if (value == "--" || value == "/" || value == "－－") {
          else if (value == "--") {
            $("#loadTon")
              .next()
              .html("");
            if (!isNull) {
              msg.remove();
            }
            ret = true;
          } else if (!_this.checkNumSeriesRepeat(obj)) {
            if (isNull) {
              label = $(
                "<label id='" +
                  labelId +
                  "' class='red'>" +
                  repInfo +
                  "</label>"
              );
              label.appendTo(obj.next());
            } else {
              if (msg.html().indexOf(repInfo) < 0) {
                msg.html(repInfo);
              }
            }
            ret = false;
          } else {
            if (!isNull) {
              msg.remove();
            }
            ret = true;
          }
        }
      } else {
        // 车辆核定载质量、准牵引总质量
        var vehicleTonVal = $("#vehicleTon").val(); //总质量,
        loadTonVal = $("#loadTon").val();
        if (
          (value != "" &&
            value != "--" &&
            !(decimal.test(value) && value >= compareSize)) ||
          (value == "" && value.length > 0)
        ) {
          if (isNull) {
            label = $(
              "<label id='" + labelId + "' class='red'>" + decInfo + "</label>"
            );
            label.appendTo(obj.next());
          } else {
            msg.html(decInfo);
            if (msg.html().indexOf(decInfo) < 0) {
              msg.html(decInfo);
            }
          }
          ret = false;
        } else if (
          obj.attr("id") == "loadTon" &&
          loadTonVal != "" &&
          vehicleTonVal != ""
        ) {
          //核定载质量(kg)
          ///if (vehicleTonVal != "" && vehicleTonVal != '--' && vehicleTonVal != '－－' && vehicleTonVal != '/') { // --、－－、/的总质量不添加“核定载质量需小于总质量”判断
          if (vehicleTonVal != "" && vehicleTonVal != "--") {
            if (parseFloat(loadTonVal) >= parseFloat(vehicleTonVal)) {
              if (isNull) {
                label = $(
                  "<label id='" +
                    labelId +
                    "' class='red'>" +
                    lessInfo +
                    "</label>"
                );
                label.appendTo(obj.next());
              } else {
                if (msg.html().indexOf(lessInfo) < 0) {
                  msg.html(lessInfo);
                }
              }
              ret = false;
            } else {
              if (!isNull) {
                msg.remove();
              }
              ret = true;
            }
            //					} else if (vehicleTonVal == "--") {
            //						$("#loadTon").next().html("");
            //						if (!isNull) {
            //							msg.remove();
            //						}
            //						ret = true;
          } else {
            if (!isNull) {
              msg.remove();
            }
            ret = true;
          }
        } else {
          if (!isNull) {
            msg.remove();
          }
          ret = true;
        }
      }
    }
    return ret;
  },
  // 货厢内部尺寸长二次验证
  validateVehicleLength2: function(obj, labelId, isBox) {
    var ret = true;
    var _this = this;
    if (obj && labelId) {
      var value = obj.val();
      var decimal = /^[\d]{1,5}(\.[\d]{1,2})?$/;
      var msg = $("#" + labelId);
      var isNull = msg.size() == 0;
      var type = isBox ? "货厢内部" : "外廓";
      var info =
          "请填写" + (isBox ? "--或" : "") + "正确的车辆" + type + "尺寸信息",
        nullInfo = "必选字段";
      var label = $(
        "<label id='" + labelId + "' class='red'>" + info + "</label>"
      );
      var isNotExists = false,
        isNullNotExists = false;
      if (!isNull) {
        isNotExists = msg.html().indexOf(info) < 0;
        isNullNotExists = msg.html().indexOf(nullInfo) < 0;
      }
      if ($.trim(value) == "") {
        if (isNull) {
          label = $(
            "<label id='" + labelId + "' class='red'>" + nullInfo + "</label>"
          );
          label.appendTo(obj.next());
        } else {
          if (isNullNotExists) {
            msg.html(nullInfo);
          }
        }
        ret = false;
      } else {
        msg = $("#" + labelId);
        isNull = msg.size() == 0;
        if (!isNull) {
          isNotExists = msg.html().indexOf(info) < 0;
        }
        if (
          (!isBox && (!decimal.test(value) || value < 1000)) ||
          (isBox && (value != "--" && (!decimal.test(value) || value < 1000)))
        ) {
          // 货厢内部尺寸可以输入--或数字
          if (isNull) {
            label = $(
              "<label id='" + labelId + "' class='red'>" + info + "</label>"
            );
            label.appendTo(obj.next());
          } else {
            if (isNotExists) {
              msg.html(info);
            }
          }
          ret = false;
        } else {
          if (isBox) {
            // 货厢内部尺寸需判断：同一辆车，货厢内部尺寸要小于该车的外部尺寸
            if (
              value != "--" &&
              parseFloat(value) >= parseFloat($("#vehicleLength").val())
            ) {
              if (isNull) {
                label = $(
                  "<label id='" + labelId + "' class='red'>" + info + "</label>"
                );
                label.appendTo(obj.next());
              } else {
                if (isNotExists) {
                  msg.html(info);
                }
              }
              ret = false;
            } else {
              if (!isNull) {
                msg.remove();
              }
              ret = true;
            }
          } else {
            if (!isNull) {
              msg.remove();
            }
            ret = true;
          }
        }
      }
    }
    return ret;
  },
  // 货厢内部尺寸宽、高二次验证
  validateVehicleWidthHeight2: function(obj, labelId, isBox, sizeType) {
    $("#" + obj.attr("id") + "Select").css("display", "none"); //add by chengchao 2017.8.29
    var _this = this;
    var ret = true;
    if (obj && labelId) {
      var value = obj.val();
      var decimal = /^[\d]{1,4}(\.[\d]{1,2})?$/;
      var msg = $("#" + labelId);
      var isNull = msg.size() == 0;
      var type = isBox ? "货厢内部" : "外廓";
      var info =
          "请填写" + (isBox ? "--或" : "") + "正确的车辆" + type + "尺寸信息",
        nullInfo = "必选字段";
      var label = $(
        "<label id='" + labelId + "' class='red'>" + info + "</label>"
      );
      var isNotExists = false,
        isNullNotExists = false;
      if ($.trim(value) == "") {
        if (isNull) {
          label = $(
            "<label id='" + labelId + "' class='red'>" + nullInfo + "</label>"
          );
          label.appendTo(obj.next());
        } else {
          isNullNotExists = msg.html().indexOf(nullInfo) < 0;
          if (isNullNotExists) {
            msg.html(nullInfo);
          }
        }
        ret = false;
      } else {
        if (
          (value != "--" &&
            !(isBox && sizeType == 2) &&
            (!decimal.test(value) || value < 1000)) ||
          (isBox && sizeType == 2 && !decimal.test(value) && value != "--")
        ) {
          // 货厢内部尺寸去除高大于1000限制
          msg = $("#" + labelId);
          isNull = msg.size() == 0;
          if (isNull) {
            label = $(
              "<label id='" + labelId + "' class='red'>" + info + "</label>"
            );
            label.appendTo(obj.next());
          } else {
            isNotExists = msg.html().indexOf(info) < 0;
            if (isNotExists) {
              msg.html(info);
            }
          }
          ret = false;
        } else {
          // 货厢内部尺寸需判断：同一辆车，货厢内部尺寸要小于该车的外部尺寸
          var vehicleWidthVal = $("#vehicleWidth").val(),
            vehicleHeightVal = $("#vehicleHeight").val(),
            boxLengthVal = $("#boxLength").val();
          if (value != "--") {
            if (
              sizeType == 1 &&
              (vehicleWidthVal != "" &&
                parseFloat(value) >= parseFloat(vehicleWidthVal))
            ) {
              msg = $("#boxWidthForValid");
              isNull = msg.size() == 0;
              if (isNull) {
                label = $(
                  "<label id='boxWidthForValid' class='red'>" +
                    info +
                    "</label>"
                );
                label.appendTo(obj.next());
              } else {
                isNotExists = msg.html().indexOf(info) < 0;
                if (isNotExists) {
                  msg.html(info);
                }
              }
              ret = false;
            } else if (
              sizeType == 2 &&
              vehicleHeightVal != "" &&
              parseFloat(value) >= parseFloat(vehicleHeightVal)
            ) {
              msg = $("#boxHeightForValid");
              isNull = msg.size() == 0;
              if (isNull) {
                label = $(
                  "<label id='boxHeightForValid' class='red'>" +
                    info +
                    "</label>"
                );
                label.appendTo(obj.next());
              } else {
                isNotExists = msg.html().indexOf(info) < 0;
                if (isNotExists) {
                  msg.html(info);
                }
              }
              ret = false;
            } else if (
              boxLengthVal != "" &&
              parseFloat(value) >= parseFloat(boxLengthVal)
            ) {
              msg = $("#boxHeightForValid");
              isNull = msg.size() == 0;
              if (isNull) {
                label = $(
                  "<label id='boxHeightForValid' class='red'>" +
                    info +
                    "</label>"
                );
                label.appendTo($("#boxHeight").next());
              } else {
                isNotExists = msg.html().indexOf(info) < 0;
                if (isNotExists) {
                  msg.html(info);
                }
              }
              ret = false;
            } else {
              if (!isNull) {
                msg.remove();
              }
              ret = true;
            }
          } else {
            $("#boxWidthForValid").remove();
            $("#boxHeightForValid").remove();
            ret = true;
          }
        }
      }
      return ret;
    }
  },
  // 验证车牌颜色是否为空
  validatePlateColorNull: function(obj) {
    var vnoErr = $("#vnoAndColErrorMsg").find("label");
    if (
      vnoErr.size() > 0 &&
      vnoErr.attr("for") == "vehicleNoId" &&
      vnoErr.css("display") != "none"
    ) {
      //有车牌号错误提示
      return false;
    } else {
      if (obj) {
        //车牌号为空
        if ($.trim(obj.val()).length == 0) {
          if ($("#plateColorIdForValid").size() > 0) {
            $("#plateColorIdForValid").html("必选字段");
          } else {
            var labelPlateColor = $(
              "<label id='plateColorIdForValid' class='red'>必选字段</label>"
            );
            labelPlateColor.appendTo(obj.next());
          }
          return false;
        } else {
          if ($("#plateColorIdForValid").size() > 0) {
            /*$("#plateColorIdForValid").remove();*/
            $("#vnoAndColErrorMsg")
              .find("label")
              .remove();
          }
          return true;
        }
      }
      return false;
    }
  },
  validateVBrandName: function() {
    var _this = this;
    var vbrandNameObj = $("#vbrandName");
    var vbrandName = $.trim(vbrandNameObj.val());

    var msg = $("#vbrandNameForValid");
    var notNullLb =
        "<label id='vbrandNameForValid' class='red'>必选字段</label>",
      notNull = "必选字段";
    var notExistLb =
        "<label id='vbrandNameForValid' class='red'>车牌品牌不存在</label>",
      notExist = "车牌品牌不存在";
    var label;
    var rstBol = true;

    //校验是否为空
    if ("" == vbrandName) {
      if (msg.text() != "") {
        msg.text(notNull);
        rstBol = false;
      } else {
        $(notNullLb).appendTo(vbrandNameObj.next());
        rstBol = false;
      }
    } else {
      if (msg.text() != "" && _this.ismatchVBrandName == 0) {
        if (msg.text() != notExist) {
          msg.text(notExist);
        }
        rstBol = false;
      } else if (_this.ismatchVBrandName == 0) {
        $(notExistLb).appendTo(vbrandNameObj.next());
        rstBol = false;
      } else if (_this.ismatchVBrandName == 1 || KCPT.autocompleteVBrandData) {
        var isMatch = false;
        $(KCPT.autocompleteVBrandData).each(function(k, v) {
          var _vbrandName = $("#vbrandName").val();
          if (_vbrandName == v.vbrandName) {
            var vbrandCode = $("#vbrandCode").val();
            if ("" == vbrandCode) {
              $("#vbrandCode").val(v.vbrandCode);
            }
            isMatch = true;
          }
        });
        if (!isMatch) {
          if (msg.text() != notExist) {
            msg.text(notExist);
          }
          if (msg.text() == "") {
            $(notExistLb).appendTo(vbrandNameObj.next());
          }
          rstBol = false;
        } else {
          msg.remove();
          _this.isAutoComplete = true;
          rstBol = true;
        }
      } else {
        msg.remove();
        rstBol = true;
      }
    }
    return rstBol;
  },
  // 移除指定车牌颜色下拉选择
  removePlateColorSelect: function(plateColor) {
    $("#plateColorId")
      .find("option[value='" + plateColor + "']")
      .remove();
  },
  //行驶证发证日期校验 add 2017.8.8
  drivecardReleaseDateValidat: function() {
    var vehicleNo = $("#vehicleNoId").val();
    var vinCode = $("#vinCode").val();
    var rdateValue = $("#drivecardReleaseDate").val();
    var eleSpan = $("#drivecardReleaseDate").next();
    if (
      vehicleNo == "" ||
      vehicleNo == KCPT.shortName ||
      (vehicleNo != null && vehicleNo == vinCode)
    ) {
      //车牌号为空
      //发证日期选填，不校验
      //if ($("#drivecardReleaseDateForValid").size() > 0) {
      /*$("#drivecardReleaseDateForValid").remove();*/
      eleSpan.html("");
      //}
      return true;
    } else {
      if (rdateValue.length == 0) {
        eleSpan.html(
          '<label id="drivecardReleaseDateForValid" class="error" style="display:block;">必选字段</label>*'
        );
        return false;
      } else {
        $("#drivecardReleaseDateForValid").remove();
        return true;
      }
    }
  },
  //发动机号校验 add 2017.8.8
  engineNoValidat: function() {
    var engineNoValidatRelue = /^[a-zA-Z0-9]+$/; // 验证发动机号,  只能输入数字和字母
    var vehicleNo = $("#vehicleNoId").val();
    var vinCode = $("#vinCode").val();
    var engineNo = $("#engineNo").val();
    var eleSpan = $("#engineNo").next();
    if (
      vehicleNo == "" ||
      vehicleNo == KCPT.shortName ||
      (vehicleNo != null && vehicleNo == vinCode)
    ) {
      //车牌号为空
      //发动机号选填
      if (engineNo == "") {
        //不填
        if ($("#engineNoForValid").size() > 0) {
          /*$("#engineNoForValid").remove();*/
          eleSpan.html("");
        }
        return true;
      } else {
        //填写了就校验
        if (!engineNoValidatRelue.test(engineNo) && engineNo.length != 0) {
          eleSpan.html(
            '<label id="engineNoForValid" class="error" style="display:block;">只能输入数字或字母</label>'
          );
          return false;
        }
        if (engineNo.length < 3) {
          eleSpan.html(
            '<label id="engineNoForValid" class="error" style="display:block;">长度不能小于3</label>'
          );
          return false;
        } else if (engineNo.length > 25) {
          eleSpan.html(
            '<label id="engineNoForValid" class="error" style="display:block;">长度不能大于25</label>'
          );
          $("#engineNo").val(
            $("#engineNo")
              .val()
              .substr(0, 25)
          );
          return false;
        } else {
          /*$("#engineNoForValid").remove();*/
          eleSpan.html("");
          return true;
        }
      }
    } else {
      if (!engineNoValidatRelue.test(engineNo) && engineNo.length != 0) {
        eleSpan.html(
          '<label id="engineNoForValid" class="error" style="display:block;">只能输入数字或字母</label>*'
        );
        return false;
      }
      if (engineNo.length == 0) {
        eleSpan.html(
          '<label id="engineNoForValid" class="error" style="display:block;">必选字段</label>*'
        );
        return false;
      } else if (engineNo.length < 3) {
        eleSpan.html(
          '<label id="engineNoForValid" class="error" style="display:block;">长度不能小于3</label>*'
        );
        return false;
      } else if (engineNo.length > 25) {
        eleSpan.html(
          '<label id="engineNoForValid" class="error" style="display:block;">长度不能大于25</label>*'
        );
        $("#engineNo").val(
          $("#engineNo")
            .val()
            .substr(0, 25)
        );
        return false;
      } else {
        /*$("#engineNoForValid").remove();*/
        eleSpan.html("*"); //2018.2.23
        return true;
      }
    }
  },
  //发动机型号, 只能输入英文、数字、-.符号 add 2017.8.8
  engineTypeValidat: function() {
    //首先隐藏下拉
    $("#engineTypeSelect").css("display", "none"); //add by chengchao 2017.8.29
    var engineTypeRul = /^[a-zA-Z0-9\.\-\*\I\II\III\IV\V\VI\VII\VIII\IX\X\ ]+$/; //只能输入英文、数字、-.符号
    var engineNoValue = $("#engineType").val();
    var elementSpan = $("#engineType").next();
    //2018.2.23 发动机型号不能为空
    if (engineNoValue == "" || engineNoValue.length == 0) {
      elementSpan.html(
        '<label id="engineTypeForValid" class="error" style="display:block;">必选字段</label>*'
      );
      return false;
    }
    if (!engineTypeRul.test(engineNoValue) && engineNoValue.length != 0) {
      var mod =
        '<label id="engineTypeForValid" class="error" style="display:block;">只能输入英文、数字、-、*、或.符号</label>*';
      elementSpan.html(mod);
      return false;
    }
    if (engineNoValue.length < 3 && engineNoValue.length != 0) {
      var mod =
        '<label id="engineTypeForValid" class="error" style="display:block;">长度不能小于3</label>*';
      elementSpan.html(mod);
      return false;
    } else if (engineNoValue.length > 20) {
      var mod =
        '<label id="engineTypeForValid" class="error" style="display:block;">长度不能大于20</label>*';
      elementSpan.html(mod);
      $("#engineType").val(
        $("#engineType")
          .val()
          .substr(0, 20)
      );
      return false;
    } else {
      /*$("#engineTypeForValid").remove();*/

      elementSpan.html("*"); //2018.2.23
      return true;
    }
  },
  //车牌颜色黄、蓝改变，牵引总质量变化  add 2017.8.21
  plateColorChange: function(obj) {
    if (obj) {
      if (obj.val() == "1") {
        //蓝色
        $("#li_vehicleDrawTon").css("display", "none");
        $("#vehicleDrawTon").val("");
      } else if (obj.val() == "2" || obj.val() == "5") {
        //黄色
        $("#li_vehicleDrawTon").css("display", "block");
      }
    }
  }
};
