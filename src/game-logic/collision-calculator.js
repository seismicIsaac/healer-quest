import { isHorizontalLine, calculateDistance } from "../maths/geometry";


class CollisionCalculator {
  circleIntersectsAxisAlignedRectangle(cx, cy, r, x, y, width, height) {
    const intersectsLineSegments = 
      this.circleIntersectsAxisAlignedLineSegment(cx, cy, r, x, y, x+width, y) ||
      this.circleIntersectsAxisAlignedLineSegment(cx, cy, r, x, y, x, y+height) ||
      this.circleIntersectsAxisAlignedLineSegment(cx, cy, r, x+width, y, x+width, y+height) ||
      this.circleIntersectsAxisAlignedLineSegment(cx, cy, r, x, y+height, x+width, y+height);

    const intersectsCornerPoints =
      this.circleIntersectsOrOverlapsPoint(cx, cy, r, x, y) ||
      this.circleIntersectsOrOverlapsPoint(cx, cy, r, x+width, y) ||
      this.circleIntersectsOrOverlapsPoint(cx, cy, r, x, y+height) ||
      this.circleIntersectsOrOverlapsPoint(cx, cy, r, x+width, y+height);

    return intersectsLineSegments || intersectsCornerPoints;
  }

  circleIntersectsAxisAlignedLineSegment(cx, cy, r, x1, y1, x2, y2) {
    const isHorizontal = isHorizontalLine(y1, y2);

    if (isHorizontal) {
      return this.circleIntersectsHorizontalLine(cx, cy, r, x1, x2, y2);
    } else {
      return this.circleIntersectsVerticalLine(cx, cy, r, y1, y2, x1);
    }
  }

  circleIntersectsHorizontalLine(cx, cy, r, x1, x2, y) {
    const circleDistance = Math.abs(cy - y);
    if (circleDistance > r) {
      return false;
    }
    const maxX = Math.max(x1, x2);
    const minX = Math.min(x1, x2);
    return cx >= minX && cx <= maxX;
  }

  circleIntersectsVerticalLine(cx, cy, r, y1, y2, x) {
    const circleDistance = Math.abs(cx - x);
    if (circleDistance > r) {
      return false;
    }
    const maxY = Math.max(y1, y2);
    const minY = Math.min(y1, y2);
    return cy >= minY && cy <= maxY;
  }

  
  circleIntersectsOrOverlapsPoint(cx, cy, r, x, y) {
    return r >= calculateDistance(cx, cy, x, y);
  }

  getActorHitbox(actor) {
    const x = actor.x;
    const y = actor.y;
    const width = actor.width;
    const height = actor.height;
    const hitboxX = (width - actor.hitboxWidth) / 2 + x;
    const hitboxY = (height - actor.hitboxHeight) / 2 + y;
    return {healerX: hitboxX, healerY: hitboxY, width: actor.hitboxWidth, height: actor.hitboxHeight};
  }
}



export default CollisionCalculator;