import GameRenderer from '../game-renderer/game-renderer';
import getGameClock from './game-clock';
import SPELLS from '../game-data/spells';
import InputHandler from '../event/input';
import { INITIAL_STATE, getGameResult } from './game-rules';
import EntityMover from './entity-mover';
import { AnimationController } from '../game-renderer/animation-controller';
import { STAT_NAME_HEALTH, STAT_NAME_MANA, STAT_VALUE_MAXIMUM_KEY, updateActorStat } from './common';
import { ProjectileSpawner } from './projectile-spawner';
import { AIActionHandler } from './action';

const TIMER_TICK_BASIC_ATTACK = 1250;
const TIME_BEFORE_MANA_REGENS = 6000;
const MANA_REGEN_TICK_TIME = 3000;

const ACTOR_NAME_MONSTER = 'monster';
const ACTOR_NAME_FIGHTER = 'fighter';
const ACTOR_NAME_HEALER = 'healer';

const HEALER_QUEST_GAME_CLOCK_TICK_SPEED_MILLIS = 16;

class GameSimulation {
constructor(healerQuestModel, canvas) {
    this.gameRenderer = new GameRenderer(canvas);
    this.healerQuestModel = healerQuestModel;
    this.gameState = INITIAL_STATE;
    this.inputHandler = new InputHandler(document);
    this.entityMover = new EntityMover(canvas.getCanvasElement(), this.inputHandler, healerQuestModel);
    this.animationController = new AnimationController();
    this.projectileSpawner = new ProjectileSpawner(this.gameState);
    this.cpuActionHandler = new AIActionHandler(healerQuestModel, this.projectileSpawner);
    this.canvas = canvas;
  }

  setupActorAnimations() {
    this.gameState.actors.forEach(this.animationController.setInitialAnimations);
  }

  tick() {
    this.runGameLoopLogic();
    this.gameRenderer.renderCurrentState(this.gameState);
  }

  runGameLoopLogic() {
    const gameResult = getGameResult(this.healerQuestModel);
    if (gameResult) {
      this.healerQuestModel.set('gameResult', gameResult);
      this.cleanupGame();
      return;
    }
    const healer = this.gameState.actors[2];
    this.entityMover.updatePlayerPosition(healer);
    const isMoving = this.entityMover.isMovingThisFrame(healer);
    this.gameState.actors.forEach((actor) => {
      if (actor.name === 'healer') {
        this.animationController.update4DirectionalMovingAnimation(actor.sprite.currentAnim, actor.facingDirection, isMoving);
      } else {
        this.animationController.updateBattleAnimation(actor.sprite);
      }
    });
    this.entityMover.updateProjectilePositions(this.gameState);
    this.cpuActionHandler.updateAIActions(this.gameState.actors);
  }

  startGame() {
    this.inputHandler.initListeners();
    this.setupActorAnimations();
    this.gameRenderer.renderCurrentState(this.gameState);
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