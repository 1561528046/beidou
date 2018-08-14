//通用API
import ajax from "./index.js";
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
