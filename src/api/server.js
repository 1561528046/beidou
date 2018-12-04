import ajax from "./ajax.js";
// import qs from "qs";
export const GetDaemon = query => {
  return ajax.get("/user/GetDaemon", {
    params: query
  });
};
