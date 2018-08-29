import axios from "axios";
import { Message } from "element-ui";
// eslint-disable-next-line
import store from "@/store";
// eslint-disable-next-line
import { dict } from "@/utils/base.js";

//import qs from "qs";
//获取用户token，如果没有，跳转到登录页面
// 创建axios实例
const ajax = axios.create({
  headers: {
    // "Content-Type": "application/x-www-form-urlencoded", //请求头
    Authorization: store.state.user.token
  },
  // baseURL: "http://localhost:10462/api/",
  // baseURL: "http://192.168.88.100:725/api/"
  baseURL: dict.API_URL
  // timeout: 5000 // request timeout
});
// 添加请求拦截器
ajax.interceptors.request.use(
  function(config) {
    // config.headers["Authorization"] = store.state.user.token;
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
    }
    if (response.status != 200) {
      Message({
        showClose: true,
        message: "接口错误，错误码" + response.status,
        type: "error"
      });

      return response;
    }
    if (response.data.code == 3) {
      store.dispatch("loginOut").then(() => {
        location.reload();
      });
    }
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
