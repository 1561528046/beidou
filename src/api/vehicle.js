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
export const syncVehicle = query => {
  console.log(query);
  //同步车辆数据
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/SynVehicle", queryQS);
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
