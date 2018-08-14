import ajax from "./index.js";
// eslint-disable-next-line
import qs from "qs";
//产品管理
// 产品查询
export const getProductAll = query => {
  return ajax.get("/ordermanage/GetAllFees_package", {
    params: query
  });
};
// 分页查询
export const getProductList = query => {
  return ajax.get("/ordermanage/GetFees_packageListByPage", {
    params: query
  });
};
// 产品名称查询
export const getProduct = query => {
  return ajax.get("/ordermanage/GetByFees_packageID", {
    params: query
  });
};
// 查询收费项
export const getProductDetail = query => {
  return ajax.get("/ordermanage/GetAllByPackageId", {
    params: query
  });
};
// 添加产品
export const addProducts = query => {
  var queryQS = {
    title: query.title
  };
  queryQS = qs.stringify(queryQS);
  return ajax.post("/ordermanage/AddFees_package", queryQS);
};
// 添加收费单项
export const addProductDetail = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/ordermanage/AddFees_package_detail", queryQS);
};
// 删除收费项
export const delProductDetail = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/ordermanage/DeleteFees_package_detail", queryQS, {
    params: query
  });
};
// 修改产品
export const updateProducts = query => {
  var queryQS = {
    title: query.title,
    location_device_list: JSON.stringify(query.detail),
    device_company_list: JSON.stringify(query.company),
    sms_list: JSON.stringify(query.sms)
  };
  queryQS = qs.stringify(queryQS);
  return ajax.post("/ordermanage/UpdateFees_packageAndDetail", queryQS);
};
// 删除产品
export const delProduct = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/ordermanage/DeleteFees_package", queryQS, {
    params: query
  });
};
