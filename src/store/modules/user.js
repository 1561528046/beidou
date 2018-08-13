const storeData = {
  token: "", //token
  rights: [], //用户权限范围
  loginTime: "" //登陆日期 判断用户失效
};
localStorage.BEIDOU = JSON.stringify(storeData);
function getToken() {
  if (localStorage.BEIDOU) {
    // var userData = JSON.stringify(localStorage.BEIDOU);
    // console.log(JSON.parse(userData));
  }
}
const user = {
  state: {
    ...storeData,
    token: getToken()
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    loginOut() {}
  },
  actions: {
    // 登出
    LogOut() {}
  }
};

export default user;
