export default {
  state: {
    singleVehiclesSet: new Set(), //单车监控标签
    singleVehiclesLog: 0, //触发computed
    currentTab: "index",
    tabs: [], //标签管理（单车监控标签通过singleVehicle管理）
    currentVehicleForTab: {} //单车查看 报警、异常对应的车辆
  },
  mutations: {
    openSingleVehicle(state, vehicle) {
      state.singleVehiclesSet.add(vehicle);
      state.currentTab = "single-" + vehicle.sim_id;
      state.singleVehiclesLog++;
    },
    closeSingleVehicle(state, vehicle) {
      state.singleVehiclesLog++;
      state.singleVehiclesSet.delete(vehicle);
      state.currentTab = "index";
    },
    changeCurrentTag(state, tabName) {
      state.curerntTab = tabName;
    },
    openTab(state, tabName) {
      state.currentTab = tabName;
      if (state.tabs.indexOf(tabName) == -1) {
        state.tabs.push(tabName);
      }
    },
    closeTab(state, tabName) {
      state.currentTab = "index";
      var index = state.tabs.indexOf(tabName);
      if (index != -1) {
        state.tabs.splice(index, 1);
      }
    },
    setCurrentVehicleForTab(state, vehicle) {
      state.currentVehicleForTab = vehicle;
    }
  },
  actions: {},
  getters: {
    singleVehicles: function(state) {
      void state.singleVehiclesLog;
      return Array.from(state.singleVehiclesSet);
    }
  }
};
