import { getLoadedAsset } from "../images/asset-loader";

const ACTOR_RENDERING_DATA = {
  healer: { fillStyle: 'rgb(10, 50, 150)', radius: 8 },
  fighter: { fillStyle: 'rgb(10, 150, 50)', radius: 10 },
  monster: { fillStyle: 'rgb(200, 0, 0)', radius: 25 }
}

class GameRenderer {
  constructor(canvas) {
    this.canvas = canvas;
  }

  renderCurrentState(state) {
    this.canvas.clear();
    if (!state.actors) {
      return;
    }
    state.actors.forEach((actor) => {
      if (actor.sprite) {
        this.drawActor(actor);
      } else {
        const actorRenderData = ACTOR_RENDERING_DATA[actor.name];
        this.canvas.drawCircle(actor.x, actor.y, actorRenderData.radius, actorRenderData.fillStyle);
      }
    });
    const projectiles = state.projectiles;
    projectiles.forEach((projectile) => {
      this.canvas.drawCircle(projectile.x, projectile.y, projectile.radius, 'rgb(200,0,0)');
    });
    const damageZones = state.damageZones;
    damageZones.forEach((damageZone) => {
      this.canvas.drawRect(damageZone.x, damageZone.y, damageZone.width, damageZone.height, 'rgb(200, 50, 50)');
    })
  }

  drawActor(actor) {
    const x = actor.x;
    const y = actor.y;
    const facingDirection = actor.name === 'healer' ? '' : actor.facingDirection;
    const { spriteWidth, spriteHeight, sourceX, sourceY, spriteSource} = actor.sprite.getDrawParameters(facingDirection);
    this.canvas.drawPortionOfImage(
      x, y, spriteWidth, spriteHeight, sourceX, sourceY, getLoadedAsset(spriteSource));
  }
}

export default GameRenderer;