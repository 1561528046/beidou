//车辆API
//vehicle API
import ajax from "./ajax.js";
import qs from "qs";
export const getVheicleAll = query => {
  return ajax.get("/vehicle/GetAll", {
    params: query
  });
};

export const getVehicleList = query => {
  query = Object.assign(
    {
      size: 10,
      page: 1,
      user_id: "",
      state: ""
    },
    query
  );
  return ajax.get("/vehicle/GetVehicleByPage", {
    params: query
  });
};
export const getVehicle = query => {
  return ajax.get("/vehicle/GetVehicleByID", {
    params: query
  });
};

export const addVehicle = query => {
  var queryQS = qs.stringify(query);
  // return ajax.post("http://localhost:10462/api/vehicle/AddVehicle", query);
  return ajax.post(
    "http://192.168.88.88:10462/api/vehicle/AddVehicle",
    queryQS
  );
};
export const updateVehicle = query => {
  var queryQS = qs.stringify(query);
  return ajax.post(
    "http://192.168.88.88:10462/api/vehicle/UpdateVehicle",
    queryQS
  );
};
export const delVehicle = query => {
  return ajax.post("/vehicle/DeleteVehicle", "", {
    params: {
      vehicle_id: query.vehicle_id,
      vid: query.vid,
      license: query.license,
      province_id: query.province_id
    }
  });
};
export const getVehicleBrand = query => {
  query = Object.assign(
    {
      brand_name: ""
    },
    query
  );
  return ajax.get("/vehicle/GetBrandByField", {
    params: query
  });
};
export const getVehicleType = query => {
  query = Object.assign(
    {
      brand_name: "",
      brand_mold: ""
    },
    query
  );
  return ajax.get("/vehicle/GetMoldByField", {
    params: query
  });
};
export const getVehicleDetails = query => {
  query = Object.assign(
    {
      brand_name: "",
      brand_mold: ""
    },
    query
  );
  return ajax.get("/vehicle/GetMoldExtByField", {
    params: query
  });
};
