import CollisionCalculator from "./collision-calculator";
import { updateActorStat, STAT_NAME_HEALTH } from "./common";
import { ACTOR_NAME_HEALER } from "../game-data/actors";

class EntityMover {
  constructor(canvasElement, inputHandler, healerQuestModel) {
    this.canvasElement = canvasElement;
    this.inputHandler = inputHandler;
    this.healerQuestModel = healerQuestModel;
    this.collisionCalculator = new CollisionCalculator();
  }

  isMovingThisFrame() {
    return !this.inputHandler.isNoInputCurrently();
  }

  updatePlayerPosition(player) {
    const keys = this.inputHandler.getKeys();
    const movement = player.speed;
    const canvas = this.canvasElement;
    //We're going to need to test for collision, so it might not be worth 
    if (keys.up) {
      player.facingDirection = 'up';
      if (player.y - movement < 0) {
        player.y = 0;
      } else {
        player.y -= movement;
      }
    }
    if (keys.left) {
      player.facingDirection = 'left';
      if (player.x - movement < 0) {
        player.x = 0;
      } else {
        player.x -= movement;
      }
    }
    if (keys.right) {
      player.facingDirection = 'right';
      if (player.x + movement > canvas.width) {
        player.x = canvas.width;
      } else {
        player.x += movement;
      }
    }
    if (keys.down) {
      player.facingDirection = 'down';
      if (player.y + movement > canvas.height) {
        player.y = canvas.height;
      } else {
        player.y += movement;
      }
    }
  }

  updateProjectilePositions(gameState) {
    let projectilesToDestroy = [];
    gameState.projectiles.forEach((projectile) => {
      let movement = projectile.speed;
      projectile.x -= projectile.direction.x * movement;
      projectile.y -= projectile.direction.y * movement;
      const healer = gameState.actors[2];
      if (projectile.x > this.canvasElement.width || projectile.y > this.canvasElement.height) {
        projectilesToDestroy.push(projectile);
      }
      const { healerX, healerY, width, height } = this.collisionCalculator.getActorHitbox(healer);
      const collidedWithHealer = this.collisionCalculator.circleIntersectsAxisAlignedRectangle(
        projectile.x, projectile.y, projectile.radius,
        healerX, healerY, width, height);
      if (collidedWithHealer) {
        projectilesToDestroy.push(projectile);
        //TODO: call method to damage healer
        updateActorStat(this.healerQuestModel, ACTOR_NAME_HEALER, STAT_NAME_HEALTH, -projectile.damageOnHit);
      }
    });
    gameState.projectiles = gameState.projectiles.filter(projectile => !projectilesToDestroy.includes(projectile));
  }
}

export default EntityMover;
