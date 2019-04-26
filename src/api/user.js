//user API
import ajax from "./ajax.js";
import qs from "qs";
//用户管理
export const getUserAll = query => {
  query = query || {
    user_type: ""
  };
  return ajax.get("/user/GetAll", {
    params: query
  });
};
// 获取当前用户的权限
export const getRightsByUserId = query => {
  return ajax.get("/role/GetRightsByUserId", {
    params: query
  });
};
export const getUserList = query => {
  query = Object.assign(
    {
      province_id: "",
      city_id: "",
      county_id: "",
      real_name: "",
      user_name: "",
      linkman: "",
      company: "",
      industry: "",
      size: 10,
      page: 1,
      user_type: "",
      user_id: ""
    },
    query
  );
  return ajax.get("/user/GetListByPage", {
    params: query
  });
};
export const getUserChildren = query => {
  return ajax.get("/user/GetUserChildren", {
    params: query
  });
};
export const getUser = query => {
  return ajax.get("/user/GetById", {
    params: query
  });
};
export const existUserName = query => {
  query = Object.assign(
    {
      user_name: ""
    },
    query
  );
  return ajax.get("/user/exists_user_name", {
    params: query
  });
};
//登陆
export const loginIn = query => {
  return ajax.get("/user/Login", {
    params: query
  });
};

export const addUser = query => {
  query = qs.stringify(query);
  return ajax.post("/user/Add", query);
};
export const updateUser = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/user/Update", queryQS, {
    params: query
  });
};
export const delUser = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("user/Delete", queryQS, {
    params: query
  });
};

//角色管理
export const getRoleAll = query => {
  return ajax.get("/role/GetAll", {
    params: query
  });
};
export const getRightsAll = query => {
  return ajax.get("/role/GetAllRights", {
    params: query
  });
};
export const getRole = query => {
  return ajax.get("/role/GetByID", {
    params: query
  });
};
export const addRole = query => {
  query = qs.stringify(query);
  return ajax.post("/role/Add", query);
};
export const updateRole = query => {
  query = qs.stringify(query);
  return ajax.post("/role/Update", query);
};
export const delRole = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/role/Delete", queryQS, {
    params: query
  });
};

//组
export const getUserGroup = query => {
  return ajax.get("/group/GetGroupChildrenByUserId", {
    params: query
  });
};
export const addGroup = query => {
  query = qs.stringify(query);
  return ajax.post("/group/Add", query);
};
export const updateGroup = query => {
  query = qs.stringify(query);
  return ajax.post("/group/Update", query);
};
export const delGroup = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/group/Delete", queryQS, {
    params: query
  });
};
export const getGroupSons = query => {
  //只获取指定组的儿子级别组
  return ajax.get("/group/GetGroupSonListByGroupId", {
    params: query
  });
};

export const getGroupChildrens = query => {
  //只获取指定组的所有子孙级别组
  return ajax.get("/group/GetGroupChildrenListByGroupId", {
    params: query
  });
};
export const getGroupByUser = query => {
  //只获取指定组的所有子孙级别组
  return ajax.get("/group/GetGroupChildrenListByUserId", {
    params: query
  });
};
// 用户绑定车辆列表
export const getUserVehicleBindByPage = query => {
  return ajax.get("/vehicle/GetUserVehicleBindByPage", {
    params: query
  });
};
// 用户未绑定车辆列表
export const getUserVehicleUnBindByPage = query => {
  return ajax.get("/vehicle/GetUserVehicleUnBindByPage", {
    params: query
  });
};
// 用户绑定车辆
export const bindUserVehicle = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/BindUserVehicle", queryQS, {
    params: query
  });
};
// 用户解绑车辆
export const unBindUserVehicle = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/UnBindUserVehicle", queryQS, {
    params: query
  });
};

// 获取需要登录的账号数量
export const GetLoginCount = query => {
  return ajax.get("/gghypt/GetLoginCount", {
    params: query
  });
};
// 获取验证码图片
export const GetVerifyCodeImg = query => {
  return ajax.get("/gghypt/GetVerifyCodeImg", {
    params: query
  });
};
// 提交验证码
export const SubmitCode = query => {
  return ajax.get("/gghypt/SubmitCode", {
    params: query
  });
};
// 获取用户下的产品
export const getUserPackage = query => {
  return ajax.get("/ordermanage/GetUserPackage", {
    params: query
  });
};
// 获取用户登录状态
export const GetLoginState = query => {
  return ajax.get("/user/GetLoginState", {
    params: query
  });
};
