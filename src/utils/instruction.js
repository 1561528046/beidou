import { dict } from "./base.js";
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
  off() {}
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
