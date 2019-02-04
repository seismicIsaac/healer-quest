import { createHealerSprite, createMonkSprite, createSpiderSprite } from '../game-data/sprites';

const DEFAULT_FACING_DIRECTION_TO_ORDINAL = {
  down: 0,
  left: 1,
  right: 2,
  up: 3
};

export class AnimationController {
  
  //Should probably just pass in the animation, and the facing direction.
  //Make this specific to walking?
  update4DirectionalMovingAnimation(walk, facingDirection, isMoving) {
    walk.frameCounter++;
    const isCurrentLoopFinished = walk.frameCounter >= walk.keyFrames * walk.frameRate;
    if (isCurrentLoopFinished) {
      walk.frameCounter = 0;
    }
    walk.sourceYOffset = DEFAULT_FACING_DIRECTION_TO_ORDINAL[facingDirection];
    walk.sourceXOffset = Math.floor(walk.frameCounter / walk.frameRate);
    if (!isMoving) {
      walk.sourceXOffset = 1;
    }
  }

  updateBattleAnimation(sprite) {
    const currentAnim = sprite.currentAnim;
    if (!sprite.animSequence) {
      this.updateBattlerIdleAnimation(currentAnim);
      return;
    }
    sprite.incrementFrameCounter();
    if (sprite.isActionFrame()) {
      sprite.completeSequenceAction();
    }
    
    if (sprite.isCurrentLoopFinished()) {
      sprite.resetFrameCounter();
      sprite.incrementIterationCounter();
      
      if (sprite.isCurrentAnimationInSequenceFinished()) {
        sprite.finishAnimationInSequence();
        
        if (sprite.isCurrentAnimationSequenceFinished()) {
          sprite.completeAnimationSequence();
        } else {
          sprite.nextAnimationInSequence();
        }
      }
    }
    this.setBattlerAnimationProps(currentAnim);
  }

  setBattlerAnimationProps(currentAnim) {
    currentAnim.sourceXOffset = Math.floor(currentAnim.frameCounter / currentAnim.frameRate);
  }

  updateBattlerIdleAnimation(currentAnim) {
    currentAnim.frameCounter++;
    const isCurrentLoopFinished = currentAnim.frameCounter >= currentAnim.keyFrames * currentAnim.frameRate;
    if (isCurrentLoopFinished) {
      currentAnim.frameCounter = 0;
    }
    this.setBattlerAnimationProps(currentAnim);
  }

  setInitialAnimations(actor) {
    if (actor.name === 'healer') {
      actor.sprite = createHealerSprite();
    } else if (actor.name === 'fighter') {
      actor.sprite = createMonkSprite();
    } else if (actor.name === 'monster') {
      actor.sprite = createSpiderSprite();
    }
  }
}