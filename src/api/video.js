import ajax from "./ajax.js";
// import qs from "qs";
// 音视频资源目录结构树
export const getPathByID = query => {
  return ajax.get("/video/GetPathByID", {
    params: query
  });
};
// 音视频资源目录-查询视频
export const getVideo = query => {
  return ajax.get("/video/GetVideo", {
    params: query
  });
};
// 音视频资源目录-查询车牌号
export const getLicense = query => {
  return ajax.get("/video/GetLicense", {
    params: query
  });
};
// 音视频资源目录-查询通道
export const getChannel = query => {
  return ajax.get("/video/GetChannel", {
    params: query
  });
};
// 音视频资源目录-查询当前用户
export const getCurrentUser = query => {
  return ajax.get("/video/GetCurrentUser", {
    params: query
  });
};
