//user API
import ajax from "./ajax.js";
import qs from "qs";
//司机信息管理
export const getDriverByID = query => {
  return ajax.get("/driver/Getdriver808BySimID", {
    params: query
  });
};
export const getDriverAll = query => {
  return ajax.get("/driver/GetAll", {
    params: query
  });
};
export const getDriverList = query => {
  return ajax.get("/driver/GetListByPage", {
    params: query
  });
};
export const addDriver = query => {
  query = qs.stringify(query);
  return ajax.post("/driver/Add", query);
};
export const updateDriver = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/driver/Update", queryQS, {
    params: query
  });
};
export const delDriver = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/driver/Delete", queryQS, {
    params: query
  });
};
export const getDriver = query => {
  return ajax.get("/driver/GetById", {
    params: query
  });
};
export const bindingVehicle = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/driver/AddDriverVehicle", queryQS, {
    params: query
  });
};
// 异常驾驶行为评分
export const GetAbnormal = query => {
  return ajax.get("/driver/GetAbnormal", {
    params: query
  });
};
// 驾驶员评分
export const GetStatistics = query => {
  return ajax.get("/driver/GetStatistics", {
    params: query
  });
};
