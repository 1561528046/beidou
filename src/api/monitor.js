//user API
import ajax from "./ajax.js";
// import qs from "qs";
//用户管理
export const getInitVehicle = () => {
  return ajax.get("/vehicle/monitorList");
};
export const getTodayVehicleAlarm = query => {
  if (query.sim_id.length == 11) {
    query.sim_id = "0" + query.sim_id;
  }
  return ajax.get("/Report/GetVehicleAlarmList", {
    params: query
  });
};
