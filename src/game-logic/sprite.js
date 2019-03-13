
export function Sprite(image, width, height, commonProperties, animationsByName, animationSequencesByName, initialAnimationName) {
  this.image = image;
  this.width = width;
  this.height = height;
  this.commonProperties = commonProperties;
  this.animationsByName = animationsByName;
  this.animationSequencesByName = animationSequencesByName;
  this.setCurrentAnimation(initialAnimationName);
}

Sprite.prototype.setCurrentAnimation = function(animationName) {
  this.currentAnim = Object.assign({name: animationName, frameCounter: 0}, this.commonProperties, this.animationsByName[animationName]);
}

Sprite.prototype.getDrawParameters = function(facingDirection) {
  const facingDirectionOffset = facingDirection === 'left' ? this.facingLeftOffset : 0;
  return {
    spriteWidth: this.width,
    spriteHeight: this.height,
    sourceX: this.currentAnim.sourceXOffset * this.width,
    sourceY: (this.currentAnim.sourceYOffset + facingDirectionOffset) * this.height,
    spriteSource: this.image
  }
}

Sprite.prototype.setAnimationSequence = function(sequenceName, onSequenceFinished) {
  this.animSequence = Object.assign(
    {iterationCounter: 0, stateIndex: 0, onSequenceFinished: onSequenceFinished},
    this.animationSequencesByName[sequenceName]);
  this.setCurrentAnimation(this.animSequence.states[0].name);
}

Sprite.prototype.setActionAnimationSequence = function(sequenceName, onSequenceFinished, onActionComplete) {
  if (!this.animationSequencesByName[sequenceName].actionFrame) {
    onSequenceFinished = onActionComplete;  
  }
  this.setAnimationSequence(sequenceName, onSequenceFinished);
  this.animSequence.onActionComplete = onActionComplete;
}

Sprite.prototype.incrementFrameCounter = function() {
  this.currentAnim.frameCounter++;
}

Sprite.prototype.incrementIterationCounter = function() {
  this.animSequence.iterationCounter++;
}

Sprite.prototype.resetFrameCounter = function() {
  this.currentAnim.frameCounter = 0;
}

Sprite.prototype.isActionFrame = function() {
    const actionFrame = this.animSequence.actionFrame;
    const frameRate = this.currentAnim.frameRate;
    const currentKeyFrame = Math.floor(this.currentAnim.frameCounter / this.currentAnim.frameRate);
    return actionFrame
        && actionFrame.stateIndex === this.animSequence.stateIndex 
        && actionFrame.keyFrameIndex === Math.floor(this.currentAnim.frameCounter / this.currentAnim.frameRate)
        && actionFrame.actingFrame === this.currentAnim.frameCounter - frameRate * currentKeyFrame;
}

Sprite.prototype.isCurrentLoopFinished = function() {
  return this.currentAnim.frameCounter >= this.currentAnim.keyFrames * this.currentAnim.frameRate;
}

Sprite.prototype.isCurrentAnimationInSequenceFinished = function() {
  const iterationCounter = this.animSequence.iterationCounter;
  return iterationCounter === this.animSequence.states[this.animSequence.stateIndex].iterations;
}

Sprite.prototype.isCurrentAnimationSequenceFinished = function() {
  return this.animSequence.stateIndex === this.animSequence.states.length
}

Sprite.prototype.finishAnimationInSequence = function() {
  this.animSequence.stateIndex++;
  this.animSequence.iterationCounter = 0;
}

Sprite.prototype.nextAnimationInSequence = function() {
  const newAnimation = this.animSequence.states[this.animSequence.stateIndex].name;
  this.setCurrentAnimation(newAnimation);
}

Sprite.prototype.completeSequenceAction = function() {
  this.animSequence.onActionComplete();
  this.animSequence.onActionComplete = null;
}

Sprite.prototype.completeAnimationSequence = function() {
  if (this.animSequence.onSequenceFinished) {
    this.animSequence.onSequenceFinished();
  }
  this.animSequence = null;
  this.setCurrentAnimation('idle');
}

Sprite.prototype.getDamageZone = function() {
  if (this.currentAnim) {

  }
}

Sprite.prototype.getBoxOrigin = function(x, width, facingDirection) {
  if (facingDirection === 'left') {

  }
  //Assume that normally we face right.
  //(0,0) offset from there is x + 20
  //if we're facing the opposite direction, 
  //then x + 20 is actually width - 20 - width
}
