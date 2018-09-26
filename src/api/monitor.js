//user API
import ajax from "./ajax.js";

//用户管理
export const getInitVehicle = () => {
  return ajax.get("/vehicle/monitorList");
};
