import ajax from "./ajax.js";
import qs from "qs";
export const AddRegion = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("/vehicle/AddRegion", queryQS, {
    params: query
  });
};
export const GetRegionByPage = query => {
  return ajax.get("/vehicle/GetRegionByPage", {
    params: query
  });
};

export const DeleteRegion = query => {
  return ajax.get("/vehicle/DeleteRegion", {
    params: query
  });
};
