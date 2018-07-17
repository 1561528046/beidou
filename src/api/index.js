import axios from "axios";
import { Message } from "element-ui";
// 创建axios实例
const ajax = axios.create({
  baseURL: "http://192.168.88.6:8888/app/mock/17",
  timeout: 5000 // request timeout
});
// 添加请求拦截器
ajax.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    Message({
      message: "发送请求",
      type: "success",
      duration: 5 * 1000
    });

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
    // 对响应数据做点什么
    return response;
  },
  function(error) {
    console.log(arguments);
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
  return ajax.get("/vehicle", {
    params: query
  });
};

export const getArea = query => {
  return ajax.get("/get_area", {
    params: query
  });
};
