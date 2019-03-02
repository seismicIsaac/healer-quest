import { Sprite } from '../game-logic/sprite';

export function createHealerSprite() {
  const commonProperties = {
    defaultFrame: 1,
    keyFrames: 3,
    frameRate: 8,
    hitboxWidth: 24,
    hitboxHeight: 24,
    sourceXOffset: 0
  };
  const animationsByName = {
    'walk': {
      type: '4directional-walk'
    }
  }
  const sprite = new Sprite('healer-m-walk1', 48, 48, commonProperties, animationsByName, {}, 'walk-down');
  return sprite;
}

export function createMonkSprite() {
  const commonProperties = {
    defaultFrame: 0,
    keyFrames: 3,
    frameRate: 8,
    sourceXOffset: 0
  };
  const animationsByName = {
    'idle': {
      sourceYOffset: 0
    },
    'attack-queued': {
      sourceYOffset: 1
    },
    'attacking': {
      sourceYOffset: 2,
      frameRate: 4
    }
  }
  const animationSequencesByName = {
    'basic-attack': {
      states: [
        {name: 'attack-queued', iterations: 2},
        {name: 'attacking', iterations: 2}
      ]
    }
  }
  return new Sprite('monk-m-battler', 64, 64, commonProperties, animationsByName, animationSequencesByName, 'idle');
}

export function createSpiderSprite() {
  const commonProperties = {
    defaultFrame: 0,
    keyFrames: 3,
    frameRate: 8,
    sourceXOffset: 0
  };
  const animationsByName = {
    'idle': {
      sourceYOffset: 0,
      keyFrames: 1
    },
    'attack-queued': {
      sourceYOffset: 1,
      keyFrames: 4,
      frameRate: 8
    },
    'attacking': {
      sourceYOffset: 2,
      keyFrames: 5,
      frameRate: 8
    },
    'shoot': {
      sourceYOffset: 1,
      keyFrames: 4,
      frameRate: 12
    },
    'hit-by-attack': {
      sourceYOffset: 3,
      keyFrames: 4,
      frameRate: 6
    },
    'walk': {
      sourceYOffset: 4,
      keyFrames: 3,
      frameRate: 8
    }
  }
  const animationSequencesByName = {
    'basic-attack': {
      actionFrame: {
        stateIndex: 1,
        keyFrameIndex: 1,
        actingFrame: 2
      },
      states: [
        {name: 'attack-queued', iterations: 1},
        {name: 'attacking', iterations: 1}
      ]
    },
    'basic-shot': {
      actionFrame: {
        stateIndex: 0,
        keyFrameIndex: 3,
        actingFrame: 10
      },
      states: [
        {name: 'shoot', iterations: 1}
      ]
    }
  }
  const sprite = new Sprite('spider', 96, 70, commonProperties, animationsByName, animationSequencesByName, 'idle');
  sprite.missileStartOffsetX = 60;
  sprite.missileStartOffsetY = 34;
  return sprite;
}