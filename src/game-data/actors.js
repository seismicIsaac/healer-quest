export const ACTOR_TYPE_AI = 'AI';
export const ACTOR_NAME_MONSTER = 'monster';
export const ACTOR_NAME_FIGHTER = 'fighter';
export const ACTOR_NAME_HEALER = 'healer';

const DEFAULT_ACTION_PICKER = function() {
  let action, actionName;
  for (let i = 0; i < this.actionPriority.length; i++) {
    actionName = this.actionPriority[i];
    action = this.actionsByName[actionName];
    if (action.cooldownCounter >= action.cooldownFrames) {
      return {
        targetName: action.specificTargetName || this.currentTargetName,
        type: action.type,
        name: actionName,
        damage: action.damage
      }
    }
  }
  return { type: 'idle' };
}

export const DEFAULT_HEALER = {
  name: ACTOR_NAME_HEALER,
  type: 'HUMAN',
  x: 150,
  y: 150,
  width: 48,
  height: 48,
  hitboxWidth: 24,
  hitboxHeight: 24,
  speed: 4,
  hpCurrent: 10,
  hpTotal: 10,
  mana: 50,
  manaTotal: 50,
  facingDirection: 'down',
  actionsByName: {

  },
  actionPicker: function() {
    return {type: 'idle'};
  }
}

export const DEFAULT_MONSTER = {
  name: ACTOR_NAME_MONSTER,
  type: ACTOR_TYPE_AI,
  x: 20,
  y: 20,
  hpCurrent: 1500,
  hpTotal: 1500,
  currentTargetName: ACTOR_NAME_FIGHTER,
  actionsByName: {
    'spider-attack1': {
      type: 'basic-attack',
      cooldownCounter: 0,
      cooldownFrames: 120,
      damage: 50
    },
    'spider-projectile1': {
      type: 'basic-projectile',
      cooldownCounter: 0,
      cooldownFrames: 90,
      damage: 4,
      specificTargetName: 'healer'
    }
  },
  globalCooldownCounter: 0,
  globalCooldownFrames: 40,
  actionPriority: ['spider-attack1', 'spider-projectile1'],
  actionPicker: DEFAULT_ACTION_PICKER
}

export const DEFAULT_FIGHTER = {
  name: ACTOR_NAME_FIGHTER,
  type: ACTOR_TYPE_AI,
  x: 90,
  y: 20,
  hpCurrent: 900,
  hpTotal: 900,
  currentTargetName: ACTOR_NAME_MONSTER,
  actionsByName: {
    'monk-attack1': {
      type: 'basic-attack',
      cooldownCounter: 0,
      cooldownFrames: 75,
      damage: 35
    }
  },
  globalCooldownCounter: 0,
  globalCooldownFrames: 40,
  actionPriority: ['monk-attack1'],
  actionPicker: DEFAULT_ACTION_PICKER
}