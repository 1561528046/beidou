import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import monitor from "./modules/monitor";
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    user,
    monitor
  }
});

export default store;
