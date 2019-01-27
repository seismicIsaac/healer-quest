import {HealerWalkingAnimation,
  FighterIdleAnimation,
  FighterAttackSequence,
  getAnimationByName} from '../game-data/animations';

const DEFAULT_FACING_DIRECTION_TO_ORDINAL = {
  down: 0,
  left: 1,
  right: 2,
  up: 3
};


export class AnimationController {
  
  //Should probably just pass in the animation, and the facing direction.
  //Make this specific to walking?
  updateAnimationState(animation, facingDirection, isMoving) {
    animation.frameCounter++;
    const isCurrentLoopFinished = animation.frameCounter >= animation.keyFrames * animation.frameRate;
    if (isCurrentLoopFinished) {
      animation.frameCounter = 0;
    }
    const facingDirectionOrdinal = DEFAULT_FACING_DIRECTION_TO_ORDINAL[facingDirection];
    animation.sourceY = facingDirectionOrdinal * animation.spriteHeight;
    animation.sourceX = animation.spriteWidth * Math.floor(animation.frameCounter / animation.frameRate);
    if (!isMoving) {
      animation.sourceX = animation.spriteWidth;
    }
  }

  updateBattleAnimation(animation, actor) {
    if (!animation.animationSequence) {
      //Then we're in an idle state
      this.updateBattlerIdleAnimation(animation);
      return;
    }
    animation.frameCounter++;
    let currentStateIndex = animation.animationSequence.stateIndex;
    animation.state = animation.animationSequence.states[currentStateIndex].state;
    const isCurrentLoopFinished = animation.frameCounter >= animation.keyFrames * animation.frameRate;

    if (isCurrentLoopFinished) {
      animation.frameCounter = 0;
      animation.animationSequence.states[currentStateIndex].iterationCount++;
      const currentState = animation.animationSequence.states[currentStateIndex];
      if (currentState.iterationCount === currentState.iterations) {
        //We're done playing this animation. Move on to this next animation in the sequence.
        currentStateIndex = animation.animationSequence.stateIndex++;
        
        if (animation.animationSequence.stateIndex === animation.animationSequence.states.length) {
          //Then we are done. Call onAnimationFinished, then clear the animation sequence and set the animation back to idle
          animation.animationSequence.onAnimationSequenceFinished();
          animation.animationSequence = null;
          actor.animation = FighterIdleAnimation();
        } else {
          //We just transitioned states. Apply animation properties for new state;
          const newStateAnimationName = animation.animationSequence.states[currentStateIndex].animationName;
          const newStateAnimationProps = getAnimationByName(newStateAnimationName) || {};
          Object.assign(animation, newStateAnimationProps);
        }
      }
    }
    
    this.setBattlerAnimationProps(animation);
  }

  setBattlerAnimationProps(animation) {
    animation.sourceY = animation.state * animation.spriteHeight;
    animation.sourceX = animation.spriteWidth * Math.floor(animation.frameCounter / animation.frameRate);
  }

  updateBattlerIdleAnimation(animation) {
    animation.frameCounter++;
    const isCurrentLoopFinished = animation.frameCounter >= animation.keyFrames * animation.frameRate;
    if (isCurrentLoopFinished) {
      animation.frameCounter = 0;
    }
    this.setBattlerAnimationProps(animation);
  }

  beginAttackAnimation(animation, onAttackAnimationFinished) {
    animation.animationSequence = FighterAttackSequence(onAttackAnimationFinished);
  }

  setInitialAnimations(actor) {
    if (actor.name === 'healer') {
      actor.animation = HealerWalkingAnimation();
    } else if (actor.name === 'fighter') {
      actor.animation = FighterIdleAnimation();
    }
  }
}