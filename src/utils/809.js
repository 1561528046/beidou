export const instruction809 = [
  {
    title: "主链路登录请求消息",
    desc: `链路类型:主链路。
        消息方向:下级平台往上级平台。
        业务数据类型标识: UP_CONNECT_REQ。
        描述:下级平台向上级平台发送用户名和密码等登录信息。`,
    body: {
      MessageID: "x1001",
      MSG_GNSSCENTERID: "下级平台接入码",
      userID: "用户名",
      PASSWORD: "密码",
      DOWN_LINK_IP: "下级平台提供对应的从链路服务端 IP 地址",
      DOWN_LINK_PORT: "下级平台提供对应的从链路服务器端口号"
    }
  }
];
