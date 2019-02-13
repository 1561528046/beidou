export const rightsDict = {
  //权限字典
  //relation 引用次数，用于解决一个权限 用于 多个依赖，引用次数为0的时候，即可清空选项
  "1": {
    name: "车辆管理",
    //checked:true,//选中状态
    children: {
      "1": {
        name: "车辆"
        //checked:true,//选中状态
        //selected: [], //已经选择的
        //children: {
        // "1":{ name: "新增车辆-添加", rights_id: "1-1-1",relation:1,checked:true }
        //}
      },
      "2": {
        name: "故障车辆"
      },
      "3": {
        name: "车辆数据连接"
      },
      "4": {
        name: "车辆参数设置"
      }
    }
  },
  "2": {
    name: "终端管理",
    children: {
      "1": {
        name: "终端管理"
      },
      "2": {
        name: "设备维修"
      },
      "3": {
        name: "SIM卡"
      },
      "4": {
        name: "终端厂商管理"
      }
    }
  },
  "3": {
    name: "订单管理",
    children: {
      "1": {
        name: "产品管理"
      },
      "2": {
        name: "订单管理"
      },
      "3": {
        name: "充值管理"
      },
      "4": {
        name: "订单审核"
      },
      "5": {
        name: "新增订单"
      }
    }
  },
  "4": {
    name: "用户管理",
    children: {
      "1": {
        name: "企业管理"
      },
      "2": {
        name: "角色管理"
      }
    }
  },
  "5": {
    name: "车队分组/分车管理",
    children: {
      "1": {
        name: "车队分组/分车管理"
      }
    }
  },
  "6": {
    name: "司机信息管理",
    children: {
      "1": {
        name: "司机信息管理"
      }
    }
  },
  "7": {
    name: "报表统计",
    children: {
      "1": {
        name: "报表统计"
      }
    }
  },
  "8": {
    name: "报警信息管理",
    children: {
      "1": {
        name: "报警信息管理"
      }
    }
  },
  "9": {
    name: "视频监控",
    children: {
      "1": {
        name: "视频监控"
      }
    }
  },
  "10": {
    name: "云镜控制",
    children: {
      "1": {
        name: "云镜控制"
      }
    }
  },
  "11": {
    name: "录像管理",
    children: {
      "1": {
        name: "录像管理"
      }
    }
  },
  "12": {
    name: "系统管理",
    children: {
      "1": {
        name: "系统管理"
      }
    }
  }
};

export const rightsRelation = {
  //权限依赖关系
  "1-1-1": ["1-1-4"], //"新增车辆-添加"
  "1-1-2": ["1-1-4"], //新增车辆-删除
  "1-1-3": ["1-1-4"], //新增车辆-修改
  "1-1-4": ["2-1-4", "2-3-4"], //新增车辆-查看
  "1-1-5": ["1-1-4"], //新增车辆-导出
  "1-1-6": ["1-1-4"], //新增车辆-导入
  "1-1-7": ["1-1-4"], //车辆-车辆位置
  "1-1-8": ["1-1-4", "1-1-3"], //车辆-更新定位
  "1-2-1": ["1-2-3"], //故障车辆-添加
  "1-2-2": ["1-2-3"], //故障车辆-故障排除
  "1-3-1": ["1-1-4"], //车辆数据连接
  "1-4-2": ["1-1-4"], //车辆参数设置
  "2-1-1": ["2-1-4"], //终端管理-添加
  "2-1-2": ["2-1-4"], //终端管理-删除
  "2-1-3": ["2-1-4"], //终端管理-修改
  "2-1-4": ["2-4-4", "4-1-4"], //终端管理-查看
  "2-1-5": ["2-1-4"], //终端管理-导入
  "2-1-6": ["2-1-4"], //终端管理-导出
  "2-1-7": ["2-1-4", "4-1-4"], //终端管理-绑定
  "2-2-1": ["2-1-4", "2-2-3"], //设备维修-添加
  "2-2-2": ["2-2-3"], //设备维修-修改
  "2-3-1": ["2-3-4"], //SIM卡-添加
  "2-3-2": ["2-3-4"], //SIM卡-删除
  "2-3-3": ["2-3-4"], //SIM卡-修改
  "2-3-5": ["2-3-4"], //SIM卡-充值,
  "2-3-6": ["2-3-4"], //SIM卡-导入,
  "2-3-7": ["2-3-4"], //SIM卡-导出
  "2-4-1": ["2-4-4"], //终端厂商管理-添加
  "2-4-2": ["2-4-4"], //终端厂商管理-删除
  "2-4-3": ["2-4-4"], //终端厂商管理-修改
  "3-1-1": ["2-4-4", "3-1-4"], //产品管理-添加
  "3-1-2": ["3-1-4"], //产品管理-删除
  "3-1-3": ["3-1-4", "2-4-4"], //产品管理-修改
  "3-1-5": ["4-1-4", "3-1-4"], //产品管理-分配用户
  "3-2-1": ["3-2-2"], //订单管理-取消
  "3-3-1": ["3-3-2"], //充值管理-充值
  "3-4-1": ["3-4-2"], //订单审核-审核
  "3-4-3": ["3-4-2"], //订单审核-取消
  "4-1-1": ["4-1-4", "4-2-4"], //企业管理-添加
  "4-1-2": ["4-1-4"], //企业管理-删除
  "4-1-3": ["4-1-4", "4-2-4"], //企业管理-修改
  "8-1-1": ["1-1-4", "2-2-3", "2-3-4"] //报警信息管理
};
