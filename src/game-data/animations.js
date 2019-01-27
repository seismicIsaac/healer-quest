
export const BATTLER_STATE = {
  IDLE: 0,
  ATTACK_QUEUED: 1,
  ATTACKING: 2
}

export const SPIDER_STATE = {
  IDLE: 0,
  ATTACKING: 1,
}

const ANIMATIONS = {
  'fighter-attack-animation1': FighterAttackAnimation()
};

export function getAnimationByName(animationName) {
  if (ANIMATIONS[animationName]) {
    return ANIMATIONS[animationName];
  }
  return undefined;
};

// export function SpiderAttackSequence1(onAnimationFinished) {
//   return {
//     states: [
//       state: 
//     ]
//   }
// }

export function FighterAttackSequence(onAnimationFinished) {
  return {
    states: [
      {state: BATTLER_STATE.ATTACK_QUEUED, iterations: 2, iterationCount: 0},
      {state: BATTLER_STATE.ATTACKING, animationName: 'fighter-attack-animation1', iterations: 2, iterationCount: 0}
    ],
    stateIndex: 0,
    onAnimationSequenceFinished: onAnimationFinished
  }
}

export function HealerWalkingAnimation() {
  return {
    spriteSource: 'healer-m-walk1',
    frameCounter: 0,
    frameRate: 8,
    spriteWidth: 48,
    spriteHeight: 48,
    sourceX: 0, //where we should be in the spriteSheet
    sourceY: 0,
    keyFrames: 3,
    state: 0
  }
}

export function FighterIdleAnimation() {
  return {
    spriteSource: 'monk-m-battler',
    frameCounter: 0,
    frameRate: 8,
    spriteWidth: 64,
    spriteHeight: 64,
    sourceX: 0,
    sourceY: 0,
    keyFrames: 3,
    state: 0
  }
}

export function FighterAttackAnimation() {
  return {
    frameRate: 2
  }
}