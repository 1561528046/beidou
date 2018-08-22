var userData = JSON.parse(localStorage.BEIDOU || "{}");
const user = {
  state: {
    token: userData.token || "", //token
    rights: userData.rights || [], //用户权限范围
    loginTime: "", //登陆日期 判断用户失效
    user_id: userData.user_id || "", //用户ID
    real_name: userData.real_name || "" //昵称
  },
  mutations: {
    loginIn(state, userInfo) {
      state.real_name = userInfo.real_name;
      state.rights = userInfo.rights.split(",");
      state.user_id = userInfo.user_id;
      state.token = userInfo.token;
      localStorage.setItem("BEIDOU", JSON.stringify(state));
    },
    clearLoginInfo() {
      localStorage.removeItem("BEIDOU");
    }
  },
  actions: {
    loginOut(context) {
      console.log(111);
      return new Promise(resolve => {
        context.commit("clearLoginInfo");
        resolve();
      });
    }
  },
  getters: {
    isLogin: state => {
      return !!state.token;
    }
  }
};

export default user;
