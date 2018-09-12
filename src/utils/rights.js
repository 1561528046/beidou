export const rightsDict = {
  //权限字典
  //relation 引用次数，用于解决一个权限 用于 多个依赖，引用次数为0的时候，即可清空选项
  "1": {
    name: "车辆管理",
    //checked:true,//选中状态
    children: {
      "1": {
        name: "新增车辆"
        //checked:true,//选中状态
        //selected: [], //已经选择的
        //children: {
        // "1":{ name: "新增车辆-添加", rights_id: "1-1-1",relation:1,checked:true }
        //}
      },
      "2": { name: "定位车辆" },
      "3": { name: "到期车辆" },
      "4": { name: "故障车辆" },
      "5": { name: "车辆数据" }
    }
  },
  "2": {
    name: "终端管理",
    children: {
      "1": { name: "设备" },
      "2": { name: "设备维修" },
      "3": { name: "SIM卡" }
    }
  },
  "3": {
    name: "用户管理",
    children: {
      "1": { name: "车辆分组" },
      "2": { name: "公司用户" },
      "3": { name: "个人用户" },
      "4": { name: "司机" },
      "5": { name: "角色" }
    }
  }
};

export const rightsRelation = {
  //权限依赖关系
  "1-1-1": ["2-1-4", "2-3-4"], //"新增车辆-添加"
  "1-1-2": ["1-1-4"], //新增车辆-删除
  "1-1-3": ["2-1-4", "2-3-4"], //新增车辆-修改
  "1-1-4": ["2-1-4", "2-3-4"]
};
