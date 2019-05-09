import ajax from "./ajax.js";
import qs from "qs";
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

// 修改通道
export const updateChannel = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/video/UpdateChannel", queryQS, {
    params: query
  });
};
// 根据设备ID查询通道
export const getChannelByDeviceID = query => {
  return ajax.get("/video/GetChannelByDeviceID", {
    params: query
  });
};
// 根据设备ID查询通道数量
export const getCameraNumByDeviceID = query => {
  return ajax.get("/video/GetCameraNumByDeviceID", {
    params: query
  });
};
// （视频）根据当前用户查询车辆列表
export const getVehiclelList = query => {
  return ajax.get("/video/GetVehiclelList", {
    params: query
  });
};
// 添加预置位
export const addChannelPreset = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/video/AddChannelPreset", queryQS, {
    params: query
  });
};
// 修改预置位
export const updateChannelPreset = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/video/UpdateChannelPreset", queryQS, {
    params: query
  });
};
// 删除预置位
export const deleteChannelPreset = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/video/DeleteChannelPreset", queryQS, {
    params: query
  });
};
// 查询预置位
export const getPresetByChannel = query => {
  return ajax.get("/video/GetPresetByChannel", {
    params: query
  });
};
// 查询报警联动
export const getAlarmLinkBySimID = query => {
  return ajax.get("/video/GetAlarmLinkBySimID", {
    params: query
  });
};
// 添加报警联动
export const addAlarmLink = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/video/AddAlarmLink", queryQS, {
    params: query
  });
};
// 修改报警联动
export const updateAlarmLink = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/video/UpdateAlarmLink", queryQS, {
    params: query
  });
};
// 删除报警联动
export const deleteAlarmLink = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/video/DeleteAlarmLink", queryQS, {
    params: query
  });
};
// 查询单个报警联动信息
export const getAlarmLinkByID = query => {
  return ajax.get("/video/GetAlarmLinkByID", {
    params: query
  });
};

// 查询录像文件列表所缺车牌号
export const getLicenseByDeviceNo = query => {
  return ajax.get("/video/GetLicenseByDeviceNo", {
    params: query
  });
};
// 查询录像文件列表所缺报警信息
export const getAlarmDetailByPageVedio = query => {
  return ajax.get("/video/GetAlarmDetailByPageVedio", {
    params: query
  });
};
// 视频回放添加记录信息
export const addVideo = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/video/Add", queryQS, {
    params: query
  });
};

// 查询视频操作日志
export const getVideoLog = query => {
  return ajax.get("/video/GetVideoLog", {
    params: query
  });
};

// 查询流量统计列表
export const getTrafficList = query => {
  return ajax.get("/video/GetVideoFlowBySimIDs", {
    params: query
  });
};
// 视频截图
export const videoPrintscreen = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/video/VideoPrintscreen", queryQS, {
    params: query
  });
};
// 获取截图列表
export const getVideoPrintscreenList = query => {
  return ajax.get("/video/GetVideoPrintscreenList", {
    params: query
  });
};
// 编辑视频截图信息
export const updatePrintscreen = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/video/UpdatePrintscreen", queryQS, {
    params: query
  });
};
// 查询单个视频截图信息
export const getVideoPrintscreenByID = query => {
  return ajax.get("/video/GetVideoPrintscreenByID", {
    params: query
  });
};
// 查询录像文件列表
export const getVideoInfo = query => {
  return ajax.get("/video/GetVideoInfo", {
    params: query
  });
};
