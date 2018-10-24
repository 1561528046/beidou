export default {
  namespaced: true,
  state: {
    data: new Map(),
    dataVersion: 0
  },
  mutations: {
    add(state, data) {
      debugger;
      state.dataVersion++;
      state.data.set(data.SimID, data);
    },
    remove(state, sim_id) {
      if (state.data.has(sim_id)) {
        state.data.delete(sim_id);
        state.dataVersion++;
      }
    },
    removeAll(state) {
      state.dataVersion++;
      this.data = new Map();
    }
  },
  actions: {},
  getters: {
    list: function(state) {
      void state.dataVersion;
      return Array.from(state.data.values());
    }
  }
};
