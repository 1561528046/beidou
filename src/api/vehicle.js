//车辆API
//vehicle API
import ajax from "./index.js";
import qs from "qs";
export const getVheicleAll = query => {
  return ajax.get("/vehicle/GetAll", {
    params: query
  });
};

export const getVheicleList = query => {
  query = Object.assign(
    {
      size: 10,
      page: 1
    },
    query
  );
  return ajax.get("/vehicle/GetListByPage", {
    params: query
  });
};
export const getVheicle = query => {
  return ajax.get("/vehicle/GetById", {
    params: query
  });
};

export const addVehicle = query => {
  query = qs.stringify(query);
  return ajax.post("http://localhost:10462/api/vehicle/AddVehicle", query);
};
export const updateVehicle = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("vehicle/UpdateVehicle", queryQS, {
    params: query
  });
};
export const delVehicle = query => {
  var queryQS = qs.stringify(query);
  return ajax.post("vehicle/DeleteVehicle", queryQS, {
    params: query
  });
};
