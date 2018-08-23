import ajax from "./ajax.js";
// eslint-disable-next-line
import qs from "qs";
export const getReport = query => {
  return ajax.get("/Report/GetLocationDataByPage", {
    params: query
  });
};
