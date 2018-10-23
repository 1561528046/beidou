import { dict } from "./base.js";
import utils from "./utils.js";
export default class Instruction {
  constructor() {
    this.ws = new WebSocket(dict.INSTRUCTION_URL);
    this.wsInterval = null;
    this.handlers = new Map();
    /*handlers结构
      {
        x08021561616116:[fn1,fn2,fn3],指令ID+sim_id
      }    
     */

    this.ws.addEventListener("message", evt => {
      this.emit(evt);
    });
    this.init();
  }
  init() {
    this.ws.onopen = () => {
      this.ws.send("^heart$");
      this.wsInterval = setInterval(() => {
        this.ws.send("^heart$");
      }, 20000);
    };
  }
  send(instruction) {
    this.ws.send(instruction);
  }
  on(event, sim_id, fn) {
    sim_id = "0".repeat(12 - sim_id.length) + sim_id;
    var key = event + sim_id;
    if (!this.handlers.has(key)) {
      this.handlers.set(key, new Set());
    }
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
    var message = evt.data
      .replace("$", "")
      .replace("^", "")
      .split("|");
    if (message[0] != "heart") {
      try {
        var sim_id = message[message.length - 1];
        if (sim_id.length != 12) {
          sim_id = message[message.length - 2];
        }
        var key = message[0] + sim_id;
        for (var fn of this.handlers.get(key)) {
          try {
            fn(evt);
          } catch (err) {
            console.warn(err);
          }
        }
      } catch (err) {
        console.warn(err);
      }
    }
  }
}
