import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import monitor from "./modules/monitor";
import QA from "./modules/QA";
import x0701 from "./modules/x0701";
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    user,
    monitor,
    QA,
    x0701
  }
});

export default store;
