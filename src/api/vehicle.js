//车辆API
//vehicle API
import ajax from "./ajax.js";
import qs from "qs";
export const getVheicleAll = query => {
  return ajax.get("/vehicle/GetAll", {
    params: query
  });
};

export const getVehicleList = query => {
  query = Object.assign(
    {
      size: 10,
      page: 1,
      user_id: "",
      state: ""
    },
    query
  );
  return ajax.get("/vehicle/GetVehicleByPage", {
    params: query
  });
};
export const getVehicleAll = query => {
  return ajax.get("/vehicle/GetVehicleByPage", {
    params: query
  });
};
export const getVehicle = query => {
  return ajax.get("/vehicle/GetVehicleByID", {
    params: query
  });
};

export const addVehicle = query => {
  var queryQS = qs.stringify(query);
  // return ajax.post("http://localhost:10462/api/vehicle/AddVehicle", query);
  return ajax.post("/vehicle/AddVehicle", queryQS);
};
export const firstTimeVehicle = query => {
  //更新定位
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/FirstTimeVehicle", queryQS);
};
export const updateVehicle = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/UpdateVehicle", queryQS);
};
export const delVehicle = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/DeleteVehicle", queryQS);
};
export const getVehicleBrand = query => {
  query = Object.assign(
    {
      brand_name: ""
    },
    query
  );
  return ajax.get("/vehicle/GetBrandByField", {
    params: query
  });
};
export const getVehicleType = query => {
  query = Object.assign(
    {
      brand_name: "",
      brand_mold: ""
    },
    query
  );
  return ajax.get("/vehicle/GetMoldByField", {
    params: query
  });
};
export const getVehicleDetails = query => {
  query = Object.assign(
    {
      brand_name: "",
      brand_mold: ""
    },
    query
  );
  return ajax.get("/vehicle/GetMoldExtByField", {
    params: query
  });
};
// 车辆故障查询
export const getRepairListByPage = query => {
  return ajax.get("/vehicle/GetRepairListByPage", {
    params: query
  });
};
//车辆故障申报
export const getUpdateVehicleState = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/UpdateVehicleState", queryQS, {
    params: query
  });
};
// 查看维修明细
export const getVehicleOperateLog = query => {
  return ajax.get("/vehicle/GetVehicleOperateLog", {
    params: query
  });
};
// 车辆平台续费
export const AddFeeVehicle = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/AddFeeVehicle", queryQS, {
    params: query
  });
};

// 获取已绑定车辆
export const getVehicleBinding = query => {
  query = Object.assign(
    {
      page: 1,
      size: 10,
      group_id: "",
      level: "",
      license: "",
      owner: ""
    },
    query
  );
  return ajax.get("/vehicle/GetVehicleBindByPage", {
    params: query
  });
};

// 获取未绑定车辆
export const getVehicleUnBinding = query => {
  query = Object.assign(
    {
      page: 1,
      size: 10,
      license: "",
      owner: ""
    },
    query
  );
  return ajax.get("/vehicle/GetVehicleUnBindByPage", {
    params: query
  });
};

// 车辆绑定到组
export const bindingGroup = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/BindVehicle", queryQS);
};
// 车辆解绑
export const unBindingGroup = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/UnBindVehicle", queryQS);
};
// 判断当前车辆是否有开通厂商的权限
export const CheckUserIsOpenCompany = query => {
  return ajax.get("/vehicle/CheckUserIsOpenCompany", {
    params: query
  });
};
// 验证车辆是否允许激活厂商，厂商续费，平台续费
export const checkUserRenewAndActive = query => {
  return ajax.get("/ordermanage/CheckUserRenewAndActive", {
    params: query
  });
};
// 根据车牌号单车查询
export const GetVehicleByLicense = query => {
  return ajax.get("/vehicle/GetVehicleByLicense", {
    params: query
  });
};
// 获取车辆历史轨迹
export const GetVehicleLocation = query => {
  return ajax.get("/report/GetVehicleLocation", {
    params: query
  });
};

// 从全国平台下载（单车导入）
export const LoadInGGHYPT = query => {
  return ajax.get("/vehicle/LoadInGGHYPT", {
    params: query
  });
};
// 同步车辆数据（全国平台）
export const SynVehicle = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/SynVehicle", queryQS);
};

// 查询车辆在全国平台的设备号和SimId
export const getDeviceAndSIMIDByVID = query => {
  return ajax.get("/vehicle/GetDeviceAndSIMIDByVID", {
    params: query
  });
};
// 根据全国平台车辆信息添加终端及SIM卡信息
export const AddDeviceSimToVehicle = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/AddDeviceSimToVehicle", queryQS);
};
// 根据simid查询车牌号
export const GetVehicleBySIMIDToPaper = query => {
  return ajax.get("/vehicle/GetVehicleBySIMIDToPaper", {
    params: query
  });
};
