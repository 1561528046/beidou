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
