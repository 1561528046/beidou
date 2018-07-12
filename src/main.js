import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "normalize.css";
import "element-ui/lib/theme-chalk/index.css";
import "@/style/index.less";
import router from "./router";
import axios from "axios";
//https://www.easy-mock.com/mock/5b46ade66c716f5074cd9dc4/t1
var axios1 = axios.create({
  baseURL: "https://www.easy-mock.com/mock/5b46ade66c716f5074cd9dc4/",
  timeout: 2000
});
Vue.prototype.$ajax = axios1;
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
