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
  },
  {
    title: "主链路登录应答消息",
    desc: `链路类型:主链路。消息方向:上级平台往下级平台。
          业务数据类型标识:UP_CONNCCT_RSP。
          描述:上级平台对下级平台登录请求信息、进行安全验证后，返回相应的验证结果`,
    body: {
      MessageID: "x1002",
      MSG_GNSSCENTERID: "下级平台接入码",
      RESUL:
        "0x00:成功;0x01:IP 地址不正确；0x02:接入码不正确；0x03:用户没用注册；0x04:密码错误;0x05:资源紧张，稍后再连接(已经占用）；0x06：其他",
      VERIFY_CODE: "校验码"
    }
  },
  {
    title: "主链路注销请求消息",
    desc: `链路类型:主链路。
    消息方向：下级平台往上级平台
    业务数据类型标识：UP_DISCONNECT_REQ。
    描述：下级平台在中断与上级平台的主链路连接时，应向上级平台发送主链路注销请求
    消息。`,
    body: {
      MessageID: "x1003",
      MSG_GNSSCENTERID: "下级平台接入码",
      USERID: "用户名",
      PASSWORD: "密码"
    }
  },
  {
    title: "主链路注销应答消息",
    desc: `链路类型:主链路。
    消息方向:上级平台往下级平台。
    业务数据类型标识:UP_DISCONNECT_RSP。
    描述:上级平台收到下级平台发送的主链路注销请求消息后，向下级平台返回主链路注应答消息，并记录链路注销日志，下级平台接收到应答消息后，可中断主从链路联接`,
    body: {
      MessageID: "x1004",
      MSG_GNSSCENTERID: "下级平台接入码"
    }
  },
  {
    title: "主链路连接保持请求消息",
    desc: `链路类型:主链路。
    消息方向:下级平台往上级平台。
    业务数据类型标识:UP_LINKTEST_REQ。
    描述:下级平台向上级平台发送主链路连接保持清求消息，以保持主链路的连接`,
    body: {
      MessageID: "x1005",
      MSG_GNSSCENTERID: "下级平台接入码"
    }
  },
  {
    title: "主链路连接保持应答消息",
    desc: `链路类型:主链路。
    消息方向:I 级平台往下级平台。
    .业务数据类型标识:UP_LINKTEST_RSP。
    描述:上级平台收到下级平台的主链路连接保持请求消息后，向下级平台返回.主链路连
    接保持应答消息，保持主链路的连接状态。`,
    body: {
      MessageID: "x1006",
      MSG_GNSSCENTERID: "下级平台接入码"
    }
  },
  {
    title: "主链路断开通知消息",
    desc: `链路类型:从链路
    消息方向:下级平台往上级平台。
    业务数据类型标识:UP_DISCONNECT_INFORM。
    描述:'当主链路中断后，下级平台可通过从链路向上级平台发送本消息通知上级平台主
    链路中断，本条消息无需被通知方应答。`,
    body: {
      MessageID: "x1007",
      MSG_GNSSCENTERID: "下级平台接入码",
      ERROR_CODE: "0x00:主链路断开；0x01：其他原因"
    }
  },
  {
    title: "下级平台主动关闭主从链路通知消息",
    desc: `链路类型:从链路。
    消息方向:下级平台往上级平台。
    业务数据类型标识:UP_CLOSELINK_INFORM。
    描述:下级平台作为服务端，发现从链路出现异常时，下级平台通过从链路向上级平台
    发送本消息，通知上级平台下级平台即将关闭主从链路，本条消息
    无需被通知方应答;`,
    body: {
      MessageID: "x1008",
      MSG_GNSSCENTERID: "下级平台接入码",
      REASON_CODE: "0x00:网关重启； 0x01：其他原因"
    }
  },
  {
    title: "上传车辆注册信息消息",
    desc: `描述:监控平台收到车载终端鉴权信息后，启动本命令向上级监管平台上传该车辆注册信息. 各级监管平台再逐级向上级平台上传该信息，其数据体规定见表 19。本条消息服务端无需
    应答`,
    body: {
      MessageID: "x1200",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车牌颜色，按照 JT/T 415-2006 中 5.4.12 的规定。",
      DATA_TYPE: "x1201",
      DATA_LENGTH: "后续数据长度",
      PLATFORM_ID: "平台唯一编码，由平台所在地行政区划代码和平台编号组成。",
      PRODUCER_ID:
        "车载终端厂商唯一编码，由车载终端厂商所在地行政区划代码和制造商 ID 组成。",
      TERMINAL_MODEL_TYPE: "车载终端型号，不足 20 位时以“\0”终结。",
      TERMINAL_ID: "车载终端编号，大写字母和数字组成。",
      TERMINAL_SIMCODE:
        "车载终端 SIM 卡电话号码。号码不足 12位，则在前补充数字 0。"
    }
  },
  {
    title: "实时上传车辆定位信息消息",
    desc: `描述:主要描述车辆的实时定位信息，`,
    body: {
      MessageID: "x1200",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车辆颜色，按照JT/T415-2006中5.4.12的规定",
      DATA_TYPE: "x1202",
      DATA_LENGTH: "后续数据长度",
      GNSS_DATA:
        '{"EXCRYPT":1,"DATE":[30,10,7,219],"TIME":[17,50,9],"DATETIME":"10/30/2011 17:50:09","LON":117.17,"LAT":31.52,"VEC1":100,"VEC2":100,"VEC3":10000,"DIRECTION":300,"ALTITUDE":500,"STATE":0,"ALARM":0,"ErrorBytes":null}'
    }
  },
  {
    title: "车辆定位信息自动补报请求消息",
    desc: `描述:如果平台间传输链路中断，下级平台重新登录并与上级平台建立通信链路后，下
    级平台应将中断期间内车载终端上传的车辆定位信息自动补报到上级平台。如果系统断线期
    间，该车需发送的数据包条数大于 5，则以每包五条进行补发，直到补发完毕。多条数据以
    卫星定位时间先后顺序排列。本条消息上级平台采用定量回复，即收到一定数量的数据后，
    即通过从链路应答数据量`,
    body: {
      MessageID: "x1200",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车辆颜色，按照JT/T415-2006中5.4.12的规定",
      DATA_TYPE: "x1203",
      DATA_LENGTH: "后续数据长度",
      GNSS_CNT: "该数据包里包含的微星定位数据个数1<=GNSS_CNT<=5。",
      GNSS_DATA:
        '{"EXCRYPT":1,"DATE":[30,10,7,219],"TIME":[17,50,9],"DATETIME":"10/30/2011 17:50:09","LON":117.17,"LAT":31.52,"VEC1":100,"VEC2":100,"VEC3":10000,"DIRECTION":300,"ALTITUDE":500,"STATE":0,"ALARM":0,"ErrorBytes":null}'
    }
  },
  {
    title: "启动车辆定位信息交换应答消息",
    desc: `描述：本条消息是下级平台对上级平台下发的 DOWN_EXG_MSG_RETURN_STARTUP 消
    息的应答消息`,
    body: {
      MessageID: "x1200",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号，返回DOWN_EXG_MSG_RETURN_SARTUP 消息中的车牌号",
      VEHICLE_COLOR: "车辆颜色，按照 JT/T415-2006 中5.4.12 的规定",
      DATA_TYPE: "x1205",
      DATA_LENGTH: "后续数据长度，值为 0x00000000"
    }
  },
  {
    title: "结束车辆定位信息交换应答消息",
    desc: `描述:本条消息是下级平台对上级平台服务器端下发的 UP_EXG_MSG_RETURN_END 消息
    的应答`,
    body: {
      MessageID: "x1200",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号，返回DOWN_EXG_MSG_RETURN_SARTUP 消息中的车牌号",
      VEHICLE_COLOR: "车辆颜色，按照 JT/T415-2006 中5.4.12 的规定",
      DATA_TYPE: "x1206",
      DATA_LENGTH: "后续数据长度，值为 0x00000000"
    }
  },
  {
    title: "申请交换指定车辆定位信息请求消息",
    desc: `描述:当下级平台需要在特定时问段内监控特殊车辆时，可上传此命令到上级平台申请
    对该车辆定位数据交换到下级平台，申请成功后，此车辆定位数据将在指定时间内交换到该
    平台(即使该车没有进入该平台所属区域也会交换)`,
    body: {
      MessageID: "x1200",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车辆颜色，按照 JT/T415-2006 中5.4.12 的规定",
      DATA_TYPE: "x1207",
      DATA_LENGTH: "后续数据长度",
      START_TIME: "开始时间，用 UTC 时间表示",
      END_TIME: "结束时间，用 UTC 时间表示"
    }
  },
  {
    title: "取消交换指定车辆定位信息请求消息",
    desc: `描述：下级平台上传该命令给上级平台，取消之前申请监控的特殊车辆`,
    body: {
      MessageID: "x1200",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车辆颜色，按照 JT/T415-2006 中5.4.12 的规定",
      DATA_TYPE: "x1208",
      DATA_LENGTH: "后续数据长度,值为 0x00000000"
    }
  },
  {
    title: "补发车辆定位信息请求消息",
    desc: `描述:在平台间传输链路中断并重新建立连接后，下级平台向上级平台请求中断期间内
    上级平台需交换至下级平台的车辆定位信息时，向上级平台发出补发车辆定位信息请求，上
    级平台对请求应答后进行“补发车辆定位信息”`,
    body: {
      MessageID: "x1200",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车辆颜色，按照 JT/T415-2006 中5.4.12 的规定",
      DATA_TYPE: "x1209",
      DATA_LENGTH: "后续数据长度",
      START_TIME: "开始时间，用 UTC 时间表示",
      END_TIME: "结束时间，用 UTC 时间表示"
    }
  },
  {
    title: "上报驾驶员身份信息应答消息",
    desc: `描述:下级平台应答上级平台发送的上报驾驶员身份信息请求消息，上传指定车辆的驾驶员
    身份信息数据`,
    body: {
      MessageID: "x1200",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车辆颜色，按照 JT/T415-2006 中5.4.12 的规定",
      DATA_TYPE: "x120A",
      DATA_LENGTH: "后续数据长度",
      DRIVER_NAME: "驾驶员姓名",
      DRIVER_ID: "身份证编号",
      LICENCE: "从业资格证（备用）",
      ORG_NAME: "发证机构名称（备用）"
    }
  },
  {
    title: "上报车辆电子运单应答消息",
    desc: `描述:下级平台应答上级平台发送的上报车辆电子运单请求消息，向上级平台上传车辆当前
    电子运单`,
    body: {
      MessageID: "x1200",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车辆颜色，按照 JT/T415-2006 中5.4.12 的规定",
      DATA_TYPE: "x120B",
      DATA_LENGTH: "后续数据长度",
      EWAYBILL_LENGTH: "电子运单数据体长度",
      EWAYBILL_INFO: "电子运单数据内容"
    }
  },
  {
    title: "主动上报驾驶员身份信息消息",
    desc: `描述：下级平台在接收到车载终端上传的驾驶员身份信息后，主动向上级平台上报该信
    息`,
    body: {
      MessageID: "x1200",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车牌颜色，按照 JT/T 415-2006 中 5.4.12 的规定",
      DATA_TYPE: "x120C",
      DATA_LENGTH: "后续数据长度",
      DRIVER_NAME: "驾驶员姓名",
      DRIVER_ID: "身份证编号",
      LICENCE: "从业资格证号（备用）",
      ORG_NAME: "发证机构名称（备用）"
    }
  },
  {
    title: "主动上报车辆电子运单信息消息",
    desc: `下级平台主动上报车辆电子运单信息，向上级平台上报车辆当前电子运单`,
    body: {
      MessageID: "x1200",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车牌颜色，按照 JT/T 415-2006 中 5.4.12的规定",
      DATA_TYPE: "x120D",
      DATA_LENGTH: "后续数据长度",
      EWAYBILL_LENGTH: "电子运单数据体长度",
      EWAYBILL_INFO: "电子运单数据内容"
    }
  },
  {
    title: "平台查岗应答消息",
    desc: `描述:下级平台根据查岗对象的类型将上级平台发送的不定期平台查岗消息发送到不同的查岗对
    象，并将不同查岗对象的应答分别转发给上级平台`,
    body: {
      MessageID: "x1300",
      MSG_GNSSCENTERID: "下级平台接入码",
      DATA_TYPE: "x1301",
      DATA_LENGTH: "后续数据长度",
      OBJECT_TYPE:
        "查岗对象的类型,当前连接的下级平台 0X01,下级平台所属单一业户 0X02,下级平台所属所有业户 0X03",
      OBJECT_ID:
        "查岗对象的 ID，长度不足时后补 0X00，定义如下：对象类型为平台时，由平台行政区划代码和平台唯一编码组成；对象类型为业户时，为业户经营许可证号",
      INFO_ID: "信息 ID，本 ID 跟下发的 ID 相同。",
      INFO_LENGTH: "数据长度",
      INFO_CONTENT: "应答内容"
    }
  },
  {
    title: "下发平台间报文应答消息",
    desc: `描述:下级平台收到上级平台发送的下发平台间报文请求消息后，根据相应的下发报文
    对象类型，进行转发，并向上级平台发送应答消息`,
    body: {
      MessageID: "x1300",
      MSG_GNSSCENTERID: "下级平台接入码",
      DATA_TYPE: "x1302",
      DATA_LENGTH: "后续数据长度",
      INFO_ID: "收到信息 ID"
    }
  },
  {
    title: "报警督办应答消息",
    desc: `描述：下级平台应答上级平台下发的报警督办请求消息`,
    body: {
      MessageID: "x1400",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车辆颜色，按照 JT/T415-2006中 5.4.12 的规定",
      DATA_TYPE: "x1401",
      DATA_LENGTH: "后续数据长度",
      SUPERVISION_ID: "报警督办 ID",
      RESULT:
        "报警处理结果，定义如下：0x00:处理中；0x01:以处理完毕；0x02:不作处理；0x03:将来处理"
    }
  },
  {
    title: "上报报警信息消息",
    desc: `描述：下级平台向上级平台上报某车辆的报警信息`,
    body: {
      MessageID: "x1400",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车辆颜色，按照 JT/T415-2006中 5.4.12 的规定",
      DATA_TYPE: "x1402",
      DATA_LENGTH: "后续数据长度",
      WARN_SRC:
        "报警信息来源，定义如下：0x01:车载终端；0x02:企业监控平台；0x03:政府监管平台；0x09:其他",
      WARN_TYPE: "报警类型",
      WARN_TIME: "报警时间，UTC 时间格式",
      INFO_ID: "信息 ID",
      INFO_LENGTH: "报警数据长度，最长 1024 字节",
      INFO_CONTENT: "上报报警信息内容"
    }
  },
  {
    title: "主动上报报警处理结果信息消息",
    desc: `描述：下级平台向主动向上级平台上报报警处理结果`,
    body: {
      MessageID: "x1400",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车牌颜色，按照 JT/T 415-2006 中 5.4.12 的规定。",
      DATA_TYPE: "x1403",
      DATA_LENGTH: "后续数据长度",
      INFO_ID: "报警信息 ID",
      RESULT:
        "报警处理结果，定义如下：0x00：处理中；0x01：已处理完毕；0x02：不作处理；0x03：将来处理。"
    }
  },
  {
    title: "车辆单向监听应答消息",
    desc: `描述:下级平台向上级平台上传车辆单向监听请求消息的应答`,
    body: {
      MessageID: "x1500",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车牌颜色，按照 JT/T 415-2006 中 5.4.12 的规定。",
      DATA_TYPE: "x1501",
      DATA_LENGTH: "后续数据长度",
      RESULT: "车辆单向监听应答结果，定义如下：0x00：监听成功 0x01：监听失败"
    }
  },
  {
    title: "车辆拍照应答消息",
    desc: `描述:下级平台应答上级平台发送的车辆拍照请求消息`,
    body: {
      MessageID: "x1500",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车牌颜色，按照 JT/T 415-2006 中 5.4.12 的规定。",
      DATA_TYPE: "x1502",
      DATA_LENGTH: "后续数据长度",
      PHOTO_RSP_FLAG:
        "拍照应答标识，标识拍照后的结果或原因, 定义如下:0x00:布支持拍照;0x01:完成拍照:0x02:完成拍照、照片数据稍后传送;0x03:未拍照(不在线);0x04:未拍照;(无法使用指定镜头);0x05:未拍照(其他原因）；0x09:车牌号码错误",
      GNSS_DATA:
        '{"EXCRYPT":1,"DATE":[30,10,7,219],"TIME":[17,50,9],"DATETIME":"10/30/2011 17:50:09","LON":117.17,"LAT":31.52,"VEC1":100,"VEC2":100,"VEC3":10000,"DIRECTION":300,"ALTITUDE":500,"STATE":0,"ALARM":0,"ErrorBytes":null}',
      LENS_ID: "镜头 ID",
      PHOTO_LEN: "图片长度",
      SIZE_TYPE:
        "图片大小，定义如下：Ox01:320x240:Ox02:640x480;Ox03:800x600;Ox04:1024x768;Ox05: l 76x 144[QCIF];0x06:352*288[CIF];0x07:704*288[HALF D1];0x08:704*576[D1]"
    }
  },
  {
    title: "下发车辆报文应答消息",
    desc: `描述:下级平台应答上级平台下发的报文是否成功到达指定车辆`,
    body: {
      MessageID: "x1500",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车牌颜色，按照 JT/T 415-2006 中 5.4.12 的规定。",
      DATA_TYPE: "x1503",
      DATA_LENGTH: "后续数据长度",
      MSG_ID: "对应“下发车辆报文请求消息”中的MSG_ID",
      RESULT: "下发车辆报文应答结果，定义如下：0x00：下发成功0x01：下发失败"
    }
  },
  {
    title: "上报车辆行驶记录应答消息",
    desc: `描述:下级平台应答上级平台下发的上报车辆行驶记录请求消息，将车辆行驶记录数据
    上传至上级平台`,
    body: {
      MessageID: "x1500",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车牌颜色，按照 JT/T 415-2006 中 5.4.12 的规定。",
      DATA_TYPE: "x1504",
      DATA_LENGTH: "后续数据长度",
      COMMAND_TYPE: "命令字，按照 GB/T 19056 中相关要求",
      TRAVELDATA_LENGTH: "车辆行驶记录数据体长度",
      TRAVELDATA_INFO: "车辆行驶记录信息，按照GB/T 19056 的规定。"
    }
  },
  {
    title: "车辆应急接入监管平台应答消息",
    desc: `描述:下级平台应答上级平台下发的车辆应急接入监管平台请求消息应答`,
    body: {
      MessageID: "x1500",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车牌颜色，按照 JT/T 415-2006 中 5.4.12 的规定。",
      DATA_TYPE: "x1505",
      DATA_LENGTH: "后续数据长度",
      RESULT: "0x00：车载终端成功收到该命令；0x01：无该车辆0x02：其他原因失败"
    }
  },
  {
    title: "补报车辆静态信息应答消息",
    desc: `描述:上级平台应答下级平台发送的补报车辆静态信息清求消息`,
    body: {
      MessageID: "x1600",
      MSG_GNSSCENTERID: "下级平台接入码",
      VEHICLE_NO: "车牌号",
      VEHICLE_COLOR: "车牌颜色，按照 JT/T 415-2006 中 5.4.12 的规定。",
      DATA_TYPE: "x1505",
      DATA_LENGTH: "后续数据长度",
      CAR_INFO: '{ "TRANS_TYPE": "030", "VIN": "测A12345" }'
    }
  }
];
