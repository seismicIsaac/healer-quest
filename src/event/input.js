
class InputHandler {
  constructor(doc) {
    doc.addEventListener('keydown', this.handleKeyDown.bind(this));
    doc.addEventListener('keyup', this.handleKeyUp.bind(this));
    this.keys = {
      up: false,
      left: false,
      right: false,
      down: false
    }
  }

  handleKeyDown(event) {
    const key = event.key;
    if (key === 'w' || key === 'ArrowUp') {
      this.keys.up = true;
    }
    if (key === 'a' || key === 'ArrowLeft') {
      this.keys.left = true;
    }
    if (key === 'd' || key === 'ArrowRight') {
      this.keys.right = true;
    }
    if (key === 's' || key === 'ArrowDown') {
      this.keys.down = true;
    }
  }

  handleKeyUp(event) {
    const key = event.key;
    if (key === 'w' || key === 'ArrowUp') {
      this.keys.up = false;
    }
    if (key === 'a' || key === 'ArrowLeft') {
      this.keys.left = false;
    }
    if (key === 'd' || key === 'ArrowRight') {
      this.keys.right = false;
    }
    if (key === 's' || key === 'ArrowDown') {
      this.keys.down = false;
    }
  }

  isNoInputCurrently() {
    return !Object.keys(this.keys).some(key => this.keys[key]);
  }

  getKeys() {
    return this.keys;
  }
}

export default InputHandler;