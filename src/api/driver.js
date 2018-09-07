//user API
import ajax from "./ajax.js";
import qs from "qs";
//司机信息管理
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
