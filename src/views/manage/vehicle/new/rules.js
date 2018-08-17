export const Rules = function(vm) {
  //传入vm 用于多条件判断
  this.license = [
    {
      required: true,
      message: "必须填写车牌号",
      trigger: "change"
    },
    {
      trigger: "change",
      component: vm,
      validator: function(rule, value, callback) {
        var fule_type = rule.component.formData.fule_type;
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
  ];
  Object.assign(this, {
    sim_id: [{ required: true, message: "必须选择SIM卡号" }],
    type: [
      { required: true, message: "必须选择车辆类型" },
      {
        trigger: "change",
        validator: function(rule, value, callback) {
          var reg = /^0?(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9]|64[0-9]|4[0-9]{2})[0-9]{8}$/;
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error("sim卡号错误"));
          }
        }
      }
    ],
    sim_no: [{ required: true, message: "必须选择安装SIM卡号" }],
    device_id: [{ required: true, message: "必须选择设备" }],
    contract_date: [{ required: true, message: "必须选择服务到期日期" }],
    owner: [{ required: true, message: "必须输入车主/业户" }],
    linkman: [{ required: true, message: "必须输入联系人" }],
    tel: [{ required: true, message: "必须输入联系电话" }],
    area: [{ required: true, message: "必须选择地区" }],
    vin: [{ required: true, message: "必须输入车辆识别代码/车架号" }],
    brand_id: [{ required: true, message: "必须输入车辆品牌" }],
    model: [{ required: true, message: "必须输入车辆车辆型号" }],
    vtype: [{ required: true, message: "必须输入车辆车辆类型" }],
    engine_no: [{ required: true, message: "必须输入发动机号" }],
    engine_type: [{ required: true, message: "必须输入发动机型号" }],
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
          if (value == "--" || value == "0" || value == "－－") {
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
          }
          if (value == "--" || value == "－－") {
            callback();
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
          if (parseFloat(value) > vm.formData.total_ton) {
            new Error("核定载质量需小于总质量");
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
          }
          value = parseFloat(value);
          if (value < 1000) {
            callback(new Error("货厢内部尺寸宽不能小于1000"));
          }
          if (vm.formData.box_length != "" && value >= vm.formData.box_length) {
            callback(new Error("必须小于外廓尺寸长"));
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
          }
          if (value < 1) {
            callback(new Error("货厢内部尺寸宽必须大于1"));
          }
          if (vm.formData.box_length != "" && value >= vm.formData.box_length) {
            callback(new Error("必须小于外廓尺寸长"));
          }
          callback();
        }
      }
    ],
    axis: [{ required: true, message: "必须输入轴数" }],
    issue_date: [{ required: true, message: "必须输入行驶证发证日期" }]
  });

  function boxEmpty() {
    return (
      vm.formData.box_length == "--" &&
      vm.formData.box_height == "--" &&
      vm.formData.box_width == "--"
    );
  }
  // function validateSize() {
  //   if (
  //     vm.formData.length > vm.formData.width &&
  //     vm.formData.length > vm.formData.height
  //   ) {
  //     return true;
  //   } else {
  //     return "宽、高要小于长";
  //   }
  // }
};
//【车辆识别代码/车架号】与【车牌号、车牌颜色】二者至少填一项；【核定载质量】与【准牵引总质量】二者至少填一项

//货厢内部尺寸需判断：同一辆车，货厢内部尺寸要小于该车的外部尺寸
//货厢内部尺寸的宽、高要小于长
//内部外部尺寸都必须大于1000，【货厢内部尺寸高】可以小于1000
