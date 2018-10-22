import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import contentmenu from "v-contextmenu";
import "v-contextmenu/dist/index.css";
import "normalize.css";
import "element-ui/lib/theme-chalk/index.css";
import "vue2-animate/dist/vue2-animate.min.css"; //demo:https://the-allstars.com/vue2-animate/
import "@/style/index.less";
import router from "./router/index.js";
import ajax from "@/api/ajax.js";
import "@/utils/md5.js";
import store from "./store";
import { dict, utils } from "./utils/base";
import "./utils/directive";
import Instruction from "./utils/instruction.js";
Vue.prototype.$monitor = {};
Vue.prototype.$ajax = ajax;
Vue.prototype.$dict = dict;
Vue.prototype.$utils = utils;
Vue.prototype.$instruction = new Instruction();
window.routerDict = {};
function createRouterMap(router, $parent) {
  router.map(route => {
    route.$parent = $parent;
    window.routerDict[route.name] = route;
    if (route.children) {
      createRouterMap(route.children, route);
    }
  });
}
createRouterMap(router.options.routes, router);
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(contentmenu); //右键菜单
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
