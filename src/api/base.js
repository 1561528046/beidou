//通用API
import ajax from "./ajax.js";
// eslint-disable-next-line
import qs from "qs";
//根据parent_id 获取地区
export const getArea = query => {
  return ajax.get("/Public/GetAreaByParentID", {
    params: query
  });
};
//根据地区名称获取地区（模糊筛选）
export const getAreaByName = query => {
  return ajax.get("/Public/GetAreaByName", {
    params: query
  });
};
export const getWarnList = query => {
  Object.assign(
    {
      page: "1",
      size: "10",
      StartTime: "",
      EndTime: ""
    },
    query
  );
  return ajax.get("/report/GetAlarmProcessList", {
    params: query
  });
};
// 设置系统配置
export const UpdateConfig = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/SystemSet/UpdateConfig", queryQS);
};
// 获取系统配置列表
export const GetConfigList = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/SystemSet/GetConfigList", queryQS);
};
