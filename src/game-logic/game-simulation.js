import GameRenderer from '../game-renderer/game-renderer';
import getGameClock from './game-clock';
import SPELLS from '../game-data/spells';
import InputHandler from '../event/input';
import { INITIAL_STATE, getGameResult } from './game-rules';
import EntityMover from './entity-mover';
import { AnimationController } from '../game-renderer/animation-controller';
import { STAT_NAME_HEALTH, STAT_NAME_MANA, STAT_VALUE_MAXIMUM_KEY, updateActorStat } from './common';
import { ProjectileSpawner } from './projectile-spawner';
import { AIActionHandler } from './ai-action-handler';

const TIME_BEFORE_MANA_REGENS = 6000;
const MANA_REGEN_TICK_TIME = 3000;

const ACTOR_NAME_FIGHTER = 'fighter';
const ACTOR_NAME_HEALER = 'healer';

const HEALER_QUEST_GAME_CLOCK_TICK_SPEED_MILLIS = 16;

class GameSimulation {
constructor(healerQuestModel, canvas) {
    this.gameRenderer = new GameRenderer(canvas);
    this.healerQuestModel = healerQuestModel;
    this.inputHandler = new InputHandler(document);
    this.entityMover = new EntityMover(canvas.getCanvasElement(), this.inputHandler, healerQuestModel);
    this.animationController = new AnimationController();
    this.projectileSpawner = new ProjectileSpawner(this.healerQuestModel.getGameState());
    this.cpuActionHandler = new AIActionHandler(healerQuestModel, this.projectileSpawner);
    this.canvas = canvas;
  }

  setupActorAnimations() {
    this.healerQuestModel.getGameState().actors.forEach(this.animationController.setInitialAnimations);
  }

  pauseGame() {
    this.cleanupTimers();
  }

  tick() {
    this.runGameLoopLogic();
    this.gameRenderer.renderCurrentState(this.healerQuestModel.getGameState());
  }

  runGameLoopLogic() {
    const gameResult = getGameResult(this.healerQuestModel);
    if (gameResult) {
      this.healerQuestModel.set('gameResult', gameResult);
      this.cleanupGame();
      return;
    }
    const healer = this.healerQuestModel.getGameState().actors[2];
    this.entityMover.updatePlayerPosition(healer);
    const isMoving = this.entityMover.isMovingThisFrame(healer);
    if (isMoving) {
      this.cancelActiveSpellCast();
    }
    this.animationController.update4DirectionalMovingAnimation(healer.sprite.currentAnim, healer.facingDirection, isMoving);
    this.entityMover.updateProjectilePositions(this.healerQuestModel.getGameState());
    this.entityMover.updateDamageZones(this.healerQuestModel.getGameState());
    
    const aiActors = this.healerQuestModel.getGameState().actors.filter(actor => actor.name !== 'healer');
    const allActors = this.healerQuestModel.getGameState().actors;
    this.cpuActionHandler.updateAIActions(aiActors, allActors);
    aiActors.forEach((actor) => {
      if (actor.movementTarget) {
        this.cpuActionHandler.handleAIMovement(actor);
        this.animationController.updateCPUMovementAnimation(actor);
      } else if (actor.sprite.animSequence) {
        this.animationController.updateBattleAnimation(actor.sprite);
      } else {
        this.animationController.updateBattlerIdleAnimation(actor.sprite);
      }
    });
  }

  startGame() {
    this.inputHandler.initListeners();
    this.setupActorAnimations();
    this.gameRenderer.renderCurrentState(this.healerQuestModel.getGameState());
    this.gameClock = getGameClock(HEALER_QUEST_GAME_CLOCK_TICK_SPEED_MILLIS, this.tick.bind(this));
    this.gameClock.start();
  }

  cleanupGame() {
    this.cleanupTimers();
    this.inputHandler.cleanup();
  }

  cleanupTimers() {
    this.gameClock.stopAllTimers();
    this.cancelActiveSpellCast();
    this.gameClock.stop();
  }

  updateIsRegeningMana() {
    this.healerQuestModel.set('isRegeneratingMana', true);
    this.executeHealerManaRegen();
  }

  queueHeal(spellData) {
    this.gameClock.addTimer(spellData.name, spellData.castTime, this.executeHeal.bind(this));
  }

  queueManaRegenStartTimer() {
    this.healerQuestModel.set('isRegeneratingMana', false);
    this.gameClock.stopTimer('healer-recently-cast-spell');
    this.gameClock.stopTimer('healer-mana-regen-tick');
    this.gameClock.addTimer('healer-recently-cast-spell', TIME_BEFORE_MANA_REGENS, this.updateIsRegeningMana.bind(this));
  }

  queueManaRegenTick() {
    this.gameClock.addTimer('healer-mana-regen-tick', MANA_REGEN_TICK_TIME, this.executeHealerManaRegen.bind(this));
  }

  startHealSpell(spellId) {
    //TODO: Validate that we can cast heal
    const spellData = SPELLS[spellId];
    this.queueHeal(spellData);
    this.healerQuestModel.set('spellBeingCast', spellData);
  }

  cancelActiveSpellCast() {
    const spellBeingCast = this.healerQuestModel.get('spellBeingCast');
    if (spellBeingCast) {
      this.gameClock.stopTimer(spellBeingCast.name);
    }
    this.healerQuestModel.set('spellBeingCast', null);
  }

  executeHeal() {
    const spellBeingCast = this.healerQuestModel.get('spellBeingCast');
    this.healerQuestModel.set('spellBeingCast', null);
    this.queueManaRegenStartTimer();
    updateActorStat(this.healerQuestModel, ACTOR_NAME_FIGHTER, STAT_NAME_HEALTH, spellBeingCast.healAmount);
    updateActorStat(this.healerQuestModel, ACTOR_NAME_HEALER, STAT_NAME_MANA, -spellBeingCast.manaCost);
  }

  executeHealerManaRegen() {
    const healerManaRegen = this.healerQuestModel.get('healerManaRegen');
    updateActorStat(this.healerQuestModel, ACTOR_NAME_HEALER, STAT_NAME_MANA, healerManaRegen);
    this.queueManaRegenTick();
  }

  resetGame() {
    this.cleanupGame();
    this.setInitialState();
    this.startGame();
  }

  setInitialState() {
    const actors = INITIAL_STATE.actors;
    actors.forEach((actor) => {
      const name = actor.name;
      actor.currentAction = '';
      this.healerQuestModel.set(name + STAT_NAME_HEALTH, actor.hpCurrent);
      this.healerQuestModel.set(name + STAT_NAME_HEALTH + STAT_VALUE_MAXIMUM_KEY, actor.hpTotal);
      if (actor.mana) {
        this.healerQuestModel.set(name + STAT_NAME_MANA, actor.mana);
        this.healerQuestModel.set(name + STAT_NAME_MANA + STAT_VALUE_MAXIMUM_KEY, actor.manaTotal);
      }
    });
    this.healerQuestModel.set('gameResult', '');
  }

}

export default GameSimulation;