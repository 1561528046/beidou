import ajax from "./index.js";
// eslint-disable-next-line
import qs from "qs";
//产品管理
export const getProductList = query => {
  return ajax.get("/ordermanage/GetFees_packageListByPage", {
    params: query
  });
};
export const addProducts = query => {
  var queryQS = {
    title: query.title,
    location_device_list: JSON.stringify(query.detail),
    device_company_list: JSON.stringify(query.company),
    sms_list: JSON.stringify(query.sms)
  };
  queryQS = qs.stringify(queryQS);
  return ajax.post("/ordermanage/AddFees_packageAndDetail", queryQS);
};
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
