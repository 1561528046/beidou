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
  // 清空
  clearAwayAll: function() {
    var _this = this;
    //ie下清空表单内容时隐藏表单也会清空（Chrome不清空）所以先记录当前登录的服务商ID
    var _opPlatformId = $("#opPlatformId").val();
    $("#form123")
      .get(0)
      .reset();
    $("#form00")
      .get(0)
      .reset();

    $("#areaCodeId").val(KCPT.user.platformProvince);
    //添加页面，赋值车牌号首位
    _this.$vehicleNoId.val(KCPT.shortName);

    //要判断一下是不是服务商用户,select个数0说明不可选服务商,说明是服务商
    if ($("#opPlatformSelectParentId select").size() == 0) {
      $("#opPlatformId").val(_opPlatformId);
    }
    //如果opPlatformId为空说明不是服务商，所以要清空接入点、地址、端口
    if ($("#opPlatformId") == null || $("#opPlatformId").val() == "") {
      $("#opPlatformPointId").html("<option value=''>请选择</option>");
      $("#point_adds").html("");
      $("#point_port").html("");
      $("#newSeq").val("");
    } else {
      //否则不是服务商//清空接入点名称，接入点地址和端口
      var ipPort = KCPT.ipPorts[$("#opPlatformPointId option:first").val()];
      $("#point_adds").html(ipPort[0]);
      $("#point_port").html(ipPort[1]);
      $("#newSeq").val(ipPort[2]);
    } //IE下兼容问题设置选中车辆颜色第一项 黄色 //$("#plateColorId").find("option[text='请选择']").attr("selected", true);//更改默认请选择 //modify 2017.4.10 haoyanhui 为兼容IE8
    /**modify haoyanhui 2017.3.14*/
    /*$("#plateColorId option[value=2]").attr("selected", true); */ $(
      "#plateColorId option[value='']"
    ).attr("selected", true);

    $("#opPlatformPointId option:first").attr("selected", true); //接入点第一项
    //清空错误提示
    removeErrorCss();
    //清空二选一红色提示
    $("#validRequiredDivId").html("");
    $("#vinCodeSpanId").css("color", "#333");
    $("#vehicleNoSpanId").css("color", "#333");
    $("#loadTonSpanId").css("color", "#333");
    $("#vehicleDrawTonSpanId").css("color", "#333");
    $("#span_registrationCertificateFile").html("");
    $("#span_registrationCertificateFile2").html("");
    $("#span_drivingLicOrCertFile").html("");
    $("#span_vehicleBodyPhotoFile").html("");
    // 清空车辆尺寸信息
    $("#vehicleLengthForValid").html("");
    $("#vehicleWidthForValid").html("");
    $("#vehicleHeightForValid").html("");
    $("#boxLengthForValid").html("");
    $("#boxWidthForValid").html("");
    $("#boxHeightForValid").html("");
    // 清空质量信息提示信息
    $("#vehicleTonForValid").html("");
    $("#loadTonForValid").html("");
    $("#vehicleDrawTonForValid").html("");
    $("#fule_type")
      .find("option [value='1']")
      .attr("selected", true);
    //手动触发事件
    $("#fule_type").trigger("change");
    _this.resetCodeBtnAndPhone($("#getVerifyCodeBtn"), $("#vehicleOwnerPhone"));
    _this.clearVerifyCodeTimeout();
  },
  /**
   * 让页面滚动到错误提示的位置
   * */
  scrollToFirstError: function() {
    var $errorLabels = $("label.error");
    for (var i = 0; i < $errorLabels.length; i++) {
      var one = $errorLabels[i];
      if ($(one).css("display") != "none") {
        var pos = $(one).position();
        var oldTop = $("#quickDealId").scrollTop();
        $("#quickDealId").scrollTop(pos.top + oldTop);
        break;
      }
    }
    //add by haoyanhui 2017.8.21
    var $errorLabels = $("label.red");
    for (var i = 0; i < $errorLabels.length; i++) {
      var one = $errorLabels[i];
      if ($(one).css("display") != "none") {
        var pos = $(one).position();
        var oldTop = $("#quickDealId").scrollTop();
        $("#quickDealId").scrollTop(pos.top + oldTop);
        break;
      }
    }
  },
  // 开户
  save: function() {
    var _this = this;
    _this.isAddCar = 0;
    _this.toggleSmsVerify();
    //验证日期
    var oftime = $("#outfactorytime").val();
    var etime = $("#insuranceexpiratetime").val();
    var contractTime = $("#contractExpireTime").val(); // 服务合同到期时间
    var validDateCheck = $("#validDateCheck").val();
    var drivecardReleaseDate = $("#drivecardReleaseDate").val(); // 行驶证发证日期 add 2017.8.8
    if (drivecardReleaseDate != null && drivecardReleaseDate != "") {
      $("#drivecardReleaseDateh").val(date2utc(drivecardReleaseDate));
    }
    if (oftime != "" && oftime != null) {
      $("#outfactorytimeh").val(date2utc(oftime));
    }
    if (etime != "" && etime != null) {
      $("#insuranceexpiratetimeh").val(date2utc(etime));
    }
    if (contractTime != null && contractTime != "") {
      $("#contractExpireTimeh").val(date2utc(contractTime));
    }
    if (null != validDateCheck && validDateCheck != "") {
      var toNumValidDateCheck = date2utc(validDateCheck + "-01");
      if (0 != toNumValidDateCheck) {
        $("#validDateCheckh").val(date2utc(validDateCheck + "-01"));
      } else {
        _this.scrollToFirstError();
        return false;
      }
    }
    //验证车辆登记证、车辆合格证或行驶证、车身照片图片类型
    if (!_this.checkVehiclePics()) {
      _this.scrollToFirstError();
      return false;
    }
    //设置保险类型
    _this.setTpstr();

    //表单验证
    var v00 = _this.form00Validate().form(); //服务商信息form
    var v2 = _this.formValidate_Different().form(); //form123;不是已审核的车辆不验证车牌号,VIN,道路运输证号,所属地,车牌颜色
    var v3 = _this.formValidate123().form(); //form123;
    var v4 = _this.checkVehicleTon(); //检查车辆质量信息入口
    var v5 = _this.checkVehicleSize(); //检查车辆尺寸入口
    var v6 = _this.validateVBrandName(); //验证车辆品牌
    var v7 = _this.setVBrandCode(); //验证车辆品牌CODE是否赋值成功
    var v8 = _this.drivecardReleaseDateValidat(); //发证日期校验 add 2017.8.8
    var v9 = _this.engineNoValidat(); //发动机号校验 add 2017.8.8
    var v10 = _this.engineTypeValidat(); //发动机型号校验 add 2017.8.8

    if (!_this.validRequiredInfo()) {
      //验证 【车辆识别代码/车架号】与【车牌号、车牌颜色】二者至少填一项；【核定载质量】与【准牵引总质量】二者至少填一项
      _this.scrollToFirstError();
      return false;
    }
    if (!v4) {
      // 验证检查车辆质量信息、验证车辆外廓货厢内部尺寸信息
      _this.scrollToFirstError();
      return false;
    }
    if (!v5) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v00) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v2) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v3) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v6) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v7) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v8) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v9) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v10) {
      _this.scrollToFirstError();
      return false;
    }

    // 联系人短信验证是否通过
    if (
      _this.smsV === "1" &&
      $("#verifyCodeFlag")
        .html()
        .indexOf("right.gif") < 0
    ) {
      _this.scrollToFirstError();
      return false;
    }

    var msg = "确认添加车辆?";
    //车架号只能是17位
    var vin = _this.$vinCode;
    if (
      vin.val().length > 0 &&
      vin.val().length != 17 &&
      vin.val().length != 8 &&
      vin.val().length != 18
    ) {
      $.ligerDialog.error("请输入正确的车架号！");
      _this.scrollToFirstError();
      return false;
    }
    //车架号唯一性验证
    if (!_this.vinCodeValidate()) {
      _this.scrollToFirstError();
      return false;
    }
    var vehicleNo = _this.$vehicleNoId;
    if (vehicleNo.val().length > 8 && vin.val() != vehicleNo.val()) {
      $.ligerDialog.error("请输入正确的车牌号！");
      _this.scrollToFirstError();
      return false;
    }
    if (
      (vehicleNo.val().length == 7 || vehicleNo.val().length == 8) &&
      vin.val() != vehicleNo.val()
    ) {
      //车牌号必填，设置为大写
      vehicleNo.val(vehicleNo.val().toUpperCase());
    }
    var vehicleFlag = 0;
    var businessCode = /^[-a-zA-Z0-9]+$/;
    if (
      (vin.val().length == 8 ||
        vin.val().length == 17 ||
        vin.val().length == 18) &&
      businessCode.test(vin.val()) &&
      vehicleNo.val().length == 1 &&
      vehicleNo.val() == KCPT.shortName
    ) {
      vehicleNo.val("");
    }
    if (vin.val().length > 0 && vehicleNo.val().length == 0) {
      vehicleNo.val(vin.val()); //将车辆识别代码/车架号作为车牌号
      msg =
        "因【车牌号】为空,将以【车架号】作为【车牌号】<br/><br/>是否添加车辆信息?";
      vehicleFlag = 1;
    }

    //modify haoyanhui 2017.3.14  默认进来请选择
    var plateColorVal = $("#plateColorId").val();
    if (plateColorVal == undefined || plateColorVal == "") {
      $.ligerDialog.warn("车辆颜色为空，请填写！", "提示");
      return false;
    }

    //燃料种类为电时，车牌号只能为8位
    if (
      plateColorVal == "5" &&
      vehicleNo.val().length != 8 &&
      vehicleNo.val() != vin.val()
    ) {
      $.ligerDialog.warn("燃料种类为电时，车牌号只能填写8位！", "提示");
      return false;
    }

    //车牌号为8位时，只能选择电类型
    if (
      vehicleNo.val().length == 8 &&
      plateColorVal != "5" &&
      vehicleNo.val() != vin.val()
    ) {
      $.ligerDialog.warn("车牌号不符合条件，请重新填写！", "提示");
      return false;
    }

    //车牌号与车牌颜色验证唯一
    if (!_this.vehicleValidate()) {
      _this.scrollToFirstError();
      return false;
    }
    //SIM卡号唯一性验证
    if (!_this.commaddrValidate()) {
      _this.scrollToFirstError();
      return false;
    }

    if (!_this.isAutoComplete) {
      $.ligerDialog.error("车辆品牌识别失败，请重新录入！");
      _this.scrollToFirstError();
      return false;
    }

    // 验证当前服务商/运输企业的开放车牌颜色限制设置（通过颜色编码） start
    if (!_this.checkPlateColorLimitByCode()) {
      $.ligerDialog.confirm(_this.MSG_VEHICLE_NO_REPEAT, function(yes) {
        if (yes) {
          _this.addVehicleSave();
        } else {
          return false;
        }
      });
    } else {
      $.ligerDialog.confirm(msg, function(yes) {
        if (yes) {
          _this.addVehicleSave();
        } else {
          if (vehicleFlag == 1) {
            vehicleNo.val(KCPT.shortName);
          }
        }
      });
    }
    // 验证当前服务商/运输企业的开放车牌颜色限制设置（通过颜色编码） end
  },
  callbackSaveImage: function(data) {
    var _this = this;
    if (_this.isAddCar === 0) {
      //加车回调
      _this.callbackAddCar(data);
    } else if (_this.isAddCar === 1) {
      //改车回调
      _this.callbackUpdateCar(data);
    }
  },
  callbackAddCar: function(data) {
    var _this = this;
    quickDeal.isSaveImageTimeout = false;
    clearTimeout(quickDeal.timer);

    //关闭加载滚动条
    $("#mainDivContent").close_A_Window({
      id: "vehicleWaitingWin"
    });

    if (data != null && data.error != null && data.error != "") {
      //$("#form3").find("input[class='nextbutton white']").attr("disabled", ""); //回复保存按钮
      $("#quickDealId")
        .find("#quick_submit_bit")
        .removeAttr("disabled"); //完成注册置为有效
      $("#quickDealId")
        .find("#quick_submit_bit")
        .css("backgroundPosition", "-100px 0px");
      if (
        data.error[0].errorMessage != null &&
        data.error[0].errorMessage != ""
      ) {
        $.ligerDialog.warn(decodeURI(data.error[0].errorMessage), "提示");
      }
    } else {
      //序列化基本信息
      var entData = "tbVehicle.entId=" + $("#hiddenEntId").val();
      var vehicleData = $("#form123").serialize();
      if ($("#opPlatformId").val() != undefined) {
        //服务商
        vehicleData += "&tbVehicle.opPlatformId=" + $("#opPlatformId").val(); //form00里
      }
      if ($("#transEntId").val() != undefined) {
        //运输企业
        vehicleData += "&tbVehicle.transEntId=" + $("#transEntId").val();
      }
      // 服务合同到期时间
      if ($("#contractExpireTimeh").val() != undefined) {
        vehicleData +=
          "&tbVehicle.contractExpireTime=" + $("#contractExpireTimeh").val(); //form00里
      }
      vehicleData += "&tbVehicle.pointId=" + $("#opPlatformPointId").val(); //form00里
      vehicleData += "&tbVehicle.newSeq=" + $("#newSeq").val(); //form00里
      vehicleData += "&tbVehicle.oldSeq=" + $("#oldSeq").val(); //form00里
      vehicleData += "&authCode=" + $("#verifycode").val();
      vehicleData += "&vehicleOwnerPhoneOld=" + _this.vehicleOwnerPhoneOld;
      //								vehicleData+="&tbVehicle.prodCode="+prodCodeText;//设置车辆型号

      var datas = entData + "&" + vehicleData;
      if (
        data != null &&
        data.path1 != null &&
        data.path1 != "" &&
        data.type1 != null &&
        data.type1 != ""
      ) {
        datas +=
          "&path1=" +
          data.path1 +
          "&type1=" +
          data.type1 +
          "&attachId1=" +
          $("#attachId1").val();
      }
      if (
        data != null &&
        data.path2 != null &&
        data.path2 != "" &&
        data.type2 != null &&
        data.type2 != ""
      ) {
        datas +=
          "&path2=" +
          data.path2 +
          "&type2=" +
          data.type2 +
          "&attachId2=" +
          $("#attachId2").val();
      }
      if (
        data != null &&
        data.path3 != null &&
        data.path3 != "" &&
        data.type3 != null &&
        data.type3 != ""
      ) {
        datas +=
          "&path3=" +
          data.path3 +
          "&type3=" +
          data.type3 +
          "&attachId3=" +
          $("#attachId3").val();
      }
      if (
        data != null &&
        data.path4 != null &&
        data.path4 != "" &&
        data.type4 != null &&
        data.type4 != ""
      ) {
        datas +=
          "&path4=" +
          data.path4 +
          "&type4=" +
          data.type4 +
          "&attachId4=" +
          $("#attachId4").val();
      }
      //保存车、卡、终端基本信息
      var vehicleNo = $("#vehicleNoId").val();
      JAjax(
        "quick/addAuickDeal.action?vehicleNo=" +
          vehicleNo +
          "&userName=" +
          KCPT.user.opLoginname,
        datas,
        "json",
        function(data) {
          if (data != null && data.error != null && data.error != "") {
            if (
              data.error[0].errorMessage != null &&
              data.error[0].errorMessage != ""
            ) {
              //$("#form3").find("input[class='nextbutton white']").attr("disabled", ""); //回复保存按钮
              $("#quickDealId")
                .find("#quick_submit_bit")
                .removeAttr("disabled"); //完成注册置为有效
              $("#quickDealId")
                .find("#quick_submit_bit")
                .css("backgroundPosition", "-100px 0px");
              $.ligerDialog.warn(data.error[0].errorMessage, "提示");
            }
          } else {
            if (data.displayMessage == "fail") {
              $.ligerDialog.warn("添加失败！", "提示");
              //$("#form3").find("input[class='nextbutton white']").attr("disabled", ""); //回复保存按钮
              $("#quickDealId")
                .find("#quick_submit_bit")
                .removeAttr("disabled"); //完成注册置为有效
              $("#quickDealId")
                .find("#quick_submit_bit")
                .css("backgroundPosition", "-100px 0px");
              //										obj.findListVsRefId();
            } else if (data.displayMessage == "success") {
              $.ligerDialog.confirm("添加成功,是否继续添加?", "提示", function(
                v
              ) {
                if (v) {
                  //快速开户-添加页面
                  quickDeal.clearAwayAll();
                  $("#verifyCodeFlag").html("");
                  //$("#form3").find("input[class='nextbutton white']").attr("disabled", ""); //回复保存按钮
                  $("#quickDealId")
                    .find("#quick_submit_bit")
                    .removeAttr("disabled"); //完成注册置为有效
                  $("#quickDealId")
                    .find("#quick_submit_bit")
                    .css("backgroundPosition", "-100px 0px");
                } else {
                  //车辆管理页面
                  //$.ligerDialog.warn("添加成功！", "提示",function(){
                  changeToFirstMenu("vehicle_manager");
                  //});
                }
              });
            }
          }
        }
      );
    }
  },
  //修改保存
  update: function() {
    var _this = this;
    _this.isAddCar = 1;
    _this.toggleSmsVerify();
    //日期验证
    var oftime = $("#outfactorytime").val();
    var etime = $("#insuranceexpiratetime").val();
    var contractTime = $("#contractExpireTime").val(); // 服务合同到期时间
    var validDateCheck = $("#validDateCheck").val();

    var drivecardReleaseDate = $("#drivecardReleaseDate").val(); // 行驶证发证日期
    if (drivecardReleaseDate != null && drivecardReleaseDate != "") {
      $("#drivecardReleaseDateh").val(date2utc(drivecardReleaseDate));
    } else {
      //add haoyanhui 2017.8.29
      $("#drivecardReleaseDateh").val("");
    }

    if (oftime != "" && oftime != null) {
      $("#outfactorytimeh").val(date2utc(oftime));
    }
    if (etime != "" && etime != null) {
      $("#insuranceexpiratetimeh").val(date2utc(etime));
    }
    if (contractTime != null && contractTime != "") {
      $("#contractExpireTimeh").val(date2utc(contractTime));
    }
    if (null != validDateCheck && validDateCheck != "") {
      var toNumValidDateCheck = date2utc(validDateCheck + "-01");
      if (0 != toNumValidDateCheck) {
        $("#validDateCheckh").val(date2utc(validDateCheck + "-01"));
      } else {
        _this.scrollToFirstError();
        return false;
      }
    }
    //验证车辆登记证、车辆合格证或行驶证、车身照片图片类型
    if (!_this.checkVehiclePics()) {
      _this.scrollToFirstError();
      return false;
    }
    //设置保险类型
    _this.setTpstr();

    //表单验证
    var v00 = _this.form00Validate().form(); //服务商信息form
    var v2;
    if ($("#auditStatus").val() != 1) {
      //form123; 不是已审核的车辆不验证车牌号,VIN,道路运输证号,所属地,车牌颜色
      v2 = _this.formValidate_Different().form();
    } else {
      v2 = true;
    }
    var v3 = _this.formValidate123().form(); //form123;
    var v1 = _this.validatePlateColorNull(_this.$plateColorId); // 验证车牌颜色是否为空

    var v4 = _this.checkVehicleTon(); //检查车辆质量信息入口
    var v5 = _this.checkVehicleSize(); //检查车辆尺寸入口
    var v6 = _this.validateVBrandName(); //验证车辆品牌
    var v7 = _this.setVBrandCode(); //验证车辆品牌CODE是否赋值成功
    var v8 = _this.drivecardReleaseDateValidat(); //发证日期校验 add 2017.8.8
    var v9 = _this.engineNoValidat(); //发动机号校验 add 2017.8.8
    var v10 = _this.engineTypeValidat(); //发动机型号校验 add 2017.8.8

    if (!_this.validRequiredInfo()) {
      //验证 【车辆识别代码/车架号】与【车牌号、车牌颜色】二者至少填一项；【核定载质量】与【准牵引总质量】二者至少填一项
      _this.scrollToFirstError();
      return false;
    }
    if (!v1) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v4) {
      // 验证检查车辆质量信息、验证车辆外廓货厢内部尺寸信息
      _this.scrollToFirstError();
      return false;
    }
    if (!v5) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v00) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v2) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v3) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v6) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v7) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v8) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v9) {
      _this.scrollToFirstError();
      return false;
    }
    if (!v10) {
      _this.scrollToFirstError();
      return false;
    }

    if (
      _this.smsV === "1" &&
      $("#verifyCodeFlag")
        .html()
        .indexOf("right.gif") < 0
    ) {
      if (
        _this.vehicleOwnerPhoneOld != $("#vehicleOwnerPhone").val() ||
        _this.vehicleNoOld.toUpperCase() !=
          _this.$vehicleNoId.val().toUpperCase()
      ) {
        _this.scrollToFirstError();
        return false;
      }
    }

    var msg = "确认修改车辆?";
    var vehicleFlag = 0;
    //已审核的车辆不验证车牌号,VIN,道路运输证号,所属地,车牌颜色
    if ($("#auditStatus").val() != 1) {
      var vin = _this.$vinCode;
      var vehicleNo = _this.$vehicleNoId;
      //车牌号，VIN验证
      if (
        vin.val().length > 0 &&
        vin.val().length != 17 &&
        vin.val().length != 8 &&
        vin.val().length != 18
      ) {
        $.ligerDialog.error("请输入正确的车架号！");
        _this.scrollToFirstError();
        return false;
      }
      //车架号唯一性验证
      if (!_this.vinCodeValidate()) {
        _this.scrollToFirstError();
        return false;
      }
      if (vehicleNo.val().length > 8 && vin.val() != vehicleNo.val()) {
        $.ligerDialog.error("请输入正确的车牌号！");
        _this.scrollToFirstError();
        return false;
      }
      if (
        (vehicleNo.val().length == 7 || vehicleNo.val().length == 8) &&
        vin.val() != vehicleNo.val()
      ) {
        //车牌号必填，设置为大写
        vehicleNo.val(vehicleNo.val().toUpperCase());
      }
      //当车牌号为省缩写时处理
      var businessCode = /^[-a-zA-Z0-9]+$/;
      if (
        (vin.val().length == 8 ||
          vin.val().length == 17 ||
          vin.val().length == 18) &&
        businessCode.test(vin.val()) &&
        vehicleNo.val().length == 1 &&
        vehicleNo.val() == KCPT.shortName
      ) {
        vehicleNo.val("");
      }

      //将VIN赋值给车牌号
      if (vin.val().length > 0 && vehicleNo.val().length == 0) {
        vehicleNo.val(vin.val()); //将车辆识别代码/车架号作为车牌号
        msg =
          "因【车牌号】为空,将以【车架号】作为【车牌号】<br/><br/>是否修改车辆信息?";
        vehicleFlag = 1;
      }

      //车牌号与车牌颜色验证唯一
      if (!_this.vehicleValidate()) {
        _this.scrollToFirstError();
        return false;
      }

      //SIM卡号唯一性验证
      if (!_this.commaddrValidate()) {
        _this.scrollToFirstError();
        return false;
      }

      if (!_this.isAutoComplete && !v6) {
        _this.scrollToFirstError();
        $.ligerDialog.error("车辆品牌识别失败，请重新录入！");
        return false;
      }

      //燃料种类为电时，车牌号只能为8位
      if (
        $("#plateColorId").val() == "5" &&
        vehicleNo.val().length != 8 &&
        vin.val() != vehicleNo.val()
      ) {
        $.ligerDialog.warn("燃料种类为电时，车牌号只能填写8位！", "提示");
        return false;
      }

      //车牌号为8位时，只能选择电类型
      if (
        vehicleNo.val().length == 8 &&
        $("#plateColorId").val() != "5" &&
        vehicleNo.val() != vin.val()
      ) {
        $.ligerDialog.warn("车牌号不符合条件，请重新填写！", "提示");
        return false;
      }
    }
    // 注销计时器
    _this.clearVerifyCodeTimeout();
    //提交
    $.ligerDialog.confirm(msg, function(yes) {
      if (yes) {
        if (
          quickDeal.vehicleProdNameOld != "" &&
          quickDeal.vehicleProdNameOld != $("#prodCodeText").val()
        ) {
          $("#prodCode").val("");
        } else if (quickDeal.vehicleProdNameOld == $("#prodCodeText").val()) {
          $("#prodCode").val(quickDeal.vehicleProdCodeOld);
        }

        //保存图片
        //$("#form3").find("input[class='nextbutton white']").attr("disabled", "disabled"); //灰化保存按钮
        $("#quickDealId")
          .find("#quick_submit_bit")
          .attr("disabled", true); //完成注册置为无效
        $("#quickDealId")
          .find("#quick_submit_bit")
          .css("backgroundPosition", "-100px -50px");

        //特殊运输企业
        if (_this.isTransEntSpecial == 1) {
          $("#companyname1").val(
            $("#companyname2")
              .find("option:selected")
              .text()
          );
        }

        /**modify haoyanhui 2017.7.19 如果没有上传图片就不走上传图片逻辑**/
        var b = _this.checkHasPics(); //true是有上传图片，false是4个图片都没有
        if (b) {
          //需要上传图片
          var loadMsg = "正在上传附件, 请耐心等待...";
          if (!b) {
            loadMsg = "数据处理中,请耐心等待...";
          }
          //加载页面展开
          $("#mainDivContent").A_Window({
            // 弹出层的父类的id
            id: "vehicleWaitingWin",
            dragabId: "mainDivContent", // 可拖动的范围
            width: 400, // 宽度
            height: 100, // 高度 popClose
            html:
              '<div style="text-align: center;">' +
              '<div style="line-height: 50px;">' +
              loadMsg +
              "</div>" +
              '<img alt="' +
              loadMsg +
              '" src="images/global/progressBar.gif"/>' +
              "</div>" // 目标页面或action的地址
          });
          $("#mainDivContent").show_A_Window();

          //把源站代理页面传到服务端调用，解决js无法获取跨域的iframe的内容
          var formObj = $("#form123");
          var input_domain =
            '<input type="hidden" name="currentDomain" value="' +
            (KCPT.carDomain +
              "/carApp/model/quickdeal/CrossDomainIframeProxy.html#") +
            '" />';
          formObj.append(input_domain);
          formObj.attr(
            "action",
            KCPT.imgDomain + "/carApp/quick/saveImage2.action"
          );
          formObj.submit();
          _this.saveImageTimeout();
        } else {
          //没有要上传的图片，直接保存车基础信息
          var message = {};
          _this.callbackSaveImage(message);
        }
      } else {
        if (vehicleFlag == 1) {
          vehicleNo.val(KCPT.shortName);
        }
      }
    });
  },
  saveImageTimeout: function() {
    var _this = this;
    _this.timer = setInterval(function() {
      if (_this.isSaveImageTimeout) {
        //关闭加载滚动条
        $("#mainDivContent").close_A_Window({
          id: "vehicleWaitingWin"
        });
        $.ligerDialog.warn("上传附件超时，请重试", "提示");
        clearTimeout(_this.timer);
      }
    }, _this.timeouttime);
  },

  callbackUpdateCar: function(data) {
    quickDeal.isSaveImageTimeout = false;
    clearTimeout(quickDeal.timer);

    //关闭加载滚动条
    $("#mainDivContent").close_A_Window({
      id: "vehicleWaitingWin"
    });
    if (data != null && data.error != null && data.error != "") {
      //$("#form3").find("input[class='nextbutton white']").attr("disabled", ""); //回复保存按钮
      $("#quickDealId")
        .find("#quick_submit_bit")
        .removeAttr("disabled"); //完成注册置为有效
      $("#quickDealId")
        .find("#quick_submit_bit")
        .css("backgroundPosition", "-100px 0px");
      if (
        data.error[0].errorMessage != null &&
        data.error[0].errorMessage != ""
      ) {
        $.ligerDialog.warn(decodeURI(data.error[0].errorMessage), "提示");
      }
    } else {
      //序列化基本信息
      var entData = "tbVehicle.entId=" + $("#hiddenEntId").val();
      var vehicleData = $("#form123").serialize();
      if ($("#opPlatformId").val() != undefined) {
        vehicleData += "&tbVehicle.opPlatformId=" + $("#opPlatformId").val();
      }
      if ($("#transEntId").val() != undefined) {
        //运输企业
        vehicleData += "&tbVehicle.transEntId=" + $("#transEntId").val();
      }
      // 服务合同到期时间
      if ($("#contractExpireTimeh").val() != undefined) {
        vehicleData +=
          "&tbVehicle.contractExpireTime=" + $("#contractExpireTimeh").val();
      }
      vehicleData += "&tbVehicle.pointId=" + $("#opPlatformPointId").val();
      vehicleData += "&tbVehicle.newSeq=" + $("#newSeq").val();
      vehicleData += "&tbVehicle.oldSeq=" + $("#oldSeq").val();
      vehicleData += "&authCode=" + $("#verifycode").val();
      vehicleData += "&vehicleOwnerPhoneOld=" + quickDeal.vehicleOwnerPhoneOld;

      //已审核的车辆不验证车牌号,VIN,道路运输证号,所属地,车牌颜色
      if ($("#auditStatus").val() == 1) {
        //vehicleData+="&tbVehicle.county="+$("#countyHidden").val();
        vehicleData += "&tbVehicle.cityId=" + $("#cityHidden").val();
        vehicleData += "&tbVehicle.plateColor=" + $("#platColorHidden").val();
      }

      //已定位车辆    add  haoyanhui 2017.4.5
      if (this.FirstPositionFlag > 0) {
        vehicleData += "&tbVehicle.firstPositionFlag=" + this.FirstPositionFlag;
        if ($("#auditStatus").val() != 1) {
          //不是已审核的车（审核的已经拼完参数了）
          vehicleData += "&tbVehicle.plateColor=" + $("#platColorHidden").val();
        }
      }

      var datas = entData + "&" + vehicleData;

      if (
        data != null &&
        data.path1 != null &&
        data.path1 != "" &&
        data.type1 != null &&
        data.type1 != ""
      ) {
        datas +=
          "&path1=" +
          data.path1 +
          "&type1=" +
          data.type1 +
          "&attachId1=" +
          $("#attachId1").val();
      }
      if (
        data != null &&
        data.path2 != null &&
        data.path2 != "" &&
        data.type2 != null &&
        data.type2 != ""
      ) {
        datas +=
          "&path2=" +
          data.path2 +
          "&type2=" +
          data.type2 +
          "&attachId2=" +
          $("#attachId2").val();
      }
      if (
        data != null &&
        data.path3 != null &&
        data.path3 != "" &&
        data.type3 != null &&
        data.type3 != ""
      ) {
        datas +=
          "&path3=" +
          data.path3 +
          "&type3=" +
          data.type3 +
          "&attachId3=" +
          $("#attachId3").val();
      }
      if (
        data != null &&
        data.path4 != null &&
        data.path4 != "" &&
        data.type4 != null &&
        data.type4 != ""
      ) {
        datas +=
          "&path4=" +
          data.path4 +
          "&type4=" +
          data.type4 +
          "&attachId4=" +
          $("#attachId4").val();
      }
      var vehicleNo = $("#vehicleNoId").val();
      //更新车、卡、终端基本信息
      JAjax(
        "quick/updateVehicleTerminalSim.action?vehicleNO=" +
          vehicleNo +
          "&userName=" +
          KCPT.user.opLoginname,
        datas,
        "json",
        function(data) {
          if (data != null && data.error != null && data.error != "") {
            if (
              data.error[0].errorMessage != null &&
              data.error[0].errorMessage != ""
            ) {
              //$("#form3").find("input[class='nextbutton white']").attr("disabled", ""); // 回复保存按钮
              $("#quickDealId")
                .find("#quick_submit_bit")
                .removeAttr("disabled"); // 完成注册置为有效
              $("#quickDealId")
                .find("#quick_submit_bit")
                .css("backgroundPosition", "-100px 0px");
              $.ligerDialog.warn(data.error[0].errorMessage, "提示");
            }
          } else {
            changeToFirstMenu("vehicle_manager");
            $.ligerDialog.warn(data.displayMessage, "提示");
          }
        }
      );
    }
  },

  //设置保险类型
  setTpstr: function() {
    var _this = this;
    var tpstr = "";
    var fir = $("#tinsuranceType1").attr("checked");
    var sec = $("#tinsuranceType2").attr("checked");
    var thr = $("#tinsuranceType3").attr("checked");
    var fou = $("#tinsuranceType4").attr("checked");
    var fiv = $("#tinsuranceType5").attr("checked");
    var six = $("#tinsuranceType6").attr("checked");
    if (fir) {
      tpstr += "1,";
    }
    if (sec) {
      tpstr += "2,";
    }
    if (thr) {
      tpstr += "3,";
    }
    if (fou) {
      tpstr += "4,";
    }
    if (fiv) {
      tpstr += "5,";
    }
    if (six) {
      tpstr += "6,";
    }
    $("#insurancetype").val(tpstr);
    var otherTypeFlag = $("#otherCheckIType").attr("checked");
    if (!otherTypeFlag) {
      $("#otherCheckInsuranceType").val("");
    }
  },
  onResize: function(height) {
    var _this = this;
    if (height) {
      $("#quickDealId").height(height);
    } else {
      var center = getHeightAndWidth();
      $("#quickDealId").height(center.height - 33);
    }
  },
  //上传文件验证
  fileValidate: function(fileId, fileTypeId) {
    var _this = this;
    var file = $("#" + fileId).val();
    if (file == null || file.length == 0) {
      $("#span_" + fileId).html("");
      return true;
    }
    var temp = file.split(".");
    if (temp.length > 0) {
      var fileType = temp[new Number(temp.length) - 1];
      $("#" + fileTypeId).val(fileType);
      if (_this.AllowExt.indexOf(fileType) == -1) {
        //判断文件类型是否允许上传
        $("#span_" + fileId).html("文件类型有误！");
        return false;
      } else {
        $("#span_" + fileId).html("");
        return true;
      }
    } else {
      $("#span_" + fileId).html("");
      return true;
    }
  },
  form00Validate: function() {
    var _this = this;
    _this.addForm00Validate = $("#form00").validate({
      debug: false,
      rules: {
        "tbVehicle.opPlatformId": {
          required: true
        },
        "tbVehicle.pointId": {
          required: true
        }
      },
      errorPlacement: function(error, element) {
        error.appendTo(element.next());
      }
    });
    return _this.addForm00Validate;
  },

  formValidate_Different: function() {
    var _this = this;
    _this.addFormValidateDifferent = $("#form123").validate({
      debug: false,
      rules: {
        "tbVehicle.vehicleNo": {
          vehicleNo: true,
          vehicleNo_first: true
        },
        "tbVehicle.roadTransport": {
          intNumber: true,
          maxlength: 20
        },
        "tbVehicle.vinCode": {
          letterNumberOrLine: true,
          minlength: 8,
          maxlength: 18,
          remote: {
            url: "operationSupport/isUniqueForVehicleVinCode.action",
            type: "post",
            dataType: "json",
            data: {
              "tbVehicle.vid": function(dataJson) {
                return $("#vehicle-hidden-vid").val();
              }
            }
          }
        }
      },
      messages: {
        "tbVehicle.vinCode": {
          remote: jQuery.format("车辆识别代码/车架号已存在！")
        }
      },
      errorPlacement: function(error, element) {
        if (element.attr("id") == "vehicleNoId") {
          error.appendTo(element.parent("li").find("#vnoAndColErrorMsg"));
        } else {
          error.appendTo(element.next());
        }
      }
    });
    return _this.addFormValidateDifferent;
  },
  //车牌号和vin不再在元素上直接做验证,对于未审核的车辆和新加车,form1用此验证
  formValidate123: function() {
    var _this = this;
    _this.addFormValidate = $("#form123").validate({
      debug: false,
      errorPlacement: function(error, element) {
        error.appendTo(element.next());
      }
    });
    return _this.addFormValidate;
  },

  //根据车辆品牌和车辆型号去后台匹配车辆静态信息，程超
  matchTruckStandardData: function() {
    var vbrandName = $("#vbrandName").val();
    var prodCodeText = $("#prodCodeText").val();
    if (
      vbrandName == null ||
      vbrandName == "" ||
      prodCodeText == null ||
      prodCodeText == ""
    ) {
      return;
    }
    var submitdata = {
      "tbVehicle.vbrandName": vbrandName,
      "tbVehicle.prodCodeText": prodCodeText
    };
    JAjax("quick/matchStandardData.action", submitdata, "json", function(data) {
      if (data != undefined && data != null && data != "") {
        //清空所有文本框
        $("[autoMatchFieldName]").each(function() {
          $(this).val("");
          $(this).unbind("focus");
          $(this).css("display", "");
        });
        $("ul[id$='Select']").each(function() {
          $(this).html("");
          $(this).css("display", "none");
        });
        var doms = $("[autoMatchFieldName]");
        var dom;
        var fieldValue;
        for (var i = 0; i < doms.length; i++) {
          dom = doms[i];
          //获取dom对象的filedName值，也就是对应下拉框的id
          var domFieldName = $(dom).attr("autoMatchFieldName");
          //得到该dom对象所对应的字段值
          fieldValue = data[domFieldName];
          //处理字段不存在的情况
          if (typeof fieldValue == "undefined") {
            fieldValue = "";
          }
          fieldValue = $.trim(fieldValue);
          if (fieldValue.indexOf("/") != -1) {
            //将多个字段的形式，分割成为数组
            var values = fieldValue.split("/");
            //						隐藏input框，赋予input框默认值，显示下拉框
            $(dom).val(values[0]);
            //						$("#" + inputId + "ccHidden").val(values[0]);
            //						$(dom).css("display", "none");
            //						$("#" + inputId + "ccHidden").css("display", "");
            //重新填充ul元素
            var mulitStaticData = [];
            for (var j = 0; j < values.length; j++) {
              var thisLiId = domFieldName + "Select" + j;
              mulitStaticData.push(
                '<li id = "' + thisLiId + '">' + values[j] + "</li>"
              );
            }
            $("#" + domFieldName + "Select").html(mulitStaticData.join(""));
          } else {
            $(dom).val(fieldValue);
          }
        }
        //为所有的填充的文本框绑定focus事件
        $("[autoMatchFieldName]").each(function() {
          $(this).focus(function() {
            $("#" + $(this).attr("id") + "Select").css("display", "");
          });
        }); //为所有的ul重新计算高度，
        $("ul[id$='Select']").each(function() {
          var ulHeight = $("#" + $(this).attr("id") + " li").length * 30;
          ulHeight = ulHeight >= 210 ? 210 : ulHeight;
          $("#" + $(this).attr("id")).height(ulHeight);
        }); //为所有生成的li绑定点击和hover事件
        $("ul[id$='Select'] li").each(function() {
          var liId = $(this)
            .attr("id")
            .replace("Select", "");
          liId = liId.replace(/[0-9]/gi, "");
          $(this).click(function() {
            var liHtmlValue = $(this).html();
            document.getElementById(liId).value = liHtmlValue;
            //								document.getElementById(inputId + "ccHidden").value = liHtmlValue;
            //赋值完后隐藏ul框
            $("#" + liId + "Select").css("display", "none");
          });
          //为li绑定hover事件
          $(this).css("backgroundColor", "#fff");
          $(this).hover(
            function() {
              $(this).css("backgroundColor", "blue");
              $("#" + liId).val($(this).html());
              //							$(this).css('font-size', '13px');
              $(this).css("color", "white");
            },
            function() {
              $(this).css("backgroundColor", "#fff");
              //							$(this).css('font-size', '12px');
              $(this).css("color", "black");
            }
          );
        });
      }
    });
  },

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
  //车辆唯一性验证
  vehicleValidate: function() {
    var _this = this;
    if (_this.isCancelBut) {
      return true;
    }

    var validates = false;
    var validates1 = true;
    if (
      $.trim(_this.$vehicleNoId.val()).length > 0 &&
      $.trim(_this.$plateColorId.val()).length > 0
    ) {
      var vehicleNo = $.trim(_this.$vehicleNoId.val());
      vehicleNo =
        vehicleNo.length == 7 || vehicleNo.length == 8
          ? vehicleNo.toUpperCase()
          : vehicleNo; //若为7位车牌号，则转大写
      var data = {
        "requestParam.equal.vehicleNo": vehicleNo,
        "requestParam.equal.plateColor": _this.$plateColorId.val(),
        "requestParam.noId": $("#vehicle-hidden-vid").val()
      };

      JAjax(
        "operationSupport/isUniqueForVehicleNoAndPlateColor.action",
        data,
        "html",
        function(str) {
          if (str == "true") {
            if ($("#vehicleNoIdForValid").size() > 0) {
              $("#vehicleNoIdForValid").remove();
            }
            if ($("#plateColorIdForValid").size() > 0) {
              $("#plateColorIdForValid").remove();
            }
            validates = true;
          } else {
            if (!($("#vehicleNoIdForValid").size() > 0)) {
              var labelVehicleNo = $(
                "<label id='vehicleNoIdForValid' class='red'>车辆已存在</label>"
              );
              labelVehicleNo.appendTo(_this.$vehicleNoId.next());
            }
            validates = false;
          }
        },
        null,
        true
      );

      var vehicleNoNew = _this.$vehicleNoId.val();
      var plateColorNew = _this.$plateColorId.val();

      if (
        _this.vehicleNoOld != vehicleNoNew ||
        _this.plateColorOld != plateColorNew
      ) {
        //车牌号或车牌颜色变更
        validates1 = _this._isExistsVehicle(data, "车牌号已经存在", validates1);
      }
      return validates & validates1;
    } else {
      if ($("#vehicleNoIdForValid").size() > 0) {
        $("#vehicleNoIdForValid").remove();
      }
      if ($("#plateColorIdForValid").size() > 0) {
        $("#plateColorIdForValid").remove();
      }
      validates = true;
      return validates;
    }
  },
  //SIM卡号唯一性验证
  commaddrValidate: function() {
    var _this = this;
    if (_this.isCancelBut) {
      return true;
    }
    var validates = true;
    var commaddrNew = $("input[name='tbVehicle.commaddr']").val(); //SIM卡号

    if (_this.commaddrOld != commaddrNew) {
      var data = {
        "requestParam.equal.commaddr": commaddrNew
      };
      //SIM卡号变更
      validates = _this._isExistsVehicle(data, "SIM卡卡号已经存在", validates);
    }
    return validates;
  },
  //车架号唯一性验证
  vinCodeValidate: function() {
    var _this = this;
    if (_this.isCancelBut) {
      return true;
    }
    var validates = true;
    var vinCodeNew = _this.$vinCode.val(); //卡ID

    if (_this.vinCodeOld != vinCodeNew && vinCodeNew.length >= 8) {
      var data = {
        "requestParam.equal.vinCode": vinCodeNew
      };
      //车架号变更
      validates = _this._isExistsVehicle(
        data,
        "车辆识别代码/车架号已经存在",
        validates
      );
    }
    return validates;
  },
  //
  _isExistsVehicle: function(data, errorMsg, validates) {
    var _this = this;
    JAjax(
      "operationSupport/isExistsVehicle.action",
      data,
      "json",
      function(json) {
        var objArray = eval(json);
        if (objArray.length > 0) {
          var obj = objArray[0];
          var msg = "";
          if (obj.vehicleBelongType === "2") {
            msg = errorMsg + window.serviceunit.hintContent;
            $.ligerDialog.warn(msg, "提示");
            validates = false;
          } else if (obj.vehicleBelongType === "1") {
            var msgtemp = "";
            if (obj.entNameBelong) {
              msg = "该车已属于：" + obj.entNameBelong;
            } else {
              msg = errorMsg;
            }
            if (obj.csMobile) {
              msgtemp += "<br/>联系人手机：" + obj.csMobile;
            }
            if (obj.csTel) {
              msgtemp += "<br/>联系人电话：" + obj.csTel;
            }
            if (msgtemp == "") {
              msg += window.serviceunit.hintContent;
            } else {
              msg += msgtemp;
            }
            $.ligerDialog.warn(msg, "提示");
            validates = false;
          } else {
            msg = "输入重复数据次数过多" + window.serviceunit.hintContent;
            $.ligerDialog.warn(msg, "提示");
            validates = false;
          }
        }
      },
      null,
      true
    );
    return validates;
  },
  //服务商平台列表
  initPlatform: function() {
    var _this = this;
    //先判断当前登录用户是不是平台用户,如果是不可以选择平台
    var _opid = KCPT.user.opId; //用户ID
    var _oppid = KCPT.user.platformId;

    //服务商
    if (_oppid !== "") {
      $("#headId").text("服务商信息");
      $("#contractExpireTimeLi").show();
      JAjax(
        "operationSupport/findOperatorPlatformSelectList.action",
        null,
        "json",
        function(json) {
          var objArray = eval(json);
          $("#opPlatformSelectParentId").empty();
          var _html = "";
          for (var i = 0; i < objArray.length; i++) {
            var obj = objArray[i];
            if (obj.platformId != undefined && obj.platformId == _oppid) {
              //最大显示18个汉字，
              _html +=
                strLength(obj.platformName) > 34
                  ? subStrLength(obj.platformName, 34) + ".."
                  : obj.platformName;
              $("#opPlatformSelectParentId").attr("title", obj.platformName);
              //联系人手机号变更判断
              if (obj.smsVerify === "0") {
                _this.phoneContantsHtmlShow();
              } else {
                _this.phoneContantsHtmlHide();
              }
              //城市锁定判断
              if (obj.cityLock === "1") {
                if (_this.g_city !== "") {
                  KCPT.CodeManager.selectProCityCountryChange(
                    "areaCodeId",
                    _this.g_areaCode,
                    "cityIdId",
                    _this.g_city,
                    "countyId",
                    _this.g_county
                  );
                  $("#cityIdId").css("display", "none");
                  $("#cityName").html(
                    $("#cityIdId")
                      .find("option:selected")
                      .text() + "&nbsp;&nbsp;"
                  );
                } else {
                  $(
                    "#cityIdId option[value=" + KCPT.user.platformCity + "]"
                  ).attr("selected", true);
                  $("#cityIdId").css("display", "none");
                  $("#cityName").html(
                    $("#cityIdId")
                      .find("option:selected")
                      .text() + "&nbsp;&nbsp;"
                  );
                  KCPT.CodeManager.getCountryList(
                    KCPT.user.platformCity,
                    "areaCodeId",
                    "countyId"
                  );
                }
              }
            }
          }
          _html +=
            "<input type='hidden' id='opPlatformId' name='tbVehicle.opPlatformId' value='" +
            _oppid +
            "' />";
          $("#opPlatformSelectParentId").append(_html);
        },
        null,
        true
      );
    } else {
      $("#headId").text("运输企业");
      $("#contractExpireTimeLi").hide();
      JAjax(
        "operationSupport/findTransportSelectList.action",
        null,
        "json",
        function(json) {
          $("#opPlatformSelectParentId").empty();
          var _html = "";
          var obj = json[0];
          //最大显示18个汉字，
          _html +=
            strLength(obj.applyUnit) > 34
              ? subStrLength(obj.applyUnit, 34) + ".."
              : obj.applyUnit;
          $("#opPlatformSelectParentId").attr("title", obj.applyUnit);
          //联系人手机号变更判断
          //if(obj.smsVerify === "0"){
          //	_this.smsV = "1";
          //	$(".smsverify").show();
          //}else{
          _this.phoneContantsHtmlHide();
          //}
          //城市锁定判断
          if (obj.cityLock === "1") {
            if (_this.g_city !== "") {
              KCPT.CodeManager.selectProCityCountryChange(
                "areaCodeId",
                _this.g_areaCode,
                "cityIdId",
                _this.g_city,
                "countyId",
                _this.g_county
              );
              $("#cityIdId").css("display", "none");
              $("#cityName").html(
                $("#cityIdId")
                  .find("option:selected")
                  .text() + "&nbsp;&nbsp;"
              );
            } else {
              $("#cityIdId option[value=" + KCPT.user.platformCity + "]").attr(
                "selected",
                true
              );
              $("#cityIdId").css("display", "none");
              $("#cityName").html(
                $("#cityIdId")
                  .find("option:selected")
                  .text() + "&nbsp;&nbsp;"
              );
              KCPT.CodeManager.getCountryList(
                KCPT.user.platformCity,
                "areaCodeId",
                "countyId"
              );
            }
          }

          if (obj.isTransEntSpecial == 1) {
            _this.isTransEntSpecial = 1;
            var subOrges = obj.subOrges;
            var options = "";
            for (var i = 0; i < subOrges.length; i++) {
              var entName = subOrges[i].entName;
              options +=
                "<option value='" + entName + "'>" + entName + "</option>";
            }
            $("#companyname1").hide();
            $("#companyname2").append(options);
            $("#companyname2").show();
          }
          _html +=
            "<input type='hidden' id='transEntId' name='tbVehicle.transEntId' value='" +
            KCPT.user.transportId +
            "' />";
          $("#opPlatformSelectParentId").append(_html);
        },
        null,
        true
      );
    }
    //没有车主姓名为新增，有姓名为修改
    if ($("#vehicleOwnerName").val() == "") {
      _this.setPointIpPort(_oppid, null);
    }
  },
  phoneContantsHtmlHide: function() {
    var _this = this;
    _this.smsV = "";
    $("#moveli").removeAttr("style");
    $("#removeli").hide();
    $(".smsverify").hide();
  },
  phoneContantsHtmlShow: function() {
    var _this = this;
    _this.smsV = "1";
    $("#moveli").css("width", "888px");
    $("#removeli").show();
    $(".smsverify").show();
  },
  setPointIpPort: function(platformId, pointId) {
    //远程获取服务商接入点,platformId为服务商ID,pointId为默认选中接入点
    JAjax(
      "operatorPlatform/findAccessPointListByPlatformId.action",
      null,
      "json",
      function(data) {
        if (data != null) {
          $("#opPlatformPointId").html("");
          var ipPorts = {};
          var options = "";
          $.each(data, function(k, v) {
            if (k == 0) {
              //默认选中第一个,所以显示第一项的IP和端口
              $("#point_adds").html(v.ip);
              $("#point_port").html(v.port);
              $("#newSeq").val(v.pointSeq);
              $("#oldSeq").val(v.pointSeq);
            }
            var selected = "";
            if (pointId == v.pointId) {
              selected = "selected";
              $("#point_adds").html(v.ip);
              $("#point_port").html(v.port);
              $("#newSeq").val(v.pointSeq);
              $("#oldSeq").val(v.pointSeq);
            }
            ipPorts[v.pointId] = [v.ip, v.port, v.pointSeq];
            options +=
              "<option value='" +
              v.pointId +
              "' pointSeq='" +
              v.pointSeq +
              "' " +
              selected +
              ">" +
              v.pointName +
              "</option>";
          });
          KCPT.ipPorts = ipPorts;
          $("#opPlatformPointId").html(options);
        }
      },
      function() {}
    );
  },
  initDetail: function(vid) {
    //初始化详情
    var _this = this;
    var data = {
      "tbVehicle.vid": vid
    };
    JAjax(
      "quick/findEditDataToJson.action",
      data,
      "json",
      function(json) {
        _this.assignment(json.Rows[0]);
        _this.assignment1(json.Rows[0]);
      },
      null,
      true
    );
  },
  assignment: function(row) {
    var _this = this;
    if (row != null) {
      if (row.areaCode != null) {
        //所属省
        if (KCPT.user.platformProvince != row.areaCode) {
          row.areaCode = KCPT.user.platformProvince;
          row.county = null;
        }
        $("#areaCodeId").val(row.areaCode);
        _this.areaCode = row.areaCode;
        KCPT.CodeManager.getCityList(row.areaCode, "cityIdId"); // 市
      }
      // 服务合同到期时间
      if (row.contractExpireTime != "" && row.contractExpireTime != null) {
        var contractExpireTimeDt = utc2Date(row.contractExpireTime).substring(
          0,
          10
        );
        $("#contractExpireTime").val(contractExpireTimeDt);
      }

      //燃料类型 2017.12.20
      if (row.flueType == "3") {
        //电
        $("#plateColorId")
          .find("option")
          .remove();
        $("#plateColorId").prepend("<option value='5'>黄绿色</option>");
      } else {
        $("#plateColorId")
          .find("option[value='5']")
          .remove(); //删掉黄绿色
      }
      if (row.plateColor != null) {
        // 车牌颜色
        // 编辑页面-车牌颜色若非开放的车牌颜色，添加“请选择”
        var flag = $.inArray(row.plateColor, _this.getRemovePlateColors()) >= 0;
        if (flag) {
          var html = _this.$plateColorId.html();
          html = '<option value="">请选择</option>' + html;
          _this.$plateColorId.html(html);
          _this.$plateColorId.find("option[value='2']").removeAttr("selected"); // 去除黄色选中
          _this.$plateColorId
            .find("option[value='']")
            .attr("selected", "selected"); // 选中 请选择
        } else {
          _this.$plateColorId
            .find("option[value='" + row.plateColor + "']")
            .attr("selected", "selected");
        }
      }
      if (_this.isTransEntSpecial == 1) {
        var length = $("#companyname2").find(
          "option[value='" + row.companyname + "']"
        ).length;
        if (length == 0) {
          var options =
            "<option value='" +
            row.companyname +
            "'>" +
            row.companyname +
            "</option>";
          $("#companyname2").append(options);
        }
        $("#companyname2")
          .find("option[value='" + row.companyname + "']")
          .attr("selected", "selected"); // 选中 请选择
      }
      if (row.vbrandCode != null) {
        //车辆品牌
        $("#vbrandCode").val(row.vbrandCode);
        //_this.findListProductType(row.prodCode);// 车型
      }
      if (row.oiltypeId != null) {
        //燃油类型
        $("#oiltypeId").val(row.oiltypeId);
      }
      if (row.transtypeCode != null) {
        //行业类型
        $("#transtypeCodeId").val(row.transtypeCode);
      }
      if (row.outFactoryTime != null) {
        //车辆出厂时间
        $("#outfactorytime").val(utc2Date(row.outFactoryTime).substring(0, 10));
      }
      if (row.insuranceExpirateTime != null) {
        //车辆保险到期时间
        $("#insuranceexpiratetime").val(
          utc2Date(row.insuranceExpirateTime).substring(0, 10)
        );
      }
      /*
			if (row.outFactoryTime != null) { //车辆验车时间
				$("#inspectTime").val(utc2Date(row.inspectTime).substring(0,10));
			}*/
      if (row.checkValidtoTime != "" && row.checkValidtoTime != null) {
        //检验有效期至
        var validDateCheck_dd = utc2Date(row.checkValidtoTime).substring(0, 10);
        if (validDateCheck_dd.length >= 7) {
          $("#validDateCheck").val(validDateCheck_dd.substring(0, 7));
        }
      }
      if (row.opPlatformId != null && row.opPlatformId != "") {
        //平台名称
        $("#opPlatformId").val(row.opPlatformId);
        //接入点
        if (row.pointId != null && row.pointId != "") {
          _this.setPointIpPort(row.opPlatformId, row.pointId);
        }
      }
      if (row.transEntId != null && row.transEntId != "") {
        //平台名称
        $("#opPlatformId").val(row.transEntId);
        //接入点
        if (row.pointId != null && row.pointId != "") {
          _this.setPointIpPort(row.transEntId, row.pointId);
        }
      }
      if (row.purchaseType != null) {
        $("#tbVehicle_purchaseType").val(row.purchaseType);
      }
      if (row.cityId != null) {
        //所属市
        _this.g_city = row.cityId;
        _this.g_areaCode = row.areaCode;
        _this.vehicle_cityId = row.cityId;

        var _county = null;
        if (row.county != null) {
          _county = row.county;
          _this.g_county = row.county;
        }
        KCPT.CodeManager.selectProCityCountryChange(
          "areaCodeId",
          row.areaCode,
          "cityIdId",
          row.cityId,
          "countyId",
          _county
        );
      }
      if (row.insuranceType != null) {
        //车辆保险种类
        var vStr = row.insuranceType.split(",");
        for (var i = 0; i < vStr.length; i++) {
          var temp = vStr[i];
          if (temp.length > 0) {
            $("#tinsuranceType" + temp).attr("checked", true);
          }
        }
        $("#insurancetype").val(row.insuranceType);
      }
      if (row.insuranceTypeOther != null && row.insuranceTypeOther != "") {
        $("#otherCheckIType").attr("checked", true);
        $("#otherCheckInsuranceType").css("display", "");
        $("#otherCheckInsuranceType").val(row.insuranceTypeOther);
      }
      if (row.flueType == "" || row.flueType == "0") {
        $("#fule_type option[value='1']").attr("selected", "selected");
      } else {
        $("#fule_type option[value='" + row.flueType + "']").attr(
          "selected",
          "selected"
        );
      }
      if (row.vehicleType != null) {
        //车辆类型
        $("#vehicleTypeId").val(row.vehicleType);
      }
      _this.vehicleAuditStatus = row.auditStatus; //用于判断如何显示车辆县级下拉
      //已审核车辆不允许修改: 道路运输证号、车牌号码、车牌颜色、车架号、所属地区，燃料种类
      if (row.auditStatus == 1) {
        if (row.flueType == "3") {
          $("#fule_type").css("background-color", "#e5e5e5");
          $("#fule_type").attr("disabled", true);
        } else {
          $("#fule_type option[value='3']").remove();
        }
        $("#roadTransport").css("background-color", "#e5e5e5");
        _this.$vehicleNoId.css("background-color", "#e5e5e5");
        if (_this.$vinCode.val().length > 0) {
          // 已填写VIN不可修改
          _this.$vinCode
            .css("background-color", "#e5e5e5")
            .attr("cssClass", "");
          _this.$vinCode.attr("readonly", true);
        } else {
          // 未填写VIN可以修改，再次编辑重新变为不可修改
          _this.$vinCode.removeAttr("readonly");
          _this.$vinCode.css("background-color", "#fff");
        }
        _this.$plateColorId
          .css("background-color", "#e5e5e5")
          .attr("cssClass", "");
        $("#cityIdId").css("background-color", "#e5e5e5");
        $("#countyId").css("background-color", "#e5e5e5");

        $("#countyHidden").val($("#countyId").val());
        $("#cityHidden").val($("#cityIdId").val());
        $("#platColorHidden").val(_this.$plateColorId.val());

        $("#roadTransport").attr("readonly", true);
        _this.$vehicleNoId.attr("readonly", true);
        $("#countyId").attr("disabled", true);
        $("#cityIdId").attr("disabled", true);
        _this.$plateColorId.attr("disabled", true);
      }

      //已定位车辆不允许修改: （车牌号！=车架号的） 车牌号码、车牌颜色，燃料种类    add by  haoyanhui 2017.4.5
      if (
        row.firstPositionFlag != null &&
        row.firstPositionFlag != undefined &&
        row.firstPositionFlag > 0 &&
        row.vinCode != row.vehicleNo
      ) {
        if (row.flueType == "3") {
          $("#fule_type").css("background-color", "#e5e5e5");
          $("#fule_type").attr("disabled", true);
        } else {
          $("#fule_type option[value='3']").remove();
        }
        _this.$vehicleNoId.css("background-color", "#e5e5e5");
        _this.$plateColorId
          .css("background-color", "#e5e5e5")
          .attr("cssClass", "");

        _this.FirstPositionFlag = row.firstPositionFlag;
        $("#platColorHidden").val(_this.$plateColorId.val());

        _this.$vehicleNoId.attr("readonly", true);
        _this.$plateColorId.attr("disabled", true);
      }

      _this.vehicleNoOld = _this.$vehicleNoId.val();
      _this.vehicleOwnerPhoneOld = $("#vehicleOwnerPhone").val();
      _this.plateColorOld = _this.$plateColorId.val();
      _this.vinCodeOld = _this.$vinCode.val();
      _this.commaddrOld = $("input[name='tbVehicle.commaddr']").val();

      //车辆已审核后，下拉被禁用，换成文本
      if (_this.vehicleAuditStatus !== "" && _this.vehicleAuditStatus === "1") {
        KCPT.CodeManager.selectProCityCountryChange(
          "areaCodeId",
          _this.g_areaCode,
          "cityIdId",
          _this.g_city,
          "countyId",
          _this.g_county
        );
        //市级
        $("#cityIdId").css("display", "none");
        $("#cityName").html(
          $("#cityIdId")
            .find("option:selected")
            .text() + "&nbsp;&nbsp;"
        );

        //县级
        $("#countyId").css("display", "none");
        var countyTmp = $("#countyId")
          .find("option:selected")
          .text();
        countyTmp = "--" == countyTmp ? "" : countyTmp;
        $("#countyName").html(countyTmp + "&nbsp;&nbsp;");
        $("#errorId").css("display", "none");
      }

      //行驶证发证日期 add 2017.8.8
      if (row.drivecardReleaseDate != "" && row.drivecardReleaseDate != null) {
        var drivecardReleaseDateDT = utc2Date(
          row.drivecardReleaseDate
        ).substring(0, 10);
        $("#drivecardReleaseDate").val(drivecardReleaseDateDT);
      }
      //add by haoyanhui 2017.8.21
      if (row.plateColor == "1" || row.plateColor == 1) {
        //蓝色
        $("#vehicleDrawTon").val("");
        $("#li_vehicleDrawTon").css("display", "none");
      }
    }
  },
  assignment1: function(row) {
    var _this = this;
    if (row != null) {
      if (row.oemName) {
        //从row中取终端厂家名称和型号，如果有则显示，没有显示“--”
        $("#tbT_oemCode_li").append(row.oemName);
      } else {
        $("#tbT_oemCode_li").append("--");
      }
      if (row.tmodelName) {
        //从row中取终端厂家名称和型号，如果有则显示，没有显示“--”
        $("#tmodelCodeId_li").append(row.tmodelName);
      } else {
        $("#tmodelCodeId_li").append("--");
      }
    } else {
      $("#tbT_oemCode_li").append("--");
      $("#tmodelCodeId_li").append("--");
    }
  },
  LTrim: function(str) {
    var i;
    for (i = 0; i < str.length; i++) {
      if (str.charAt(i) != " " && str.charAt(i) != " ") break;
    }
    str = str.substring(i, str.length);
    return str;
  },
  //验证 【车辆识别代码/车架号】与【车牌号、车牌颜色】二者至少填一项；【核定载质量】与【准牵引总质量】二者至少填一项
  validRequiredInfo: function() {
    var _this = this;
    var vehicleType = "," + $("#vehicleTypeId").val();
    var loadTonSpan = $("#loadTonSpanId");
    var vehicleDrawTonSpan = $("#vehicleDrawTonSpanId");
    var loadTonVal = $.trim($("#loadTon").val()).replace("--", "");
    var vehicleDrawTonVal = $.trim($("#vehicleDrawTon").val()).replace(
      "--",
      ""
    );
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
  // 检查车辆尺寸入口
  checkVehicleSize: function() {
    var _this = this;
    var counter = 0;
    if (
      !_this.validateVehicleLength(
        $("#vehicleLength"),
        "vehicleLengthForValid",
        false,
        true
      )
    ) {
      counter++;
    }
    if (
      !_this.validateVehicleWidthHeight(
        $("#vehicleWidth"),
        "vehicleWidthForValid",
        false,
        1,
        true
      )
    ) {
      counter++;
    }
    if (
      !_this.validateVehicleWidthHeight(
        $("#vehicleHeight"),
        "vehicleHeightForValid",
        false,
        2,
        true
      )
    ) {
      counter++;
    }
    if (
      !_this.validateVehicleLength(
        $("#boxLength"),
        "boxLengthForValid",
        true,
        true
      )
    ) {
      counter++;
    }
    if (
      !_this.validateVehicleWidthHeight(
        $("#boxWidth"),
        "boxWidthForValid",
        true,
        1,
        true
      )
    ) {
      counter++;
    }
    if (
      !_this.validateVehicleWidthHeight(
        $("#boxHeight"),
        "boxHeightForValid",
        true,
        2,
        true
      )
    ) {
      counter++;
    }
    if (counter > 0) {
      return false;
    }
    return true;
  },
  // 检查车辆质量信息入口
  checkVehicleTon: function() {
    var _this = this;
    var counter = 0;
    // 验证总质量
    if (
      !_this.validateVehicleTon($("#vehicleTon"), "vehicleTonForValid", true)
    ) {
      counter++;
    }
    // 验证车辆核定载质量
    if (!_this.validateVehicleTon($("#loadTon"), "loadTonForValid", false)) {
      counter++;
    }
    // 验证准牵引总质量
    if ($("#plateColorId").val() != "1") {
      //车牌号为蓝色时，准牵引总质量不填、不验证  add 2017.8.21
      if (
        !_this.validateVehicleTon(
          $("#vehicleDrawTon"),
          "vehicleDrawTonForValid",
          false
        )
      ) {
        counter++;
      }
    }

    if (counter > 0) {
      return false;
    }
    return true;
  },
  // 检查车辆图片格式
  checkVehiclePics: function() {
    var _this = this;
    var counter = 0;
    if (
      !_this.fileValidate(
        "registrationCertificateFile",
        "registrationCertificateFileType"
      )
    ) {
      counter++;
    }
    //车辆登记证2
    if (
      !_this.fileValidate(
        "registrationCertificateFile2",
        "registrationCertificateFileType2"
      )
    ) {
      counter++;
    }
    //验证车辆合格证或行驶证图片类型
    if (
      !_this.fileValidate("drivingLicOrCertFile", "drivingLicOrCertFileType")
    ) {
      counter++;
    }
    //验证车身照片图片类型
    if (
      !_this.fileValidate("vehicleBodyPhotoFile", "vehicleBodyPhotoFileType")
    ) {
      counter++;
    }
    if (counter > 0) {
      return false;
    }
    return true;
  },
  checkHasPics: function() {
    var ids = "registrationCertificateFile,registrationCertificateFile2,drivingLicOrCertFile,vehicleBodyPhotoFile".split(
      ","
    );
    for (var i = 0; i < ids.length; i++) {
      var value = $("#" + ids[i]).val();
      if (value != null && value != "") {
        return true;
      }
    }
    return false;
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
  /**
   * 检查是否为4位及以上连续重复数字
   * @param tarObj   目标元素
   */
  checkNumSeriesRepeat: function(tarObj) {
    var _this = this;
    if (tarObj) {
      var value = tarObj.val();
      var len = value.length;
      var dt = {},
        tmp;
      for (var i = 0; i < len; i++) {
        tmp = value.charAt(i);
        if (i < len) {
          if (dt[tmp]) {
            if (
              value.charAt(i) != "0" &&
              value.charAt(i) == value.charAt(i - 1)
            ) {
              // 连续重复（去除0）累加1
              dt[tmp] = dt[tmp] + 1;
            } else {
              if (dt[tmp] < _this.repeatNum) {
                // 未满足条件不重置为1
                dt[tmp] = 1;
              }
            }
          } else {
            dt[tmp] = 1;
          }
        }
      }
      for (var i in dt) {
        if (dt[i] >= _this.repeatNum) {
          return false;
        }
      }
      return true;
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
  setVBrandCode: function() {
    var isMatch = false;
    if (KCPT.autocompleteVBrandData) {
      $(KCPT.autocompleteVBrandData).each(function(k, v) {
        var _vbrandName = $("#vbrandName").val();
        if (_vbrandName == v.vbrandName) {
          if (v.vbrandCode) {
            $("#vbrandCode").val(v.vbrandCode);
            isMatch = true;
          }
        }
      });
    } else {
      isMatch = true;
    }

    return isMatch;
  },
  //------- 验证联系人手机BEGIN
  // 获取手机验证码
  getVerifyCode: function() {
    var _this = this;
    var phone = $.trim($("#vehicleOwnerPhone").val()),
      vehicleNo = $.trim(_this.$vehicleNoId.val());
    if (phone.length == 0) {
      $.ligerDialog.error("车辆联系人手机不能为空，请填写");
      return;
    }
    if (!_this.validateVehicleNo(vehicleNo)) {
      $.ligerDialog.error("请输入正确车牌号");
      return false;
    }
    if (!_this.validateVehicleNo_first(vehicleNo)) {
      $.ligerDialog.error("车牌号首位与所在省不一致");
      return false;
    }
    if (!_this.vehicleValidate()) {
      return false;
    }
    _this.clearVerifyCodeTimeout();
    var codeBtn = $("#getVerifyCodeBtn");
    _this.initGetCodeBtnStyle(codeBtn, true);
    var param = {
      "tbVehicle.vehicleOwnerPhone": phone,
      "tbVehicle.vehicleNo": vehicleNo
    };
    $.ajax({
      url: "quick/getVerifyAuthCode.action?r=" + Math.random(),
      type: "POST",
      data: param,
      dataType: "json",
      cache: false,
      async: true,
      success: function(data) {
        if (data != undefined && data != null) {
          if (
            data.error == null ||
            data.error == "" ||
            (data.error[0].errorMessage == null ||
              data.error[0].errorMessage == "")
          ) {
            // 1:验证码已发送，0:发送验证码失败，2:发送验证码间隔超过2分钟，3:手机号格式不正确，4:获取手机号验证码次数限制阀值
            var iR = parseInt(data);
            switch (iR) {
              case 0:
                _this.initGetCodeBtnStyle(codeBtn, false);
                $.ligerDialog.error("发送验证码失败，请重新获取！");
                break;
              case 1:
                //$.ligerDialog.success("验证码已发送，请查收！");
                _this.carOwnerAuthCodeCounter = 0;
                _this.carOwnerAuthCodeTimer = setInterval(
                  "quickDeal.getVerifyAuthCodeTimer()",
                  1000
                );
                break;
              case 2:
                _this.initGetCodeBtnStyle(codeBtn, false);
                $.ligerDialog.error(
                  "获取验证码间隔在" +
                    _this.CAR_OWNER_VERIFY_EXPIRETIME +
                    "秒，请不要频繁获取！"
                );
                break;
              case 3:
                _this.initGetCodeBtnStyle(codeBtn, false);
                $.ligerDialog.error("手机号格式不正确！");
                break;
              case 4:
                _this.initGetCodeBtnStyle(codeBtn, false);
                $.ligerDialog.error("获取验证码次数超过限制，请不要频繁获取！");
                break;
              default:
                _this.initGetCodeBtnStyle(codeBtn, false);
                $.ligerDialog.error("发送验证码失败，请重新获取！");
                break;
            }
          } else {
            $.ligerDialog.error(data.error[0].errorMessage);
            _this.initGetCodeBtnStyle(codeBtn, false);
          }
        } else {
          $.ligerDialog.error("操作失败，请重试！");
          _this.initGetCodeBtnStyle(codeBtn, false);
        }
        return;
      },
      error: function(data) {
        $.ligerDialog.error("系统异常，请联系管理员！");
        _this.initGetCodeBtnStyle(codeBtn, false);
        return;
      }
    });
  },
  // 设置获取手机验证码样式  btnObj:对象  isPressed: true or false 是否按下
  initGetCodeBtnStyle: function(btnObj, isPressed) {
    if (btnObj) {
      if (isPressed) {
        btnObj.attr("disabled", true);
        btnObj.css("backgroundPosition", "-100px -50px");
      } else {
        if (
          $("#verifyCodeFlag")
            .html()
            .indexOf("right.gif") < 0
        ) {
          // 已验证-按钮不恢复
          btnObj.removeAttr("disabled");
        }
        btnObj.css("backgroundPosition", "-100px 0px");
      }
    }
  },
  // 获取手机验证码计时器
  getVerifyAuthCodeTimer: function() {
    var _this = this;
    var html = $("#verifyCodeFlag").html();
    var getVerifyCodeBtn = $("#getVerifyCodeBtn");
    var diff =
      _this.CAR_OWNER_VERIFY_EXPIRETIME - _this.carOwnerAuthCodeCounter;
    _this.carOwnerAuthCodeCounter++;
    if (diff > 0) {
      // 计时持续
      if (html.indexOf("right.gif") < 0) {
        getVerifyCodeBtn.val("已发送  " + diff + "秒");
      } else {
        _this.clearVerifyCodeTimeout();
      }
    } else {
      // 计时结束，清除计时器
      _this.clearVerifyCodeTimeout();
      // 未验证-恢复按钮
      if (html.indexOf("right.gif") < 0) {
        _this.initGetCodeBtnStyle(getVerifyCodeBtn, false);
      }
    }
  },
  // 注销获取验证码计时器
  clearVerifyCodeTimeout: function() {
    var _this = this;
    $("#getVerifyCodeBtn").val("获取验证码");
    clearInterval(_this.carOwnerAuthCodeTimer);
    _this.carOwnerAuthCodeTimer = null;
    _this.carOwnerAuthCodeCounter = 0;
  },
  // 恢复获取验证码按钮和手机号
  resetCodeBtnAndPhone: function(btnObj, phoneObj) {
    if (btnObj && phoneObj) {
      phoneObj.removeAttr("readonly");
      btnObj.removeAttr("disabled");
      btnObj.css("backgroundPosition", "-100px 0px");
    }
  },
  // 验证手机验证码是否正确
  verifyCarOwnerAuthCode: function() {
    var _this = this;
    var phoneObj = $("#vehicleOwnerPhone"),
      codeBtn = $("#getVerifyCodeBtn");
    var phone = $.trim(phoneObj.val()),
      vehicleNo = $.trim(_this.$vehicleNoId.val()),
      authCode = $.trim($("#verifycode").val());
    if (!_this.validateVehicleNo(vehicleNo)) {
      return;
    }
    if (!_this.validateVehicleNo_first(vehicleNo)) {
      return;
    }
    if (!_this.vehicleValidate()) {
      return;
    }
    if (authCode.length == 0) {
      return;
    }
    if (phone.length == 0) {
      $.ligerDialog.error("车主手机不能为空，请填写");
      return;
    }
    var param = {
      "tbVehicle.vehicleNo": vehicleNo,
      "tbVehicle.vehicleOwnerPhone": phone,
      authCode: authCode
    };
    $.ajax({
      url: "quick/verifyAuthCode.action?r=" + Math.random(),
      type: "POST",
      data: param,
      dataType: "json",
      cache: false,
      async: true,
      success: function(data) {
        if (data != undefined && data != null) {
          if (
            data.error == null ||
            data.error == "" ||
            (data.error[0].errorMessage == null ||
              data.error[0].errorMessage == "")
          ) {
            // 0:不正确，1:正确，2:验证次数超过限制
            var $flag = $("#verifyCodeFlag");
            switch (parseInt(data)) {
              case 0:
                $flag.html('<img src="../../images/wrong.gif" title="错误" />');
                _this.resetCodeBtnAndPhone(codeBtn, phoneObj);
                break;
              case 1:
                $flag.html('<img src="../../images/right.gif" title="正确" />');
                codeBtn.attr("disabled", true);
                phoneObj.attr("readonly", true);
                break;
              case 2:
                $flag.html('<img src="../../images/wrong.gif" title="错误" />');
                _this.resetCodeBtnAndPhone(codeBtn, phoneObj);
                $.ligerDialog.error(
                  "您已验证失败" +
                    _this.CAR_OWNER_VERIFY_FAIL_MAXNUM +
                    "次，请重新获取验证码！"
                );
                break;
              case 3:
                $flag.html('<img src="../../images/wrong.gif" title="错误" />');
                _this.resetCodeBtnAndPhone(codeBtn, phoneObj);
                _this.clearVerifyCodeTimeout();
                $.ligerDialog.error("请先获取验证码！");
                break;
              case 4:
                $.ligerDialog.error("手机号格式不正确！");
                _this.resetCodeBtnAndPhone(codeBtn, phoneObj);
                _this.clearVerifyCodeTimeout();
                break;
              default:
                $flag.html('<img src="../../images/wrong.gif" title="错误" />');
                _this.resetCodeBtnAndPhone(codeBtn, phoneObj);
                _this.clearVerifyCodeTimeout();
                break;
            }
          } else {
            _this.resetCodeBtnAndPhone(codeBtn, phoneObj);
            _this.clearVerifyCodeTimeout();
            $.ligerDialog.error(data.error[0].errorMessage);
          }
        } else {
          _this.resetCodeBtnAndPhone(codeBtn, phoneObj);
          _this.clearVerifyCodeTimeout();
          $.ligerDialog.error("操作失败，请重试！");
        }
        return;
      },
      error: function(data) {
        _this.resetCodeBtnAndPhone(codeBtn, phoneObj);
        _this.clearVerifyCodeTimeout();
        $.ligerDialog.error("系统异常，请联系管理员！");
        return;
      }
    });
  },
  toggleSmsVerify: function() {
    var _this = this;
    if (
      _this.smsV != "1" ||
      $.trim($("#vehicleOwnerPhone").val()).length <= 0 ||
      _this.vehicleOwnerPhoneOld.length <= 0 ||
      $.trim(_this.$vehicleNoId.val()).length <= 0 ||
      _this.vehicleNoOld.length <= 0
    ) {
      return;
    }
    var smsverify = $(".smsverify");
    if (
      _this.vehicleOwnerPhoneOld != $.trim($("#vehicleOwnerPhone").val()) ||
      _this.vehicleNoOld.toUpperCase() !=
        $.trim(_this.$vehicleNoId.val()).toUpperCase()
    ) {
      smsverify.show();
    } else {
      smsverify.hide();
    }
  },
  //------- 验证联系人手机END
  // 移除指定车牌颜色下拉选择
  removePlateColorSelect: function(plateColor) {
    $("#plateColorId")
      .find("option[value='" + plateColor + "']")
      .remove();
  },
  // 获取设置中车牌颜色
  getRemovePlateColors: function() {
    var that = this;
    var removePlateColors = [];
    if (KCPT.cancelPlateColorLimit && KCPT.cancelPlateColorLimit.length > 0) {
      // 示例--310000:1#110000:1,3
      var setList = KCPT.cancelPlateColorLimit.split("#");
      for (var j = 0, jlen = that.removedPlateColorAry.length; j < jlen; j++) {
        var flag = true;
        for (var i = 0, len = setList.length; i < len; i++) {
          var setAry = setList[i].split(":");
          var areaCode = setAry[0]; // 110000
          var plateColors = setAry[1].split(","); // 1,3
          // 若包含全国配置，则覆盖其他配置
          if (areaCode == "-1" || areaCode == KCPT.user.platformProvince) {
            for (var k = 0, klen = plateColors.length; k < klen; k++) {
              if (that.removedPlateColorAry[j] == plateColors[k]) {
                flag = false;
              }
            }
          }
        }
        if (flag) {
          removePlateColors.push(that.removedPlateColorAry[j]);
        }
      }
    }
    return removePlateColors;
  },
  // 验证当前服务商/运输企业的开放车牌颜色限制设置（通过颜色编码）
  checkPlateColorLimitByCode: function() {
    var _this = this;
    var bRet = true;
    if (
      $.trim(_this.$vehicleNoId.val()).length > 0 &&
      $.trim(_this.$plateColorId.val()).length > 0
    ) {
      var vehicleNo = $.trim(_this.$vehicleNoId.val());
      vehicleNo = vehicleNo.length == 7 ? vehicleNo.toUpperCase() : vehicleNo; //若为7位车牌号，则转大写
      var params = {
        "requestParam.equal.vehicleNo": vehicleNo,
        "requestParam.equal.plateColor": _this.$plateColorId.val()
      };
      JAjax(
        "operationSupport/checkPlateColorLimitByCode.action",
        params,
        "json",
        function(data) {
          if (data != null && data.error != null && data.error != "") {
            //$("#form3").find("input[class='nextbutton white']").attr("disabled", ""); //回复保存按钮
            $("#quickDealId")
              .find("#quick_submit_bit")
              .removeAttr("disabled"); //完成注册置为有效
            $("#quickDealId")
              .find("#quick_submit_bit")
              .css("backgroundPosition", "-100px 0px");
            if (
              data.error[0].errorMessage != null &&
              data.error[0].errorMessage != ""
            ) {
              $.ligerDialog.warn(data.error[0].errorMessage, "提示");
              bRet = false;
            }
          } else {
            // 车牌号相同，车牌颜色不同
            if (data.displayMessage == "REPEAT") {
              bRet = false;
            } else if (data.displayMessage == "REPEAT_CHK_OK") {
              bRet = true;
            }
          }
        },
        null,
        true
      );
    }
    return bRet;
  },
  // 保存车辆数据
  addVehicleSave: function() {
    var _this = this;
    //保存图片
    //$("#form3").find("input[class='nextbutton white']").attr("disabled", "disabled"); //灰化保存按钮
    $("#quickDealId")
      .find("#quick_submit_bit")
      .attr("disabled", true); //完成注册置为无效
    $("#quickDealId")
      .find("#quick_submit_bit")
      .css("backgroundPosition", "-100px -50px");

    //特殊运输企业
    if (_this.isTransEntSpecial == 1) {
      $("#companyname1").val(
        $("#companyname2")
          .find("option:selected")
          .text()
      );
    }

    /**modify haoyanhui 2017.7.19 如果没有上传图片就不走上传图片逻辑**/
    var b = _this.checkHasPics(); //true是有上传图片，false是4个图片都没有
    if (b) {
      //需要上传图片

      var loadMsg = "正在上传附件, 请耐心等待...";
      if (!b) {
        loadMsg = "数据处理中,请耐心等待...";
      }
      //加载页面展开
      $("#mainDivContent").A_Window({
        // 弹出层的父类的id
        id: "vehicleWaitingWin",
        dragabId: "mainDivContent", // 可拖动的范围
        width: 400, // 宽度
        height: 100, // 高度 popClose
        html:
          '<div style="text-align: center;"><div style="line-height: 50px;">' +
          loadMsg +
          '</div><img alt="' +
          loadMsg +
          '" src="images/global/progressBar.gif"/></div>' // 目标页面或action的地址
      });
      $("#mainDivContent").show_A_Window();

      //把源站代理页面传到服务端调用，解决js无法获取跨域的iframe的内容
      var formObj = $("#form123");
      var input_domain =
        '<input type="hidden" name="currentDomain" value="' +
        (KCPT.carDomain +
          "/carApp/model/quickdeal/CrossDomainIframeProxy.html#") +
        '" />';
      formObj.append(input_domain);
      formObj.attr(
        "action",
        KCPT.imgDomain + "/carApp/quick/saveImage2.action"
      );
      formObj.submit();
      _this.saveImageTimeout();
    } else {
      //没有要上传的图片，直接保存车基础信息
      var message = {};
      _this.callbackSaveImage(message);
    }
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

/**************************************$function********************************************************************************/
$(function() {
  var quickDeal = new QuickDeal();
  window.quickDeal = quickDeal;
  quickDeal.timeout = null;
  quickDeal.onResize();

  //已审核的车辆不验证车牌号,VIN,道路运输证号,所属地,车牌颜色
  if ($("#auditStatus").val() == 1) {
    //0:未审核，1:已审核，2：过期未审
    quickDeal.formValidate123();
  } else {
    quickDeal.formValidate_Different();
    quickDeal.formValidate123();
  }

  // 加载车辆、终端、SIM卡码表选项
  KCPT.CodeManager.getSelectList("SYS_VCL_PLATECOLOR", "plateColorId"); // 车牌颜色

  /**modify haoyanhui 2017.3.14  默认进来请选择*/
  /*quickDeal.$plateColorId.find("option[value=2]").attr("selected", true); //更改默认车牌颜色
	$("#plateColorId").find("option[text='请选择']").remove();// 去掉编辑页面-车牌颜色-请选择*/
  $("#plateColorId").prepend(
    "<option value='' selected='selected'>请选择</option>"
  );
  $("#plateColorId option[value='']").attr("selected", true); //为兼容IE8

  // 开放指定省的服务商或运输企业添加其他车牌颜色-----start added at 20151104 by version 3.1.0
  // 车牌颜色（除必填项黄色外）列表：1-蓝色，2-黄色，3-黑色，4-白色，9-其它
  // 规则 -> 区域编码(全国为-1):开放车牌颜色标识字符串(1,2,3...多个以半角逗号连接)
  if (KCPT.cancelPlateColorLimit && KCPT.cancelPlateColorLimit.length > 0) {
    var removeList = quickDeal.getRemovePlateColors();
    for (var i = 0, len = removeList.length; i < len; i++) {
      quickDeal.removePlateColorSelect(removeList[i]);
    }
  } else {
    for (var i = 0, len = quickDeal.removedPlateColorAry.length; i < len; i++) {
      quickDeal.removePlateColorSelect(quickDeal.removedPlateColorAry[i]);
    }
  }

  //KCPT.CodeManager.getSelectList("SYS_VEHICLE_BRAND", "vbrandCodeId");// 车辆品牌
  KCPT.CodeManager.getSelectList("SYS_VEHICLE_TYPE", "vehicleTypeId"); // 车辆类型
  KCPT.CodeManager.getProvinceList("areaCodeId"); // 省

  $("#areaCodeId option[value=" + KCPT.user.platformProvince + "]").attr(
    "selected",
    true
  );
  $("#areaCodeId").css("display", "none");
  $("#areaName").html(
    $("#areaCodeId")
      .find("option:selected")
      .text() + "&nbsp;&nbsp;"
  );
  //获取简称
  KCPT.shortName = getShortNameByAreaCode(KCPT.user.platformProvince);

  KCPT.CodeManager.getCityList(KCPT.user.platformProvince, "cityIdId"); // 取当前登录服务商所属省，取市列表

  //平台列表加载
  quickDeal.initPlatform();

  // 在对象声明里添加属性
  quickDeal.MUN_CITYCODE_LIST = "11,12,31,50,"; //直辖市AREACODE集合

  //判断当前车辆是否有车辆登记证图片、行驶证或车辆合格证照片、车身照片
  var path1 = $("#attachUrl1").val(),
    path2 = $("#attachUrl2").val(),
    path3 = $("#attachUrl3").val(),
    path4 = $("#attachUrl4").val();
  var attachImg1 = $("#registrationCertificateAttach"),
    attachImg2 = $("#drivingLicOrCertAttach"),
    attachImg3 = $("#vehicleBodyPhotoAttach"),
    attachImg4 = $("#registrationCertificateAttach2");
  // 车辆登记证图片
  if (path1 != "") {
    attachImg1.attr("src", path1);
    attachImg1.show();
  } else {
    attachImg1.hide();
  }
  //车辆登记证图片2
  if (path4 != "") {
    attachImg4.attr("src", path4);
    attachImg4.show();
  } else {
    attachImg4.hide();
  }

  // 行驶证或车辆合格证照片
  if (path2 != "") {
    attachImg2.attr("src", path2);
    attachImg2.show();
  } else {
    attachImg2.hide();
  }
  // 车身照片
  if (path3 != "") {
    attachImg3.attr("src", path3);
    attachImg3.show();
  } else {
    attachImg3.hide();
  }

  var _vid = $("#vehicle-hidden-vid").val(); //车辆ID
  //编辑
  if (_vid != null && _vid != "") {
    // VID不为空说明是编辑页面
    //如果是编辑页面显示终端厂商，终端型号
    $("#tbT_oemCode_li").css("display", "");
    $("#tmodelCodeId_li").css("display", "");
    $("#tbT_tmc_li").css("width", "331px");
    $("#tbsim_commaddr_li").css("padding-top", "20px");
    //显示详情
    quickDeal.initDetail(_vid);
    //设置市放在外边,给ajax异步留时间
    $("#cityIdId").val(quickDeal.vehicle_cityId);
    $("#tbSimCity").val(quickDeal.sim_city);
    $("#tmodelCodeId").val(quickDeal.tmodelCode);
    //设置提交和清空按钮文字
    $("#quick_submit_bit").val("保存修改");
    $("#quick_submit_bit")
      .attr("onclick", "")
      .click(function() {
        quickDeal.update();
      });
    $("#quick_clear_bit").val("取消");
    $("#quick_clear_bit")
      .attr("onclick", "")
      .click(function() {
        quickDeal.clearVerifyCodeTimeout();
        //车辆管理页面加载
        changeToFirstMenu("vehicle_manager");
      })
      .mouseover(function() {
        quickDeal.isCancelBut = true;
      })
      .mouseout(function() {
        quickDeal.isCancelBut = false;
      });
    $("#quick_close_bit").remove();

    //------- 验证联系人手机BEGIN
    $(".smsverify").hide();
    //------- 验证联系人手机END

    quickDeal.vehicleProdNameOld = $("#prodCodeText").val();
    quickDeal.vehicleProdCodeOld = $("#prodCode").val();

    quickDeal.ismatchVBrandName = 2;
    KCPT.autocompleteVBrandData = null;
  } else {
    //添加页面，赋值车牌号首位
    $("#vehicleNoId").val(KCPT.shortName);

    //燃料类型 2017.12.20
    var _fuleType = $("#fule_type").val();
    if (_fuleType == "3") {
      //电
      $("#plateColorId")
        .find("option")
        .remove();
      $("#plateColorId").prepend(
        "<option value='5' selected='selected'>黄绿色</option>"
      );
    } else {
      quickDeal.removePlateColorSelect("5"); //删掉黄绿色
    }

    //添加页面移除终端厂商与终端型号
    $("#tbT_oemCode_li").remove();
    $("#tmodelCodeId_li").remove();

    $("#quick_close_bit")
      .attr("onclick", "")
      .click(function() {
        quickDeal.clearVerifyCodeTimeout();
        //车辆管理页面加载
        changeToFirstMenu("vehicle_manager");
      })
      .mouseover(function() {
        quickDeal.isCancelBut = true;
      })
      .mouseout(function() {
        quickDeal.isCancelBut = false;
      });

    $("#quick_clear_bit")
      .mouseover(function() {
        quickDeal.isCancelBut = true;
        if ($("#vehicleNoIdForValid").size() > 0) {
          $("#vehicleNoIdForValid").remove();
        }
        if ($("#plateColorIdForValid").size() > 0) {
          $("#plateColorIdForValid").remove();
        }
        if ($("#vbrandNameForValid").size() > 0) {
          $("#vbrandNameForValid").remove();
        }
        if ($("#drivecardReleaseDateForValid").size() > 0) {
          //发证日期
          $("#drivecardReleaseDateForValid").remove();
        }
        if ($("#engineNoForValid").size() > 0) {
          //发动机号
          $("#engineNoForValid").remove();
        }
        if ($("#engineTypeForValid").size() > 0) {
          //发动机型号
          $("#engineTypeForValid").remove();
        }
      })
      .mouseout(function() {
        quickDeal.isCancelBut = false;
      });
  }

  //车辆品牌
  $("#vbrandName").change(function() {
    $("#prodCodeText").val("");
    $("#prodCode").val("");
  });
  //平台服务商名称改变时动态取接入点,IP,端口
  $("#opPlatformId").change(function() {
    quickDeal.setPointIpPort($(this).val(), null);
    $("#point_adds").html("");
    $("#point_port").html("");
  });

  //接入 点改变时IP,端口也跟着改变
  $("#opPlatformPointId").change(function() {
    var ipPort = KCPT.ipPorts[$(this).val()];
    $("#point_adds").html(ipPort[0]);
    $("#point_port").html(ipPort[1]);
    $("#newSeq").val(ipPort[2]);
  });

  $("#areaCodeId").change(function() {
    KCPT.CodeManager.getCityList($(this).val(), "cityIdId"); // 市
    $("#countyId").removeAttr("disabled");
    $("#countyId").empty();
    $("#countyId").append("<option value=''>请选择</option>");
  });
  $("#cityIdId").change(function() {
    KCPT.CodeManager.getCountryList($(this).val(), "areaCodeId", "countyId");
    if ($("#countyId").attr("disabled")) {
      //若下拉无效，隐藏“必选字段”
      $("#quickDealId")
        .find("label[for='countyId']")
        .hide();
    }
  });

  //车架号唯一性检查
  $("#vinCode").blur(function() {
    quickDeal.vinCodeValidate();
  });

  //SIM卡卡号唯一性检查
  $("input[name='tbVehicle.commaddr']").blur(function() {
    var value = $(this).val();
    if (quickDeal.validateSim(value)) {
      return false;
    }
    quickDeal.commaddrValidate();
  });

  //车牌号唯一性检查
  $("#vehicleNoId")
    .blur(function() {
      var vehicleNo = $(this).val();
      if (!quickDeal.validateVehicleNo(vehicleNo)) {
        return false;
      }
      if (!quickDeal.validateVehicleNo_first(vehicleNo)) {
        return false;
      }
      quickDeal.vehicleValidate();
    })
    .keyup(function() {
      var vehicleNoObj = $(this);
      var vehicleNo = vehicleNoObj.val();
      if ($("#vehicleNoIdForValid").size() > 0) {
        $("#vehicleNoIdForValid").remove();
      }
      if ($("#plateColorIdForValid").size() > 0) {
        $("#plateColorIdForValid").remove();
      }
      var businessCode = /^[a-zA-Z0-9]+$/;
      if (!businessCode.test(vehicleNo)) {
        vehicleNoObj.val(vehicleNo.toUpperCase());
      }
    });

  //车牌颜色
  $("#plateColorId")
    .change(function() {
      if (quickDeal.validatePlateColorNull($(this))) {
        quickDeal.vehicleValidate();
      }
      /**车牌颜色黄、蓝改变，牵引总质量变化  add 2017.8.21*/
      quickDeal.plateColorChange($(this));
    })
    .keyup(function() {
      if ($.trim($(this).val()).length == 0) {
        if ($("#vehicleNoIdForValid").size() > 0) {
          $("#vehicleNoIdForValid").remove();
        }
        if ($("#plateColorIdForValid").size() > 0) {
          $("#plateColorIdForValid").remove();
        }
      }
      /**车牌颜色黄、蓝改变，牵引总质量变化  add 2017.8.21*/
      quickDeal.plateColorChange($(this));
    });

  // 测试  add by chengchao
  $("#prodCodeText").blur(function() {
    quickDeal.matchTruckStandardData();
  });

  // 验证总质量
  $("#vehicleTon")
    .blur(function() {
      $("#vehicleTonSelect").css("display", "none"); //add by chengchao 2017.8.29
      quickDeal.validateVehicleTon($(this), "vehicleTonForValid", true);
    })
    .keyup(function() {
      quickDeal.validateVehicleTon($(this), "vehicleTonForValid", true);
    });
  // 验证车辆核定载质量
  $("#loadTon")
    .blur(function() {
      $("#loadTonSelect").css("display", "none"); //add by chengchao 2017.8.29
      quickDeal.validateVehicleTon($(this), "loadTonForValid", false);
    })
    .keyup(function() {
      quickDeal.validateVehicleTon($(this), "loadTonForValid", false);
    });
  // 验证准牵引总质量
  $("#vehicleDrawTon")
    .blur(function() {
      if ($("#plateColorId").val() != "1") {
        //车牌号为蓝色时，准牵引总质量不填、不验证  add 2017.8.21
        quickDeal.validateVehicleTon($(this), "vehicleDrawTonForValid", false);
      }
    })
    .keyup(function() {
      if ($("#plateColorId").val() != "1") {
        //车牌号为蓝色时，准牵引总质量不填、不验证  add 2017.8.21
        quickDeal.validateVehicleTon($(this), "vehicleDrawTonForValid", false);
      }
    });

  // 验证车辆外廓尺寸-长 //add by chengchao 2017.8.29
  $("#vehicleTyreSize").blur(function() {
    $("#vehicleTyreSizeSelect").css("display", "none");
  });

  // 验证车辆外廓尺寸-长
  $("#vehicleLength")
    .blur(function() {
      $("#vehicleLengthSelect").css("display", "none"); //add by chengchao 2017.8.29
      quickDeal.validateVehicleLength(
        $(this),
        "vehicleLengthForValid",
        false,
        false
      );
    })
    .keyup(function() {
      quickDeal.validateVehicleLength(
        $(this),
        "vehicleLengthForValid",
        false,
        false
      );
    });
  // 验证车辆外廓尺寸-宽
  $("#vehicleWidth")
    .blur(function() {
      $("#vehicleWidthSelect").css("display", "none"); //add by chengchao 2017.8.29
      quickDeal.validateVehicleWidthHeight(
        $(this),
        "vehicleWidthForValid",
        false,
        1,
        false
      );
    })
    .keyup(function() {
      quickDeal.validateVehicleWidthHeight(
        $(this),
        "vehicleWidthForValid",
        false,
        1,
        false
      );
    });
  // 验证车辆外廓尺寸-高
  $("#vehicleHeight")
    .blur(function() {
      $("#vehicleHeightSelect").css("display", "none"); //add by chengchao 2017.8.29
      quickDeal.validateVehicleWidthHeight(
        $(this),
        "vehicleHeightForValid",
        false,
        2,
        false
      );
    })
    .keyup(function() {
      quickDeal.validateVehicleWidthHeight(
        $(this),
        "vehicleHeightForValid",
        false,
        2,
        false
      );
    });
  // 验证车辆货厢内部尺寸-长
  $("#boxLength")
    .blur(function() {
      $("#boxLengthSelect").css("display", "none"); //add by chengchao 2017.8.29
      quickDeal.validateVehicleLength(
        $(this),
        "boxLengthForValid",
        true,
        false
      );
    })
    .keyup(function() {
      quickDeal.validateVehicleLength(
        $(this),
        "boxLengthForValid",
        true,
        false
      );
    });
  // 验证车辆货厢内部尺寸-宽
  $("#boxWidth")
    .blur(function() {
      $("#boxWidthSelect").css("display", "none"); //add by chengchao 2017.8.29
      quickDeal.validateVehicleWidthHeight(
        $(this),
        "boxWidthForValid",
        true,
        1,
        false
      );
    })
    .keyup(function() {
      quickDeal.validateVehicleWidthHeight(
        $(this),
        "boxWidthForValid",
        true,
        1,
        false
      );
    });
  // 验证车辆货厢内部尺寸-高
  $("#boxHeight")
    .blur(function() {
      $("#boxHeightSelect").css("display", "none"); //add by chengchao 2017.8.29
      quickDeal.validateVehicleWidthHeight(
        $(this),
        "boxHeightForValid",
        true,
        2,
        false
      );
    })
    .keyup(function() {
      quickDeal.validateVehicleWidthHeight(
        $(this),
        "boxHeightForValid",
        true,
        2,
        false
      );
    });

  // 车辆图片信息即时验证
  $("#registrationCertificateFile").change(function() {
    quickDeal.fileValidate(
      "registrationCertificateFile",
      "registrationCertificateFileType"
    );
  });
  // 车辆图片信息2即时验证
  $("#registrationCertificateFile2").change(function() {
    quickDeal.fileValidate(
      "registrationCertificateFile2",
      "registrationCertificateFileType2"
    );
  });
  $("#drivingLicOrCertFile").change(function() {
    quickDeal.fileValidate("drivingLicOrCertFile", "drivingLicOrCertFileType");
  });
  $("#vehicleBodyPhotoFile").change(function() {
    quickDeal.fileValidate("vehicleBodyPhotoFile", "vehicleBodyPhotoFileType");
  });

  //作废不用，2017.8.8
  /*$("#showVehicleHidden").click(function() {
		$("#vehicleHidden").toggle();
		if ("显示全部信息" == $("#showVehicleHiddenText").text()) {
			$("#showVehicleHiddenText").text("隐藏部分信息");
			$("#showVehicleHiddenImg").attr("src", "images/kcptWindow/double_up.png");
		} else {
			$("#showVehicleHiddenText").text("显示全部信息");
			$("#showVehicleHiddenImg").attr("src", "images/kcptWindow/double_down.png");
		}
	});*/
  $("#showTerminalHidden").click(function() {
    $("#terminalHidden").toggle();
    if ("显示选填项" == $("#showTerminalHiddenText").text()) {
      $("#showTerminalHiddenText").text("隐藏选填项");
      $("#showTerminalHiddenImg").attr(
        "src",
        "images/kcptWindow/double_up.png"
      );
    } else {
      $("#showTerminalHiddenText").text("显示选填项");
      $("#showTerminalHiddenImg").attr(
        "src",
        "images/kcptWindow/double_down.png"
      );
    }
  });
  $("#showSimHidden").click(function() {
    $("#simHidden").toggle();
    if ("显示选填项" == $("#showSimHiddenText").text()) {
      $("#showSimHiddenText").text("隐藏选填项");
      $("#showSimHiddenImg").attr("src", "images/kcptWindow/double_up.png");
    } else {
      $("#showSimHiddenText").text("显示选填项");
      $("#showSimHiddenImg").attr("src", "images/kcptWindow/double_down.png");
    }
  });

  //保险类型
  $("#otherCheckIType").click(function() {
    var flag = $("#otherCheckIType").attr("checked");
    if (flag) {
      $("#otherCheckInsuranceType").show();
    } else {
      $("#otherCheckInsuranceType").hide();
    }
  });

  //车辆型号输入框添加自动补全 程超
  $("#prodCodeText")
    .autocomplete(
      "quick/likeMatchVehicleMold.action", //匹配车辆型号
      {
        matchContains: true,
        max: 50,
        extraParams: {
          "tbVehicle.vbrandName": function() {
            return $("#vbrandName").val();
          },
          "tbVehicle.prodCodeText": function() {
            return $("#prodCodeText")
              .val()
              .toUpperCase();
          }
        },
        width: 140,
        matchCase: true, //是否区分大小写，设置false后自动小写
        matchSubset: false,
        delay: 500,
        cacheLength: 0,
        visible: true,
        formatItem: function(row) {
          return row.vehicleMold;
        },
        formatMatch: function(row) {
          return row.vehicleMold;
        },
        parse: function(data) {
          //格式化远程调用返回数据（转换成json对象）
          if (data != undefined && data == "") {
            //modify haoyanhui 2017.8.29
            data = "[]";
          }
          return $.map(eval(data), function(row) {
            return {
              data: row,
              value: row.vehicleMold,
              result: row.vehicleMold
            };
          });
        }
      }
    )
    .result(function(event, data, formatted) {
      //选中时执行
      $("#prodCodeText").val(data.vehicleMold);
      quickDeal.matchTruckStandardData(); //add by chengchao
    }); //end add by chengchao 2017.8.29

  //车辆品牌输入框添加自动补全
  $("#vbrandName")
    .autocomplete(
      "operationSupport/getVBrandInfo.action", //查询车辆品牌
      {
        matchContains: true,
        max: 50,
        extraParams: {
          "requestParam.like.vbrandName": function() {
            return $("#vbrandName").val();
          }
        },
        matchCase: true, //是否区分大小写，设置false后自动小写
        matchSubset: false,
        delay: 500,
        cacheLength: 0,
        visible: true,
        formatItem: function(row) {
          return row.vbrandName;
        },
        formatMatch: function(row) {
          return row.vbrandName;
        },
        parse: function(data) {
          //格式化远程调用返回数据（转换成json对象）
          KCPT.autocompleteVBrandData = eval(data);
          quickDeal.isAutoComplete = true;
          //未匹配到车牌品牌
          if (KCPT.autocompleteVBrandData.length == 0) {
            quickDeal.ismatchVBrandName = 0;
          } else {
            quickDeal.ismatchVBrandName = 1;
          }

          quickDeal.validateVBrandName();

          return $.map(eval(data), function(row) {
            return {
              data: row,
              value: row.vbrandName,
              result: row.vbrandName
            };
          });
        }
      }
    )
    .result(function(event, data, formatted) {
      //选中时执行
      $("#vbrandCode").val(data.vbrandCode);
      quickDeal.validateVBrandName();
    });
  /**
   * 输入项在车牌品牌JS缓存中不存在，重置车辆品牌输入项
   *
   */
  $("#vbrandName")
    .blur(function() {
      quickDeal.isAutoComplete = false;
    })
    .keyup(function() {
      quickDeal.isAutoComplete = false;
      if ($("#vbrandNameForValid").size() > 0) {
        $("#vbrandNameForValid").remove();
      }

      var vbrandName = $.trim($("#vbrandName").val());
      if (vbrandName == "") {
        quickDeal.validateVBrandName();
      }
    });

  $("#downEntryDataHelp").click(function() {
    if ($(this).attr("url")) {
      $("#ifHelpDownUrl")
        .contents()
        .find("#fileDownloadForm")
        .find("#downloadFileUrl")
        .val($(this).attr("url"));
      $("#ifHelpDownUrl")
        .contents()
        .find("#fileDownloadForm")
        .find("#downloadFileName")
        .val($(this).attr("fileName"));
      $("#ifHelpDownUrl")
        .contents()
        .find("#fileDownloadForm")
        .attr("method", "post");
      $("#ifHelpDownUrl")
        .contents()
        .find("#fileDownloadForm")
        .attr("action", "tbPublishInfoAction!getHelpDownloadFile.action");
      $("#ifHelpDownUrl")
        .contents()
        .find("#fileDownloadForm")
        .submit();
    }
  });
  //------- 验证联系人手机BEGIN
  // 手机号码改变
  $("#vehicleOwnerPhone")
    .keyup(function() {
      quickDeal.toggleSmsVerify();
    })
    .blur(function() {
      quickDeal.toggleSmsVerify();
    });
  // 车牌号改变
  $("#vehicleNoId").blur(function() {
    quickDeal.toggleSmsVerify();
  });
  // 注册获取验证码事件
  $("#getVerifyCodeBtn").click(function() {
    quickDeal.getVerifyCode();
  });
  // 手机验证码验证
  $("#verifycode")
    .blur(function() {
      quickDeal.verifyCarOwnerAuthCode();
    })
    .keyup(function() {
      $("#verifyCodeFlag").html("");
    });
  //------- 验证联系人手机END

  //行驶证发证日期非空校验
  $("#drivecardReleaseDate")
    .blur(function() {
      quickDeal.drivecardReleaseDateValidat();
    })
    .on("input", function(e) {
      quickDeal.drivecardReleaseDateValidat();
    });

  //发动机号校验，车牌号不为空时，发动机号为必填，且最小长度为3，20
  $("#engineNo")
    .keyup(function() {
      quickDeal.engineNoValidat();
    })
    .blur(function() {
      quickDeal.engineNoValidat();
    });

  //发动机型号校验
  $("#engineType")
    .keyup(function() {
      quickDeal.engineTypeValidat();
    })
    .blur(function() {
      quickDeal.engineTypeValidat();
    });

  //燃料类型改变事件
  $("#fule_type").change(function() {
    var select_value = $(this).val();
    // 如果选中电车那么修改车辆颜色选项
    if (select_value === "3") {
      // 选取电车时，只能输入八位车牌号
      $("#plateColorId").html(
        "<option value='5' selected='selected'>黄绿色</option>"
      );
    } else {
      //已定位车辆非电车辆，车牌颜色不变,未定位的车赋请选择
      if (
        quickDeal.FirstPositionFlag == null ||
        quickDeal.FirstPositionFlag == undefined ||
        quickDeal.FirstPositionFlag <= 0
      ) {
        // 选取其他车时，只能输入七位车牌号
        $("#plateColorId").html(
          "<option value='' selected='selected'>请选择</option><option value='1'>蓝色</option><option value='2'>黄色</option>"
        );
      }
    }
    $("#plateColorId").trigger("change");
  });
  /*//手动触发事件
	$("#fule_type").trigger("change");*/

  //车主业户
  $("#companyname1")
    .keyup(function() {
      $("#companyname1").val(
        $("#companyname1")
          .val()
          .trim()
      );
    })
    .blur(function() {
      $("#companyname1").val(
        $("#companyname1")
          .val()
          .trim()
      );
    });
  //联系人姓名
  $("#vehicleOwnerName")
    .keyup(function() {
      $("#vehicleOwnerName").val(
        $("#vehicleOwnerName")
          .val()
          .trim()
      );
    })
    .blur(function() {
      $("#vehicleOwnerName").val(
        $("#vehicleOwnerName")
          .val()
          .trim()
      );
    });
});
