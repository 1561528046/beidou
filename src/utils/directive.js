import Vue from "vue";
import store from "@/store/index.js";
var userRights = store.state.user.rights;
Vue.directive("rights", {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function(el, options) {
    if (store.state.user.user_id == 1) {
      //如果是管理员
      // return false;
    }
    var domRights = options.expression;
    domRights = domRights.split(",");
    var hasRights = false;
    domRights.map(rights => {
      if (userRights.indexOf(rights) != -1) {
        hasRights = true;
      }
    });
    if (!hasRights) {
      el.remove();
    }
  }
});
