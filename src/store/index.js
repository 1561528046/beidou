import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import monitor from "./modules/monitor";
import QA from "./modules/QA";
import x0701 from "./modules/x0701";
import x0301 from "./modules/x0301";
import alarm from "./modules/alarm";
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    user,
    monitor,
    QA,
    x0701,
    x0301,
    alarm
  }
});

export default store;
