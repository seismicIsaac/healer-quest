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

const DAMAGE_ZONE_STATS_BY_NAME = {
  color: 'orange',
  frameCounter: 0
}

export class ProjectileSpawner {
  constructor(gameState) {
    this.gameState = gameState;
  }

  spawnProjectile(actor, target, name, damage) {
    const projectile = this.createProjectile(actor, target, name, damage);
    this.addProjectile(projectile);
  }

  spawnDamageZone(actor, animation, damage) {
    const damageZone = this.createDamageZone(actor, animation, damage);
    this.addDamageZone(damageZone);
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

  createDamageZone(actor, animation, damage) {
    const x = actor.x + animation.damageZoneX;
    const y = actor.y + animation.damageZoneY;
    const width = animation.damageZoneWidth;
    const height = animation.damageZoneHeight;
    const durationFrames = animation.damageZoneDurationFrames;
    return Object.assign({
      x: x,
      y: y,
      width: width,
      height: height,
      damage: damage,
      durationFrames: durationFrames
    },
    DAMAGE_ZONE_STATS_BY_NAME);
  }

  addProjectile(projectile) {
    this.gameState.projectiles.push(projectile);
  }

  addDamageZone(damageZone) {
    this.gameState.damageZones.push(damageZone);
  }
}