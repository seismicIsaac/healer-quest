import GameRenderer from '../game-renderer/game-renderer';
import getGameClock from './game-clock';
import SPELLS from '../game-data/spells';
import InputHandler from '../event/input';
import { INITIAL_STATE, getGameResult } from './game-rules';
import { BasicProjectile } from './projectile';
import EntityMover from './entity-mover';
import { AnimationController } from '../game-renderer/animation';

const TIMER_TICK_BASIC_ATTACK = 1250;
const TIME_BEFORE_MANA_REGENS = 6000;
const MANA_REGEN_TICK_TIME = 3000;

const ACTOR_NAME_MONSTER = 'monster';
const ACTOR_NAME_FIGHTER = 'fighter';
const ACTOR_NAME_HEALER = 'healer';

const MONSTER_BASIC_PROJECTILE_SPEED = 2;
const MONSTER_BASIC_PROJECTILE_RADIUS = 6;

const MONSTER_BASIC_ATTACK_DAMAGE = 50;
const FIGHTER_BASIC_ATTACK_DAMAGE = 35;

const STAT_NAME_MANA = 'Mana';
const STAT_NAME_HEALTH = 'Health';
const STAT_VALUE_MAXIMUM_KEY = 'Max';

const HEALER_QUEST_GAME_CLOCK_TICK_SPEED_MILLIS = 16;

class GameSimulation {
constructor(healerQuestModel, canvas) {
    this.gameRenderer = new GameRenderer(canvas);
    this.healerQuestModel = healerQuestModel;
    this.gameState = INITIAL_STATE;
    this.inputHandler = new InputHandler(document);
    this.entityMover = new EntityMover(canvas.getCanvasElement(), this.inputHandler, this.onProjectileCollision.bind(this));
    this.animationController = new AnimationController();
    this.canvas = canvas;
  }

  setupActorAnimations() {
    //Healer walk animation
    this.gameState.actors.filter(actor => actor.name !== 'monster').forEach(this.animationController.setInitialAnimations);
  }d

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
    const fighter = this.gameState.actors[1];
    this.entityMover.updatePlayerPosition(healer);
    const isMoving = this.entityMover.isMovingThisFrame(healer);
    this.animationController.updateAnimationState(healer.animation, healer.facingDirection, isMoving);
    this.animationController.updateBattleAnimation(fighter.animation, fighter);
    this.entityMover.updateProjectilePositions(this.gameState);
  }

  startGame() {
    this.setupActorAnimations();
    this.gameRenderer.renderCurrentState(this.gameState);
    this.gameClock = getGameClock(HEALER_QUEST_GAME_CLOCK_TICK_SPEED_MILLIS, this.tick.bind(this));
    this.gameClock.start();
    this.queueMonsterBasicAttack();
    this.queueFighterReadyAnimation();
    this.queueManaRegenStartTimer();
  }

  cleanupGame() {
    this.cleanupTimers();
  }

  cleanupTimers() {
    this.gameClock.stopAllTimers();
    this.cancelActiveSpellCast();
    this.gameClock.stop();
  }

  updateActorStat(actorName, statName, delta) {
    const statKey = actorName + statName;
    const currentStatValue = this.healerQuestModel.get(statKey);
    const maxStatValue = this.healerQuestModel.get(statKey + STAT_VALUE_MAXIMUM_KEY);
    if (delta < 0) {
      this.healerQuestModel.set(statKey, Math.max(currentStatValue + delta, 0));
    } else {
      this.healerQuestModel.set(statKey, Math.min(currentStatValue + delta, maxStatValue));
    }
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

  queueMonsterBasicAttack() {
    this.gameClock.addTimer('monster1-attack', TIMER_TICK_BASIC_ATTACK, this.executeMonsterBasicAttack.bind(this));
  }

  queueFighterReadyAnimation() {
    this.gameClock.addTimer('fighter-basic-attack', TIMER_TICK_BASIC_ATTACK, this.executeBeginFighterAttackAnimationAnimation.bind(this));
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

  //For now, we're assuming projectiles only collide with the healer
  onProjectileCollision(projectile) {
    this.updateActorStat(ACTOR_NAME_HEALER, STAT_NAME_HEALTH, -projectile.damageOnHit);
  }

  executeHeal() {
    const spellBeingCast = this.healerQuestModel.get('spellBeingCast');
    this.healerQuestModel.set('spellBeingCast', null);
    this.queueManaRegenStartTimer();
    this.updateActorStat(ACTOR_NAME_FIGHTER, STAT_NAME_HEALTH, spellBeingCast.healAmount);
    this.updateActorStat(ACTOR_NAME_HEALER, STAT_NAME_MANA, -spellBeingCast.manaCost);
  }

  executeHealerManaRegen() {
    const healerManaRegen = this.healerQuestModel.get('healerManaRegen');
    this.updateActorStat(ACTOR_NAME_HEALER, STAT_NAME_MANA, healerManaRegen);
    this.queueManaRegenTick();
  }

  executeMonsterBasicAttack() {
    this.updateActorStat(ACTOR_NAME_FIGHTER, STAT_NAME_HEALTH, -MONSTER_BASIC_ATTACK_DAMAGE);
    const monsterX = this.gameState.actors[0].x;
    const monsterY = this.gameState.actors[0].y;
    const healer = this.gameState.actors[2];
    const targetX = healer.x + healer.width / 2;
    const targetY = healer.y + healer.height / 2;
    this.addProjectile(BasicProjectile(monsterX, monsterY, targetX, targetY, MONSTER_BASIC_PROJECTILE_RADIUS, MONSTER_BASIC_PROJECTILE_SPEED));
    this.queueMonsterBasicAttack();
  }

  addProjectile(projectile) {
    this.gameState.projectiles.push(projectile);
  }

  executeBeginFighterAttackAnimationAnimation() {
    const fighter = this.gameState.actors[1];
    this.animationController.beginAttackAnimation(fighter.animation, this.executeFighterBasicAttack.bind(this));
  }

  executeFighterBasicAttack() {
    this.updateActorStat(ACTOR_NAME_MONSTER, STAT_NAME_HEALTH, -FIGHTER_BASIC_ATTACK_DAMAGE);
    this.queueFighterReadyAnimation();
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