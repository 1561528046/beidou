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
    type: [{ required: true, message: "必须选择车辆类型" }],
    sim_no: [{ required: true, message: "必须选择安装SIM卡号" }],
    device_id: [{ required: true, message: "必须选择设备" }],
    contract_date: [{ required: true, message: "必须选择服务到期日期" }],
    owner: [{ required: true, message: "必须输入车主/业户" }],
    linkman: [{ required: true, message: "必须输入联系人" }],
    tel: [{ required: true, message: "必须输入联系电话" }],
    area: [{ required: true, message: "必须选择地区" }],
    vin: [{ required: true, message: "必须输入车辆识别代码/车架号" }],
    brand_id: [{ required: true, message: "必须输入车辆品牌" }],
    model: [{ required: true, message: "必须输入车辆品牌" }],
    vtype: [{ required: true, message: "必须输入车辆品牌" }],
    engine_no: [{ required: true, message: "必须输入车辆品牌" }],
    engine_type: [{ required: true, message: "必须输入车辆品牌" }],
    total_ton: [{ required: true, message: "必须输入车辆品牌" }],
    load_ton: [{ required: true, message: "必须输入车辆品牌" }],
    //load_ton total_ton 2选一必填
    draw_ton: [{ required: true, message: "必须输入车辆品牌" }],
    length: [{ required: true, message: "必须输入车辆品牌" }],
    width: [{ required: true, message: "必须输入车辆品牌" }],
    heigth: [{ required: true, message: "必须输入车辆品牌" }],
    box_length: [{ required: true, message: "必须输入车辆品牌" }],
    box_width: [{ required: true, message: "必须输入车辆品牌" }],
    box_height: [{ required: true, message: "必须输入车辆品牌" }],
    axis: [{ required: true, message: "必须输入车辆品牌" }]
  });
};
