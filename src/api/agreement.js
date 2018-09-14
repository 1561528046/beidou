import ajax from "./ajax.js";
import qs from "qs";
//808添加
export const AddServer808 = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/AddServer808", queryQS, {
    params: query
  });
};
//808修改
export const UpdateServer808 = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/UpdateServer808", queryQS, {
    params: query
  });
};
//808删除
export const DeleteServer808 = query => {
  return ajax.get("/vehicle/DeleteServer808", {
    params: query
  });
};
//809添加
export const AddServer809 = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/AddServer809", queryQS, {
    params: query
  });
};
//809修改
export const UpdateServer809 = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/UpdateServer809", queryQS, {
    params: query
  });
};
//809删除
export const DeleteServer809 = query => {
  return ajax.get("/vehicle/DeleteServer809", {
    params: query
  });
};
//808:809单项查询
export const GetServerById = query => {
  return ajax.get("/vehicle/GetServerById", {
    params: query
  });
};
//808:809分页查询
export const GetServerByPage = query => {
  return ajax.get("/vehicle/GetServerByPage", {
    params: query
  });
};
// 808或809已绑定车辆分页查询
export const GetServerBindByPage = query => {
  return ajax.get("/vehicle/GetServerBindByPage", {
    params: query
  });
};
// 808或809未绑定车辆分页查询
export const GetServerUnBindByPage = query => {
  return ajax.get("/vehicle/GetServerUnBindByPage", {
    params: query
  });
};
// 808或809绑定车辆
export const ServerBindVehicle = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/ServerBindVehicle", queryQS, {
    params: query
  });
};
// 808或808解绑车辆
export const ServerUnBindVehicle = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/ServerUnBindVehicle", queryQS, {
    params: query
  });
};
