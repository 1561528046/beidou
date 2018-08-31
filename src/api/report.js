import ajax from "./ajax.js";
// eslint-disable-next-line
import qs from "qs";
// 根据子用户查询
export const getUserChildrenList = query => {
  return ajax.get("/user/GetUserChildrenList", {
    params: query
  });
};
// 行驶轨迹明细
export const getReport = query => {
  return ajax.get("/Report/GetLocationDetailByPage", {
    params: query
  });
};
// 轨迹超速汇总表
export const getDrivingSummary = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/Report/GetOverspeedSummaryByPage", queryQS, {
    params: query
  });
};
// 轨迹超速明细表
export const getDrivingDetails = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/Report/GetOverspeedDetailByPage", queryQS, {
    params: query
  });
};
// 查询车辆分页（报表）
export const getVehicleByPage = query => {
  return ajax.get("/vehicle/GetVehicleByPage", {
    params: query
  });
};
// 报警统计表
export const getAlarmSummaryByPage = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/Report/GetAlarmSummaryByPage", queryQS, {
    params: query
  });
};
// 报警明细表
export const getAlarmDetailByPage = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/Report/GetAlarmDetailByPage", queryQS, {
    params: query
  });
};
// 里程汇总表
export const getMileageSummaryByPage = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/Report/GetMileageSummaryByPage", queryQS, {
    params: query
  });
};
// 里程明细表
export const getMileageDetailByPage = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/Report/GetMileageDetailByPage", queryQS, {
    params: query
  });
};
