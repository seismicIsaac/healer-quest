
function Timer(name, startTime, duration, onTimerFinished) {
  return {
    name: name,
    startTime: startTime,
    duration: duration,
    onTimerFinished: onTimerFinished,
  }
}

class GameClock {
  constructor(tickSpeedMillis, onTick) {
    this.tickSpeedMillis = tickSpeedMillis;
    this.timers = [];
    this.onTick = onTick;
  }

  addTimer(name, duration, onTimerFinished) {
    const startTime = Date.now();
    const newTimer = Timer(name, startTime, duration, onTimerFinished);
    this.timers.push(newTimer);
  }

  stopTimer(timerName) {
    this.timers = this.timers.filter(timer => timer.name !== timerName);
  }

  stopAllTimers() {
    this.timers = [];
  }

  start() {
    if (this.timerTick) {
      clearInterval(this.timerTick);
    }
    this.timerTick = setInterval(this.tick.bind(this), this.tickSpeedMillis);
  }

  /**
   * First, go through all our timers and make sure they've all been handled.
   * Then, proceed with the rest of the game simulation.
   */
  tick() {
    const now = Date.now();
    const deltaT = now - this.lastTick;
    const timersToRemove = [];
    this.timers.forEach((timer) => {
      if (now - timer.startTime > timer.duration) {
        timer.onTimerFinished();
        timersToRemove.push(timer);
      }
    });
    this.timers = this.timers.filter(timer => !timersToRemove.includes(timer));
    this.lastTick = now;
    this.onTick(deltaT);
  }

  //TODO: Add pause?

  stop() {
    clearInterval(this.timerTick);
  }
}

var CLOCK_SINGLETON;

export default function getGameClock(tickSpeedMillis, onTick) {
  if (!CLOCK_SINGLETON) {
    CLOCK_SINGLETON = new GameClock(tickSpeedMillis, onTick);
  }
  return CLOCK_SINGLETON;
}
