export const Rules = function(vm) {
  const baseRule = {
    str: { pattern: /^[a-zA-Z]+$/, message: "只能输入字母" },
    str_num: { pattern: /^[a-zA-Z0-9]+$/, message: "只能输入数字字母" },
    num: { pattern: /^[0-9]+$/, message: "只能输入数字" },
    specialChineseChars: {
      pattern: /^[\u4e00-\u9fa5（） ]+$/,
      message: "只能输入汉字、空格、（）符号"
    },
    specialChineseChars1: {
      // eslint-disable-next-line
      pattern: /^[a-zA-Z\u4e00-\u9fa5()（）\-\－ ]+$/,
      message: "只能输入汉字、空格、（）符号"
    } //汉字、不可输入除 - （）空格以外的特殊字符
  };

  //传入vm 用于多条件判断
  Object.assign(this, {
    // img: [{ required: true, message: "车身照片" }],
    // register_no1: [{ required: true, message: "车辆登记证1" }],
    // driver_no: [{ required: true, message: "车辆合格证/行驶证" }],
    license: [
      {
        required: true,
        message: "必须填写车牌号",
        trigger: "change"
      },
      {
        trigger: "change",
        validator: function(rule, value, callback) {
          if (value.length >= 8 && !/[\u4e00-\u9fa5]/.test(value[0])) {
            //如果首位不是中文，走vin的验证
            if (
              !/^[-a-zA-Z0-9]+$/.test(value) ||
              [8, 17, 18].indexOf(value.length) == -1
            ) {
              callback(new Error("请输入正确的车辆识别码/车架号"));
              return false;
            }
            callback();
            return false;
          }
          var fule_type = vm.formData.fule_type;
          var vehicleNo01, vehicleNo02, vehicleNo03;
          // 如果是电车，那么走新的判断，程超
          if (fule_type == "3") {
            vehicleNo01 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{7}$/;
            vehicleNo02 = /^[\u4e00-\u9fa5]{2}[A-Za-z0-9]{6}$/;
            vehicleNo03 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{6}[\u4e00-\u9fa5]{1}$/;
          } else {
            vehicleNo01 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{6}$/;
            vehicleNo02 = /^[\u4e00-\u9fa5]{2}[A-Za-z0-9]{5}$/;
            vehicleNo03 = /^[\u4e00-\u9fa5]{1}[A-Za-z0-9]{5}[\u4e00-\u9fa5]{1}$/;
          }
          var result =
            vehicleNo01.test(value) ||
            vehicleNo02.test(value) ||
            vehicleNo03.test(value);
          if (result) {
            callback();
          } else {
            callback(new Error("车牌号不正确"));
          }
        }
      }
    ],
    transport_no: [baseRule.num],
    flue_type: [{ required: true, message: "必须选择燃油种类" }],
    sim_id: [
      { required: true, message: "必须选择SIM卡号" },
      {
        trigger: "change",
        validator: function(rule, value, callback) {
          value = value.slice(0, 11);
          var reg = /^0?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9]|64[0-9]|4[0-9]{2})[0-9]{8}$/;
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error("sim卡号错误"));
          }
        }
      }
    ],
    type: [{ required: true, message: "必须选择车辆类型" }],
    sim_no: [{ required: true, message: "必须选择安装SIM卡号" }],
    device_no: [{ required: true, message: "必须选择设备" }],
    contract_date: [{ required: true, message: "必须选择服务到期日期" }],
    owner: [
      { required: true, message: "必须输入车主/业户" },
      { min: 2, max: 20, message: "不能小于2个字符，不能大于20个字符" },
      baseRule.specialChineseChars1
    ],
    linkman: [
      { required: true, message: "必须输入联系人" },
      { min: 2, max: 20, message: "不能小于2个字符，不能大于20个字符" },
      baseRule.specialChineseChars
    ],
    tel: [{ required: true, message: "必须输入联系电话" }],
    area: [{ required: true, message: "必须选择地区" }],
    vin: [
      { required: true, message: "必须输入车辆识别代码/车架号" },
      {
        validator: function(rule, value, callback) {
          if (
            !/^[-a-zA-Z0-9]+$/.test(value) ||
            value.length < 8 ||
            value.length > 18
          ) {
            callback(new Error("请输入正确的车辆识别码/车架号"));
            return false;
          }
          callback();
        }
      }
    ],
    brand_id: [{ required: true, message: "必须输入车辆品牌" }],
    model: [{ required: true, message: "必须输入车辆车辆型号" }],
    vtype: [{ required: true, message: "必须输入车辆车辆类型" }],
    engine_no: [
      { required: true, message: "必须输入发动机号" },
      { min: 3, message: "长度不能小于3" },
      { max: 25, message: "长度不能大于25" },
      {
        validator: function(rule, value, callback) {
          if (!/^[a-zA-Z0-9]+$/.test(value)) {
            callback(new Error("只能输入数字或字母"));
            return false;
          }
          callback();
        }
      }
    ],
    engine_type: [
      { required: true, message: "必须输入发动机型号" },
      { min: 3, message: "长度不能小于3" },
      { max: 25, message: "长度不能大于25" },
      {
        validator: function(rule, value, callback) {
          if (
            // eslint-disable-next-line
            !/^[a-zA-Z0-9\.\-\*\I\II\III\IV\V\VI\VII\VIII\IX\X\ ]+$/.test(value)
          ) {
            callback(new Error("只能输入英文、数字、-  . * 符号"));
            return false;
          }
          callback();
        }
      }
    ],
    total_ton: [
      { required: true, message: "必须输入总质量" },
      {
        validator: function(rule, value, callback) {
          var min = 1000; //蓝色牌照不能小于100 其他不能小于1000
          var reg = /^[1-9][\d]{3,9}(\.[\d]{1,2})?$/;
          if (vm.formData.license_color == "1") {
            min = 100;
            reg = /^[1-9][\d]{2,9}(\.[\d]{1,2})?$/;
          }
          if (value == "--" || value == "－－") {
            callback();
            vm.$refs.baseForm.validateField("load_ton");
            return false;
          }
          if (value == "0") {
            callback();
            return false;
          }
          if (!reg.test(value) || parseFloat(value) < min) {
            callback(
              new Error(
                "请输入0、--、－－、/或大于" + min + "且最多两位小数的数字"
              )
            );
            return false;
          }
          callback();
        }
      }
    ],
    load_ton: [
      //核定载质量
      {
        required: true,
        validator: function(rule, value, callback) {
          var min = 1000; //蓝色牌照不能小于100 其他不能小于1000
          var reg = /^[1-9][\d]{3,9}(\.[\d]{1,2})?$/;
          if (vm.formData.license_color == "1") {
            min = 100;
            reg = /^[1-9][\d]{2,9}(\.[\d]{1,2})?$/;
          }
          if (value == "--" || value == "0" || value == "－－") {
            callback();
            return false;
          }

          if (value == "" && vm.formData.draw_ton == "") {
            callback(
              new Error("【核定载质量】与【准牵引总质量】二者至少填一项")
            );
            return false;
          }
          if (
            !isNaN(vm.formData.total_ton) &&
            parseFloat(vm.formData.total_ton) < parseFloat(value)
          ) {
            callback(new Error("【核定载质量】必须小于【总质量】"));
            return false;
          }
          if (!reg.test(value) || parseFloat(value) < min) {
            callback(
              new Error(
                "请输入--、－－、/或大于" + min + "且最多两位小数的数字"
              )
            );
            return false;
          }
          if (parseFloat(value) >= vm.formData.total_ton) {
            callback(new Error("核定载质量需小于总质量"));
            return false;
          }
          callback();
          vm.$refs.baseForm.clearValidate("draw_ton");
        }
      }
    ],
    draw_ton: [
      {
        required: true,
        // message: "必须输入准牵引总质量",
        trigger: "blur",
        validator: function(rule, value, callback) {
          if (value == "" && vm.formData.load_ton == "") {
            callback(
              new Error("【核定载质量】与【准牵引总质量】二者至少填一项")
            );
          } else {
            callback();
            vm.$refs.baseForm.clearValidate("load_ton");
          }
        }
      }
    ],
    length: [
      { required: true, message: "必须输入外廓尺寸长" },
      {
        validator: function(rule, value, callback) {
          if (isNaN(value) || !/^[1-9][\d]{0,4}(\.[\d]{1,2})?$/.test(value)) {
            callback(new Error("请输入正确的外廓尺寸长"));
          }
          value = parseFloat(value);
          if (value < 1000) {
            callback(new Error("外廓尺寸长不能小于1000"));
          }
          vm.$refs.baseForm.validateField("width");
          vm.$refs.baseForm.validateField("height");
          vm.$refs.baseForm.validateField("box_length");
          callback();
        }
      }
    ],
    width: [
      { required: true, message: "必须输入外廓尺寸宽" },
      {
        validator: function(rule, value, callback) {
          if (isNaN(value) || !/^[1-9][\d]{0,4}(\.[\d]{1,2})?$/.test(value)) {
            callback(new Error("请输入正确的外廓尺寸宽"));
          }
          value = parseFloat(value);
          if (value < 1000) {
            callback(new Error("外廓尺寸宽不能小于1000"));
          }
          if (vm.formData.length != "" && value >= vm.formData.length) {
            callback(new Error("必须小于外廓尺寸长"));
          }
          callback();
        }
      }
    ],
    height: [
      { required: true, message: "必须输入外廓尺寸高" },
      {
        validator: function(rule, value, callback) {
          if (isNaN(value) || !/^[1-9][\d]{0,4}(\.[\d]{1,2})?$/.test(value)) {
            callback(new Error("请输入正确的外廓尺寸高"));
          }
          value = parseFloat(value);
          if (value < 1000) {
            callback(new Error("外廓尺寸高不能小于1000"));
          }
          if (vm.formData.length != "" && value >= vm.formData.length) {
            callback(new Error("必须小于外廓尺寸长"));
          }
          callback();
        }
      }
    ],
    box_length: [
      { required: true, message: "必须输入货厢内部尺寸长或--" },
      {
        validator: function(rule, value, callback) {
          if (boxEmpty()) {
            callback();
            return false;
          }
          if (isNaN(value) || !/^[1-9][\d]{0,3}(\.[\d]{1,2})?$/.test(value)) {
            callback(new Error("请输入正确的厢内部尺寸长"));
          }
          value = parseFloat(value);
          if (value < 1000) {
            callback(new Error("货厢内部尺寸长不能小于1000"));
          }
          if (vm.formData.length != "" && value >= vm.formData.length) {
            callback(new Error("必须小于外廓尺寸长"));
          }
          vm.$refs.baseForm.validateField("box_width");
          vm.$refs.baseForm.validateField("box_height");
          callback();
        }
      }
    ],
    box_width: [
      { required: true, message: "必须输入货厢内部尺寸宽或--" },
      {
        validator: function(rule, value, callback) {
          if (boxEmpty()) {
            callback();
            return false;
          }
          if (isNaN(value) || !/^[1-9][\d]{0,3}(\.[\d]{1,2})?$/.test(value)) {
            callback(new Error("请输入正确的货厢内部尺寸宽"));
            return false;
          }
          value = parseFloat(value);
          if (value < 1000) {
            callback(new Error("货厢内部尺寸宽不能小于1000"));
            return false;
          }
          if (vm.formData.box_length != "" && value >= vm.formData.box_length) {
            callback(new Error("必须小于内部尺寸长"));
            return false;
          }
          if (vm.formData.length != "" && value >= vm.formData.length) {
            callback(new Error("必须小于外廓尺寸长"));
            return false;
          }
          callback();
        }
      }
    ],
    box_height: [
      { required: true, message: "必须输入货厢内部尺寸高或--" },
      {
        validator: function(rule, value, callback) {
          if (boxEmpty()) {
            //如果内部尺寸都为-- 则不进行检验
            callback();
            return false;
          }
          if (isNaN(value)) {
            callback(new Error("请输入正确的厢内部尺寸高"));
            return false;
          }
          value = parseFloat(value);
          if (value < 1) {
            callback(new Error("货厢内部尺寸宽必须大于1"));
            return false;
          }
          if (vm.formData.height != "" && value >= vm.formData.height) {
            callback(new Error("必须小于外廓尺寸高"));
            return false;
          }
          if (vm.formData.box_length != "" && value >= vm.formData.box_length) {
            callback(new Error("必须小于内部尺寸长"));
            return false;
          }
          callback();
        }
      }
    ],
    axis: [
      { required: true, message: "必须输入轴数" },
      {
        min: 2,
        max: 20,
        type: "number",
        message: "请输入2到20的整数"
      },
      { pattern: /^[1-9][\d]{0,1}$/, message: "必须输入整数" }
    ],
    tyre: [
      {
        validator: function(rule, value, callback) {
          if (
            !value.length ||
            (/^[1-9][\d]{0,1}$/.test(value) &&
              parseFloat(value) >= 4 &&
              parseFloat(value) <= 98 &&
              value % 2 == 0)
          ) {
            callback();
            return false;
          }
          callback("请输入4到98的整偶数数字");
        }
      }
    ],
    issue_date: [{ required: true, message: "必须输入行驶证发证日期" }]
  });

  function boxEmpty() {
    return (
      vm.formData.box_length == "--" &&
      vm.formData.box_height == "--" &&
      vm.formData.box_width == "--"
    );
  }
};
//【车辆识别代码/车架号】与【车牌号、车牌颜色】二者至少填一项；【核定载质量】与【准牵引总质量】二者至少填一项

//货厢内部尺寸需判断：同一辆车，货厢内部尺寸要小于该车的外部尺寸
//货厢内部尺寸的宽、高要小于长
//内部外部尺寸都必须大于1000，【货厢内部尺寸高】可以小于1000
//车牌号为蓝色时，准牵引总质量不填、不验证  add 2017.8.21
//总质量为0或者数字时 核定载质量必须小于总质量 总质量为--时 不做限制

//车架号唯一性检查
//SIM卡卡号唯一性检查
//车牌号唯一性检查
//轮胎数限定：最小数值为4，最长不大于两位的整数数字。只能为偶数
