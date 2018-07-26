export const rules = {
  name: [
    { required: true, message: "请输入活动名称", trigger: "blur" },
    { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
  ],
  vehicle_type: [
    { required: true, message: "请选择车辆类型", trigger: "change" }
  ],
  user_name: [
    { required: true, message: "请输入用户名", trigger: "change" },
    {
      min: 3,
      max: 20,
      message: "长度在 3 到 20 个字符",
      trigger: "change"
    }
  ],
<<<<<<< HEAD
  sim_no: [
    {
      min: 11,
      max: 12,
      message: "请输入11~12位SIM卡号",
=======
  device_type: [
    { required: true, message: "请选择设备类型", trigger: "change" }
  ],
  device_id: [
    { required: true, message: "请输入设备Id", trigger: "change" },
    {
      required: true,
      min: 3,
      max: 10,
      message: "长度在 3 到 10 个字符",
      trigger: "change"
    }
  ],
  sim_id: [
    { required: true, message: "请输入sim id", trigger: "change" },
    {
      required: true,
      min: 11,
      max: 14,
      message: "长度在 11 到 14 个字符",
>>>>>>> 989ed2b1f199a953300d8dd14adafc5bb75145fe
      trigger: "change"
    }
  ]
};
