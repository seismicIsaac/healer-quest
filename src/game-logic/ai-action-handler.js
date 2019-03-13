import { updateActorStat, STAT_NAME_HEALTH } from "./common";
import { ACTOR_TYPE_AI } from "../game-data/actors";
import { getUnitVector, calculateDistance } from "../maths/geometry";

export function AIAction(actor, target, type) {
  this.actor = actor;
  this.target = target;
  this.type = type;
}

const ACTION_TYPE_BASIC_ATTACK = 'basic-attack';
const ACTION_TYPE_PROJECTILE = 'projectile';

export const AI_ACTION_TYPES = [
  ACTION_TYPE_BASIC_ATTACK,
  ACTION_TYPE_PROJECTILE
];

export class AIActionHandler {
  constructor(healerQuestModel, projectileSpawner) {
    this.actionFactory = new ActionFactory(healerQuestModel, projectileSpawner);
    this.healerQuestModel = healerQuestModel;
    this.projectileSpawner = projectileSpawner;
  }

  updateAIActions(actors, allActors) {
    this.startNextAIAction(actors, allActors);
    this.updateActionCooldowns(actors);
  }

  startNextAIAction(actors, allActors) {
    actors.forEach((actor) => {
      //Override movement actions, but not other actions.
      actor.movementTarget = null;
      if (actor.currentAction && actor.currentAction !== 'move-to-target') {
        return;
      } else {
        const { targetName, type, name, damage } = actor.actionPicker(this.healerQuestModel);
        const target = allActors.find((actor) => actor.name === targetName);
        actor.globalCooldownCounter = Math.min(actor.globalCooldownCounter + 1, actor.globalCooldownFrames);

        const action = this.actionFactory.getAction(actor, target, type, name, damage);
        action.invoke();
        actor.currentAction = name;
      }
    });
  }

  updateActionCooldowns(actors) {
    let action;
    actors.filter(actor => actor.type === ACTOR_TYPE_AI).forEach((actor) => {
      Object.keys(actor.actionsByName).forEach((actionName) => {
        action = actor.actionsByName[actionName];
        if (action.cooldownCounter < action.cooldownFrames) {
          action.cooldownCounter++;
        }
      });
    });
  }
  
  handleAIMovement(actor) {
    const target = actor.movementTarget;
    const direction = getUnitVector(actor.x, actor.y, target.x, target.y);
    if (direction.x < 0) {
      actor.facingDirection = 'right';
    } else if (direction.x > 0) {
      actor.facingDirection = 'left';
    } else if (target) {
      actor.facingDirection = target.actualX < actor.x ? 'left' : 'right';
    }
    actor.x -= Math.round(direction.x * actor.speed);
    actor.y -= Math.round(direction.y * actor.speed);
  }
}

function BasicAttackAction(actor, target, name, damage, projectileSpawner) {
  return {
    invoke: function() {
      actor.actionsByName[name].cooldownCounter = 0;
      actor.globalCooldownCounter = 0;
      actor.sprite.setActionAnimationSequence('basic-attack', null, () => {
        // updateActorStat(healerQuestModel, target.name, STAT_NAME_HEALTH, -damage);
        actor.currentAction = '';
        projectileSpawner.spawnDamageZone(actor, actor.sprite.currentAnim, damage);
      });
    }
  }
}

function BasicSpawnProjectileAction(actor, target, name, damage, projectileSpawner) {
  return {
    invoke: function() {
      actor.actionsByName[name].cooldownCounter = 0;
      actor.globalCooldownCounter = 0;
      actor.sprite.setActionAnimationSequence('basic-shot', null, () => {
        projectileSpawner.spawnProjectile(actor, target, name, damage);
        actor.currentAction = '';
      });
    }
  }
}

function BasicMovementCommand(actor, target) {
  return {
    invoke: function() {
      actor.movementTarget = getMovementTarget(actor, target);
      if (actor.sprite.currentAnim && actor.sprite.currentAnim.name !== 'walk') {
        actor.sprite.setCurrentAnimation('walk');
      }
    }
  }
}

function BasicIdleCommand(actor) {
  return {
    invoke: function() {
      actor.sprite.setCurrentAnimation('idle');
    }
  }
}

export function getMovementTarget(actor, target) {
  const leftSideX = target.x - actor.width;
  const y = Math.round(target.y + (target.height - actor.height) / 2);
  const rightSideX = target.x + target.width;
  let targetX;

  if (calculateDistance(actor.x, actor.y, leftSideX, y) > calculateDistance(actor.x, actor.y, rightSideX, y)) {
    targetX = rightSideX;
  } else {
    targetX = leftSideX;
  }

  return {
    targetName: target.name,
    x: targetX,
    y: y,
    hitboxWidth: target.hitboxWidth,
    hitboxHeight: target.hitboxHeight,
    actualX: target.x,
    actualY: target.y
  }
}

class ActionFactory {
  constructor(healerQuestModel, projectileSpawner) {
    this.healerQuestModel = healerQuestModel;
    this.projectileSpawner = projectileSpawner;
  }

  getAction(actor, target, actionType, actionName, damage) {
   if (actionType === 'basic-attack') {
     return BasicAttackAction(actor, target, actionName, damage, this.projectileSpawner);
   } else if (actionType === 'basic-projectile') {
     return BasicSpawnProjectileAction(actor, target, actionName, damage, this.projectileSpawner);
   } else if (actionType === 'movement') {
     return BasicMovementCommand(actor, target);
   } else if (actionType === 'idle') {
     return BasicIdleCommand(actor);
   }
  }
}