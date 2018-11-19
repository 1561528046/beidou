import { dict } from "./base.js";
import utils from "./utils.js";
export default class Instruction {
  constructor() {
    this.onceList = new Map();
    this.ws = null;
    this.wsInterval = null;
    this.handlers = new Map();
    /*handlers结构
      {
        x08021561616116:[fn1,fn2,fn3],指令ID+sim_id
      }    
     */

    this.init();
  }
  init() {
    clearInterval(this.wsInterval);
    this.ws = new WebSocket(dict.INSTRUCTION_URL);
    this.ws.onopen = () => {
      this.ws.send("^heart$");
      this.wsInterval = setInterval(() => {
        this.ws.send("^heart$");
      }, 20000);
    };
    this.ws.addEventListener("message", evt => {
      this.emit(evt);
    });
    this.ws.onclose = () => {
      //重连
      setTimeout(() => {
        this.init();
      }, 2000);
    };
  }
  send(instruction) {
    this.ws.send(instruction);
  }
  on(event, sim_id, fn) {
    if (typeof sim_id === "function") {
      fn = sim_id;
    }
    var key = event;
    if (sim_id && typeof sim_id != "function") {
      sim_id = "0".repeat(12 - sim_id.length) + sim_id;

      key = event + sim_id;
    }
    if (!this.handlers.has(key)) {
      this.handlers.set(key, new Set());
    }
    this.handlers.get(key).add(fn);
  }
  once(event, sim_id, fn) {
    //执行一次后删除监听函数
    if (typeof sim_id === "function") {
      fn = sim_id;
    }
    var key = event;
    if (sim_id && typeof sim_id != "function") {
      sim_id = "0".repeat(12 - sim_id.length) + sim_id;
      key = event + sim_id;
    }
    if (!this.handlers.has(key)) {
      this.handlers.set(key, new Set());
    }
    this.onceList.set(fn, this.handlers.get(key));
    this.handlers.get(key).add(fn);
  }
  off(ins, sim_id, handler) {
    sim_id = "0".repeat(12 - sim_id.length) + sim_id;
    //删除指定事件
    var handers = this.handlers.get(ins + sim_id);
    if (handers && handers.size) {
      handers.delete(handler);
      if (handers.size == 0) {
        this.handlers.delete(ins + sim_id);
      }
    }
  }
  offAll(ins, sim_id) {
    //in sim_id 参数不能少于一个
    //注销所有对应监听
    if (!ins && sim_id) {
      sim_id = "0".repeat(12 - sim_id.length) + sim_id;
      this.offAllWithSim(sim_id);
      return false;
    }
    if (!sim_id && ins) {
      this.offAllWithIns(ins);
      return false;
    }
    sim_id = "0".repeat(12 - sim_id.length) + sim_id;
    this.handlers.delete(ins + sim_id);
  }
  offAllWithSim(sim_id) {
    //删除该SIM所有相关监听
    sim_id = utils.formatSim(sim_id);
    for (var [key] of this.handlers) {
      if (key.slice(0, 5).indexOf(sim_id) != -1) {
        this.handlers.delete(key);
      }
    }
  }
  offAllWithIns(ins) {
    //删除该指令所有相关监听
    for (var [key] of this.handlers) {
      if (key.slice(5).indexOf(ins) != -1) {
        this.handlers.delete(key);
      }
    }
  }
  emit(evt) {
    if (evt.data[0] == "^") {
      var sim_id;
      var messageId;
      var message = evt.data
        .replace("$", "")
        .replace("^", "")
        .split("|");
      sim_id = message[message.length - 1];
      if (sim_id.length != 12) {
        sim_id = message[message.length - 2];
      }
      messageId = message[0];
    } else {
      var data = JSON.parse(evt.data);
      sim_id = data.SimID;
      messageId = data.MessageID;
      // if (data.MSG_ID) {
      //   data.MSG_ID = "x" + data.MSG_ID.toString(16);
      //   messageId = data.MSG_ID;
      // } else {
      //   messageId = data.MessageID;
      // }
    }

    if (messageId != "heart") {
      try {
        var key = messageId + sim_id || "";
        if (this.handlers.has(key)) {
          for (var fn of this.handlers.get(key)) {
            try {
              fn(evt);
              if (this.onceList.has(fn)) {
                this.onceList.get(fn).delete(fn);
                this.onceList.delete(fn);
              }
            } catch (err) {
              console.warn(err);
            }
          }
        }
        if (this.handlers.has(messageId)) {
          for (var fn1 of this.handlers.get(messageId)) {
            try {
              fn1(evt);
              if (this.onceList.has(fn1)) {
                this.onceList.get(fn1).delete(fn1);
                this.onceList.delete(fn1);
              }
            } catch (err) {
              console.warn(err);
            }
          }
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }
}
