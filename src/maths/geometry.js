
export function getUnitVector(x1, y1, x2, y2) {
  const yDistance = y1 - y2;
  const xDistance = x1 - x2;
  const hypotenuse = Math.sqrt(yDistance * yDistance + xDistance * xDistance);
  return {
    x: xDistance / hypotenuse,
    y: yDistance / hypotenuse
  };
}

export function calculateDistance(x1, y1, x2, y2) {
  const xDiff = x2 - x1;
  const yDiff = y2 - y1;
  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

export function isHorizontalLine(y1, y2) {
  return y1 === y2;
}

export function isVerticalLine(x1, x2) {
  return x1 === x2;
}

/* TODO: Figure out what to do when we have horizontal / vertical lines */
export function calculateSlope(x1, y1, x2, y2) {
  if (isHorizontalLine(y1, y2) || isVerticalLine(x1, x2)) {
    return 0;
  }
  return (y2 - y1) / (x2 - x1);
}

/* TODO: FIgure out what to do when we have horizontal / vertical lines */
export function perpendicularSlope(x1, y1, x2, y2) {
  const slope = calculateSlope(x1, y1, x2, y2);
  if (slope !== 0) {
    return -1 / slope;
  }
  return 0;
}