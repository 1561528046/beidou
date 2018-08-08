import ajax from "./index.js";
import qs from "qs";
//产品管理
export const getProductAll = query => {
  return ajax.get("/product/GetAll", {
    params: query
  });
};
export const addProduct = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/product/Add", queryQS, {
    params: query
  });
};
