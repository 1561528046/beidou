import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import monitor from "./modules/monitor";
import QA from "./modules/QA";
import x0701 from "./modules/x0701";
import x0301 from "./modules/x0301";
import alarm from "./modules/alarm";
import x0900 from "./modules/x0900";
import x0901 from "./modules/x0901";
import x809 from "./modules/809";
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    user,
    monitor,
    QA,
    x0701,
    x0301,
    alarm,
    x0900,
    x0901,
    x809
  }
});

export default store;
