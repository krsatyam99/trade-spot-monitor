
class Action {
  callback: Function;

  constructor(callback: Function) {
    this.callback = callback;
  }

  excuteAction(data: messagePayload) {
    this.callback(data);
  }
}

export default Action;
