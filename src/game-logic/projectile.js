import { getUnitVector } from "../maths/geometry";

export function BasicProjectile(x, y, targetX, targetY, radius, speed, color, damageOnHit) {
  return {
    x: x,
    y: y,
    direction: getUnitVector(x, y, targetX, targetY),
    radius: radius,
    speed: speed,
    color: color,
    damageOnHit: damageOnHit 
  }
}
