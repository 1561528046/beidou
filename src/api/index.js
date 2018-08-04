import axios from "axios";
import { Message } from "element-ui";
//import qs from "qs";
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
export default ajax;

export * from "./user.js";
export * from "./device.js";
export * from "./base.js";
export * from "./vehicle.js";
