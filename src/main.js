import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "normalize.css";
import "element-ui/lib/theme-chalk/index.css";
import "@/style/index.less";
import router from "./router";
import axios from "axios";
import "@/utils/md5.js";
import { dict, utils } from "./utils/base";
//创建axios实例，注入mock拦截
var axios1 = axios.create({
  baseURL: "http://192.168.88.100:725/api/",
  timeout: 2000
});
Vue.prototype.$ajax = axios1;
Vue.prototype.$dict = dict;
Vue.prototype.$utils = utils;
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
new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
