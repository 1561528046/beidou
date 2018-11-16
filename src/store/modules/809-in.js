export default {
  namespaced: true,
  state: {
    data: new Map(),
    dataVersion: 0
  },
  mutations: {
    add(state, data) {
      state.dataVersion++;
      data.id = state.dataVersion;
      if (data.DATA_TYPE == 0x9301) {
        //如果是查岗，初始化答案以及回答状态
        data.answer = "";
        data.answered = false;
      }
      state.data.set(data.id, data);
    },
    remove(state, id) {
      if (state.data.has(id)) {
        state.data.delete(id);
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
      return Array.from(state.data.values()).filter(item => {
        return item.DATA_TYPE != 0x9301;
      });
    },
    list9301: function(state) {
      void state.dataVersion;
      return Array.from(state.data.values()).filter(item => {
        return item.DATA_TYPE == 0x9301;
      });
    }
  }
};
