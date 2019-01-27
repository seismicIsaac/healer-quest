
class Signal {
  constructor() {
    this.callbacks = [];
  }

  add(callback) {
    this.callbacks.push(callback);
  }

  remove(callbackToRemove) {
    this.callbacks = this.callbacks.filter(callback => callback !== callbackToRemove);
  }

  removeAll() {
    this.callbacks = [];
  }

  dispatch() {
    this.callbacks.forEach(callback => callback());
  }
}

export default Signal;