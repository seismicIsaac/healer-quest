import { updateActorStat, STAT_NAME_HEALTH } from "./common";
import { ACTOR_TYPE_AI } from "../game-data/actors";

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

  updateAIActions(actors) {
    this.startNextAIAction(actors);
    this.updateActionCooldowns(actors);
  }

  startNextAIAction(actors) {
    actors.forEach((actor) => {
      if (actor.currentAction || actor.name === 'healer') {
        return;
      } else {
        const { targetName, type, name, damage } = actor.actionPicker();
        actor.globalCooldownCounter++;
        if (type === 'idle' || actor.globalCooldownCounter < actor.globalCooldownFrames) {
          return;
        }
        const target = actors.find((actor) => actor.name === targetName);
        const action = this.actionFactory.getAction(actor, target, type, name, damage);
        action.invoke();
        actor.actionsByName[name].cooldownCounter = 0;
        actor.globalCooldownCounter = 0;
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

}

export function BasicAttackAction(actor, target, damage, healerQuestModel) {
  return {
    invoke: function() {
      actor.sprite.setActionAnimationSequence('basic-attack', null, () => {
        updateActorStat(healerQuestModel, target.name, STAT_NAME_HEALTH, -damage);
        actor.currentAction = '';
      });
    }
  }
}

export function BasicSpawnProjectileAction(actor, target, name, damage, projectileSpawner) {
  return {
    invoke: function() {
      actor.sprite.setActionAnimationSequence('basic-shot', null, () => {
        projectileSpawner.spawnProjectile(actor, target, name, damage);
        actor.currentAction = '';
      });
    }
  }
}

class ActionFactory {
  constructor(healerQuestModel, projectileSpawner) {
    this.healerQuestModel = healerQuestModel;
    this.projectileSpawner = projectileSpawner;
  }

  getAction(actor, target, actionType, actionName, damage) {
   if (actionType === 'basic-attack') {
     return BasicAttackAction(actor, target, damage, this.healerQuestModel);
   } else if (actionType === 'basic-projectile') {
     return BasicSpawnProjectileAction(actor, target, actionName, damage, this.projectileSpawner);
   }
  }
}