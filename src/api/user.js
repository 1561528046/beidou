//user API
import ajax from "./index.js";
import qs from "qs";
export const getVehicleList = query => {
  return ajax.get("/get_vehicle", {
    params: query
  });
};

export const getArea = query => {
  return ajax.get("/Public/GetAreaByParentID", {
    params: query
  });
};

//用户管理
export const getUserAll = query => {
  query = query || {
    user_type: ""
  };
  return ajax.get("/user/GetAll", {
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
export const addUser = query => {
  query = qs.stringify(query);
  return ajax.post("user/Add", query);
};
export const updateUser = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("user/Update", queryQS, {
    params: query
  });
};
export const delUser = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("user/Delete", queryQS, {
    params: query
  });
};

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
//角色管理
export const getRoleAll = query => {
  return ajax.get("/role/GetAll", {
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
//登陆
export const loginIn = query => {
  return ajax.get("/user/Login/", {
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
