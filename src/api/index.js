import axios from "axios";
import { Message } from "element-ui";
import qs from "qs";
// 创建axios实例
const ajax = axios.create({
  headers: {
    "Content-Type": "application/x-www-form-urlencoded" //请求头
  },
  baseURL: "http://192.168.88.6:5000/mock/11/",
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
      Message({
        showClose: true,
        message: "JSON格式错误！",
        type: "error"
      });
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
  return ajax.get("/get_area", {
    params: query
  });
};
//设备管理
export const getDeviceList = query => {
  return ajax.get("/device/GetAll", {
    params: query
  });
};
export const getDeviceAdd = query => {
  query = qs.stringify(query);
  return ajax.post("/device/Add", query);
};
export const getDeviceUpdate = query => {
  query = qs.stringify(query);
  return ajax.post("/device/Update", {
    params: query
  });
};
export const getDeviceDelete = query => {
  query = qs.stringify(query);
  return ajax.post("/device/Delete", query);
};
// 维修设备管理
export const getDeviceRepairList = query => {
  return ajax.get("/device_repair/GetAll", {
    params: query
  });
};
// SIM卡管理
export const getDeviceSimList = query => {
  return ajax.get("/sim/GetAll", {
    params: query
  });
};
// 终端厂商管理
export const getDeviceCompany = query => {
  return ajax.get("/device_company/GetAll", {
    params: query
  });
};
export const getUserList = query => {
  return ajax.get("/user/GetUserByPage", {
    params: query
  });
};
export const addUser = query => {
  query = qs.stringify(query);
  return ajax.post("user/AddUser", query);
};
export const getUser = query => {
  return ajax.get("/user/GetUserById", {
    params: query
  });
};
