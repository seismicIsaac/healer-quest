import { BasicProjectile } from './projectile';

const BEHAVIOR_LINEAR = 'linear';

const PROJECTILE_STATS_BY_NAME = {
  'spider-projectile1': {
    speed: 4,
    radius: 6,
    color: 'red',
    behavior: BEHAVIOR_LINEAR
  }
}

export class ProjectileSpawner {
  constructor(gameState) {
    this.gameState = gameState;
  }

  spawnProjectile(actor, target, name, damage) {
    const projectile = this.createProjectile(actor, target, name, damage);
    this.addProjectile(projectile);
  }

  createProjectile(actor, target, name, damage) {
    const targetX = target.x + target.width / 2;
    const targetY = target.y + target.height / 2;
    const projectileStats = PROJECTILE_STATS_BY_NAME[name];

    if (projectileStats.behavior === BEHAVIOR_LINEAR) {
      return BasicProjectile(
        actor.x + actor.sprite.missileStartOffsetX,
        actor.y + actor.sprite.missileStartOffsetY,
        targetX,
        targetY,
        projectileStats.radius,
        projectileStats.speed,
        projectileStats.color,
        damage)
    }
  }

  addProjectile(projectile) {
    this.gameState.projectiles.push(projectile);
  }
}