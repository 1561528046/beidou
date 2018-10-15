import ajax from "./ajax.js";
import qs from "qs";
// 查询围栏列表
export const GetRegionByPage = query => {
  return ajax.get("/vehicle/GetRegionByPage", {
    params: query
  });
};
// 添加围栏
export const AddRegion = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/AddRegion", queryQS);
};
// 删除围栏
export const DeleteRegion = query => {
  return ajax.get("/vehicle/DeleteRegion", {
    params: query
  });
};
// 查询围栏已绑定的车辆
export const GetRegionBindByPage = query => {
  return ajax.get("/vehicle/GetRegionBindByPage", {
    params: query
  });
};
// 查询围栏未绑定的车辆
export const GetRegionUnBindByPage = query => {
  return ajax.get("/vehicle/GetRegionUnBindByPage", {
    params: query
  });
};
// 围栏绑定车辆
export const RegionBindVehicle = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/RegionBindVehicle", queryQS, {
    params: query
  });
};
// 围栏解绑车辆
export const RegionUnBindVehicle = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/RegionUnBindVehicle", queryQS, {
    params: query
  });
};
