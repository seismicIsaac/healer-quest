import { calculateDistance } from "../maths/geometry";
import { getMovementTarget } from "../game-logic/ai-action-handler";

export const ACTOR_TYPE_AI = 'AI';
export const ACTOR_NAME_MONSTER = 'monster';
export const ACTOR_NAME_FIGHTER = 'fighter';
export const ACTOR_NAME_HEALER = 'healer';

const DEFAULT_ACTION_PICKER = function(healerQuestModel) {
  let action, actionName, currentTarget, targetName;
  for (let i = 0; i < this.actionPriority.length; i++) {
    actionName = this.actionPriority[i];
    action = this.actionsByName[actionName];
    targetName = action.specificTargetName || this.currentTargetName;
    currentTarget = healerQuestModel.getActorByName(targetName);
    if (!isActionUsable(this, currentTarget, action)) {
      continue;
    }
    return {
      targetName: action.specificTargetName || this.currentTargetName,
      type: action.type,
      name: actionName,
      damage: action.damage
    }
  }
  return { type: 'idle' };
}

function isActionUsable(actor, currentTarget, action) {
  if (action.type === 'movement') {
    return !isOnMovementTarget(actor, currentTarget);
  }
  const onCooldown = action.cooldownCounter < action.cooldownFrames || actor.globalCooldownCounter < actor.globalCooldownFrames;
  const inRange = calculateDistance(actor.x, actor.y, currentTarget.x, currentTarget.y) <= action.range;
  return !onCooldown && inRange;
}

function isOnMovementTarget(actor, target) {
  const movementTarget = getMovementTarget(actor, target);
  return movementTarget && actor.x === movementTarget.x && actor.y === movementTarget.y
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
  },
  globalCooldownCounter: 0,
  globalCooldownFrames: 40
}

export const DEFAULT_MONSTER = {
  name: ACTOR_NAME_MONSTER,
  type: ACTOR_TYPE_AI,
  x: 20,
  y: 20,
  width: 96,
  height: 70,
  hitboxWidth: 95,
  hitboxHeight: 69,
  hpCurrent: 1500,
  hpTotal: 1500,
  currentTargetName: ACTOR_NAME_FIGHTER,
  speed: 1,
  actionsByName: {
    'spider-attack1': {
      type: 'basic-attack',
      cooldownCounter: 0,
      cooldownFrames: 180,
      range: 90,
      damage: 50
    },
    'spider-projectile1': {
      type: 'basic-projectile',
      cooldownCounter: 0,
      cooldownFrames: 190,
      damage: 4,
      range: 250,
      specificTargetName: 'healer'
    },
    'move-to-target': {
      type: 'movement',
      cooldownCounter: 0,
      cooldownFrames: 0,
      damage: 0,
      range: 400, //this could work as aggro range as well?
      specificTargetName: 'healer',
      immuneToGlobalCooldown: true
    }
  },
  globalCooldownCounter: 0,
  globalCooldownFrames: 40,
  actionPriority: ['spider-projectile1', 'spider-attack1', 'move-to-target'],
  actionPicker: DEFAULT_ACTION_PICKER
}

export const DEFAULT_FIGHTER = {
  name: ACTOR_NAME_FIGHTER,
  type: ACTOR_TYPE_AI,
  x: 90,
  y: 20,
  width: 64,
  height: 64,
  hitboxWidth: 64,
  hitboxHeight: 64,
  hpCurrent: 900,
  hpTotal: 900,
  currentTargetName: ACTOR_NAME_MONSTER,
  speed: 2,
  actionsByName: {
    'monk-attack1': {
      type: 'basic-attack',
      cooldownCounter: 0,
      cooldownFrames: 75,
      range: 900,
      damage: 35
    }
  },
  globalCooldownCounter: 0,
  globalCooldownFrames: 40,
  actionPriority: ['monk-attack1'],
  actionPicker: DEFAULT_ACTION_PICKER
}