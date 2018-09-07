import ajax from "./ajax.js";
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
// 编辑收费单项
export const updateProductDetail = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/ordermanage/UpdateFees_package_detail", queryQS, {
    params: query
  });
};
// 删除收费项
export const delProductDetail = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/ordermanage/DeleteFees_package_detail", queryQS, {
    params: query
  });
};
// 修改产品名称
export const updateProducts = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/ordermanage/UpdateFees_package", queryQS, {
    params: query
  });
};
// 删除产品
export const delProduct = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/ordermanage/DeleteFees_package", queryQS, {
    params: query
  });
};
// 获取产品下的用户
export const getProductUser = query => {
  return ajax.get("/ordermanage/GetFeesPackageUser", {
    params: query
  });
};
// 获取未绑定产品的用户
export const getProductAllUnbind = query => {
  query = Object.assign(
    {
      page: 1,
      size: 10
    },
    query
  );
  return ajax.get("/ordermanage/GetUnboundFeesPackage", {
    params: query
  });
};
// 批量用户绑定产品
export const addProductUser = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/ordermanage/FeesPackageBindUser", queryQS, {
    params: { package_id: query.package_id }
  });
};
// 用户解绑产品
export const delProductUser = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/ordermanage/FeesPackageUntieUser", queryQS, {
    params: { package_id: query.package_id }
  });
};

// 查询订单
export const getOrderList = query => {
  return ajax.get("/ordermanage/GetReviewOrderListByPage", {
    params: query
  });
};
export const getUserOrderList = query => {
  return ajax.get("/ordermanage/UserGetOrderListByPage", {
    params: query
  });
};

// 根据单号查询资料
export const getEnquiry = query => {
  return ajax.get("/ordermanage/GetByOrder_No", {
    params: query
  });
};
// 确认订单
export const ReviewOrder = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/ordermanage/ReviewOrder", queryQS, {
    params: query
  });
};
// 取消订单
export const CancelOrder = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/ordermanage/CancelOrder", queryQS, {
    params: query
  });
};
// 取消订单审核
export const ReviewCancel = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/ordermanage/ReviewCancel", queryQS, {
    params: query
  });
};
// 充值管理列表
export const getCanRechargeUsers = query => {
  return ajax.get("/ordermanage/GetCanRechargeUsers", {
    params: query
  });
};
// 充值
export const Recharge = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/ordermanage/Recharge", queryQS, {
    params: query
  });
};
// 获取充值记录
export const getUserRechargeRecord = query => {
  return ajax.get("/ordermanage/GetUserRechargeRecord", {
    params: query
  });
};
// 获取当前用户名下绑定了收费产品的用户列表
export const getBindFeesPackageUsers = query => {
  return ajax.get("/ordermanage/GetBindFeesPackageUsers", {
    params: query
  });
};
// 获取需要当前用户审核的订单
export const getReviewOrderListByPage = query => {
  return ajax.get("/ordermanage/GetReviewOrderListByPage", {
    params: query
  });
};
// 查询某个用户名下所有的订单
export const getUserOrderListByPage = query => {
  return ajax.get("/ordermanage/GetUserOrderListByPage", {
    params: query
  });
};
