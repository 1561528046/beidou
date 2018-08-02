import axios from "axios";
import { Message } from "element-ui";
import qs from "qs";
// 创建axios实例
const ajax = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded" //请求头
  },
  // baseURL: "http://192.168.88.6:5000/mock/11/",
  baseURL: "http://192.168.88.100:725/api/",
  timeout: 5000 // request timeout
});
// 添加请求拦截器
ajax.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // Message({
    //   message: "发送请求",
    //   type: "success",
    //   duration: 5 * 1000
    // });

    return config;
  },
  function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
ajax.interceptors.response.use(
  function(response) {
    if (typeof response.data == "string") {
      try {
        response.data = JSON.parse(response.data);
      } catch (err) {
        Message({
          showClose: true,
          message: "JSON格式错误！",
          type: "error"
        });
      }
      return response;
    }
    if (response.status != 200) {
      Message({
        showClose: true,
        message: "接口错误，错误码" + response.status,
        type: "error"
      });

      return response;
    }
    // 对响应数据做点什么
    return response;
  },
  function(error) {
    // 对响应错误做点什么
    console.warn("请求错误", error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);
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

//设备管理
export const getDeviceAll = query => {
  return ajax.get("/device/GetAll", {
    params: query
  });
};
export const getDeviceList = query => {
  return ajax.get("/device/GetListByPage", {
    params: query
  });
};
export const getDevice = query => {
  return ajax.get("/device/GetByID", {
    params: query
  });
};
export const addDevice = query => {
  query = qs.stringify(query);
  return ajax.post("/device/Add", query, {
    params: query
  });
};
export const updateDevice = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/device/Update", queryQS, {
    params: query
  });
};
export const delDevice = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/device/Delete", queryQS, {
    params: query
  });
};

// 维修设备管理
export const getDeviceRepairAll = query => {
  return ajax.get("/device_repair/GetAll", {
    params: query
  });
};
export const getDeviceRepairList = query => {
  return ajax.get("/device_repair/GetListByPage", {
    params: query
  });
};
export const getDeviceRepair = query => {
  return ajax.get("/device_repair/GetByID", {
    params: query
  });
};
export const addDeviceRepair = query => {
  query = qs.stringify(query);
  return ajax.post("/device_repair/Add", query);
};
export const updateDeviceRepair = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/device_repair/Update", queryQS, {
    params: query
  });
};
export const delDeviceRepair = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("device_repair/Delete", queryQS, {
    params: query
  });
};

// SIM卡管理
export const getSimAll = query => {
  return ajax.get("/sim/GetAll", {
    params: query
  });
};
export const getSimAllUnbind = query => {
  //获取所有没有绑定的SIM卡
  return ajax.get("/sim/GetUnboundListByPage", {
    params: query
  });
};
export const addUserSim = query => {
  return ajax.post("/user/AddUserSim", "", {
    params: query
  });
};
export const delUserSim = query => {
  return ajax.post("/user/DeleteUserSim", "", {
    params: query
  });
};
export const getSimList = query => {
  return ajax.get("/sim/GetListByPage", {
    params: query
  });
};
export const getSim = query => {
  return ajax.get("/sim/GetByID", {
    params: query
  });
};
export const getUserSim = query => {
  return ajax.get("/user/GetUserSim", {
    params: query
  });
};
export const addSim = query => {
  query = qs.stringify(query);
  return ajax.post("/sim/Add", query);
};
export const updateSim = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/sim/Update", queryQS, {
    params: query
  });
};
export const delSim = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("sim/Delete", queryQS, {
    params: query
  });
};
// 终端厂商管理
export const getDeviceCompanyAll = query => {
  return ajax.get("/device_company/GetAll", {
    params: query
  });
};
export const getDeviceCompanyList = query => {
  return ajax.get("/device_company/GetListByPage", {
    params: query
  });
};
export const getDeviceCompany = query => {
  return ajax.get("/device_company/GetByID", {
    params: query
  });
};
export const addDeviceCompany = query => {
  query = qs.stringify(query);
  return ajax.post("/device_company/Add", query);
};
export const updateCompany = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/device_company/Update", queryQS, {
    params: query
  });
};
export const delCompany = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/device_company/Delete", queryQS, {
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
  return ajax.get("/user/GetListByPage", {
    params: query
  });
};
export const getUser = query => {
  return ajax.get("/user/GetById", {
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

//登陆
export const loginIn = query => {
  return ajax.get("/user/Login/", {
    params: query
  });
};
