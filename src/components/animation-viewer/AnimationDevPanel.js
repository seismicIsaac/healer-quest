import React, { Component } from 'react';
import './AnimationDevPanel.css';
import spider from './monster_bael_fangs.png';

const WALKING_ANIM = {
  name: 'walking',
  animationState: 0,
  animationKeyFrames: 2,
  animationStateXOffset: 1,
  animationStateYOffset: 0,
  frameDuration: 120
}

const ATTACK_ANIM = {
  name: 'attack1',
  animationFrame: 0,
  animationState: 2,
  animationKeyFrames: 4,
  animationStateXOffset: 0,
  animationStateYOffset: 0,
  frameDuration: 100,
}

const ANIMATIONS = {
  walking: WALKING_ANIM,
  attack1: ATTACK_ANIM
}

export class AnimationDevPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'walking',
      animationFrame: 0,
      animationState: 0,
      animationStateXOffset: 1,
      animationStateYOffset: 0,
      currentSprite: spider,
      animationKeyFrames: 2,
      currentSpriteHeight: 70,
      currentSpriteWidth: 96,
      frameDuration: 128
    }
  }

  clearCurrentAnimationPlay() {
    if (this.playingAnimation) {
      clearInterval(this.playingAnimation);
    }
  }

  startAnimationPlaying() {
    this.clearCurrentAnimationPlay();
    const frameDuration = this.state.frameDuration;
    this.playingAnimation = setInterval(this.nextAnimationFrame.bind(this), frameDuration);
    this.isMovingForward = true;
  }

  startAnimationRewinding() {
    this.clearCurrentAnimationPlay();
    const frameDuration = this.state.frameDuration;
    this.playingAnimation = setInterval(this.prevAnimationFrame.bind(this), frameDuration);
    this.isMovingForward = false;
  }

  nextAnimationFrame() {
    let animationFrame = this.state.animationFrame;
    const animationKeyFrames = this.state.animationKeyFrames;
    const minAnimationFrame = this.state.animationStateXOffset;
    const maxAnimationFrame = animationKeyFrames + minAnimationFrame;
    if (animationFrame >= maxAnimationFrame) {
      animationFrame = minAnimationFrame;
    } else {
      animationFrame++;
    }
    this.setState({animationFrame: animationFrame});
  }
  prevAnimationFrame() {
    let animationFrame = this.state.animationFrame;
    const animationKeyFrames = this.state.animationKeyFrames;
    const minAnimationFrame = this.state.animationStateXOffset;
    const maxAnimationFrame = animationKeyFrames + minAnimationFrame;
    if (animationFrame <= minAnimationFrame) {
      animationFrame = maxAnimationFrame;
    } else {
      animationFrame--;
    }
    this.setState({animationFrame: animationFrame});
  }

  nextAnimationState() {
    let animationState = this.state.animationState;
    const animationKeyFrames = this.state.animationKeyFrames;
    if (animationState > animationKeyFrames) {
      animationState = 0;
    } else {
      animationState++;
    }
    this.setState({animationState: animationState})
  }
  prevAnimationState() {
    let animationState = this.state.animationState;
    const animationKeyFrames = this.state.animationKeyFrames;
    if (animationState < 0) {
      animationState = animationKeyFrames;
    } else {
      animationState--;
    }
    this.setState({animationState: animationState})
  }

  handleFrameDurationChanged(event) {
    if (event && event.target && event.target.value) {
      const value = event.target.value;
      console.log('myValue: ', value);
      this.setState({frameDuration: parseInt(value)});
    } else {
      return;
    }
    this.clearCurrentAnimationPlay();
    //Explicitly check value to stop animation from playing again automatically
    //if it weren't already playing.
    if (this.isMovingForward === true) {
      this.startAnimationPlaying();
    } else if (this.isMovingForward === false) {
      this.startAnimationRewinding();
    }
  }

  handleAnimationNameDropdownChanged(event) {
    const newAnimKey = event.target.value;
    const newAnimation = ANIMATIONS[newAnimKey];
    this.setState(newAnimation);
  }

  getOptionsForAnimationDropdown() {
    return Object.keys(ANIMATIONS).map(animKey => <option value={animKey}>{animKey}</option>);
  }

  getSpriteStyle() {
    const animationFrame = this.state.animationFrame;
    const animationState = this.state.animationState;
    const animationStateXOffset = this.state.animationStateXOffset;
    const animationStateYOffset = this.state.animationStateYOffset;
    const currentSpriteWidth = this.state.currentSpriteWidth;
    const currentSpriteHeight = this.state.currentSpriteHeight;
    const currentSprite = this.state.currentSprite;
    return {
      width: `${currentSpriteWidth}px`,
      height: `${currentSpriteHeight}px`,
      backgroundImage: `url(${currentSprite})`,
      backgroundPositionX: `${(animationFrame + animationStateXOffset) * currentSpriteWidth}px`,
      backgroundPositionY: `${(animationState + animationStateYOffset) * currentSpriteHeight}px`
    }
  }

  render() {
    return (
      <div className="animation-dev-panel">
        <div className="sprite-viewer">
          <div className="sprite-container">
            <div className="sprite" style={this.getSpriteStyle()}></div>
          </div>
          <div className="sprite-viewer-controls">
            <div className="frame-controls">
              <button onClick={this.nextAnimationFrame.bind(this)}>NextFrame</button>
              <button onClick={this.prevAnimationFrame.bind(this)}>PrevFrame</button>
              <div className="current-frame">CurrentFrame: {this.state.animationFrame}</div>
            </div>
            <div className="state-controls">
              <button onClick={this.nextAnimationState.bind(this)}>NextState</button>
              <button onClick={this.prevAnimationState.bind(this)}>PrevState</button>
              <div className="current-state">CurrentState: {this.state.animationState}</div>
            </div>
            <div className="play-animation-controls">
              <button onClick={this.startAnimationPlaying.bind(this)}>Play</button>
              <button onClick={this.startAnimationRewinding.bind(this)}>Rewind</button>
              <input type="text" value={this.state.frameDuration} onChange={this.handleFrameDurationChanged.bind(this)}></input>
            </div>
            <div className="animation-name-dropdown-container">
              <select value={this.state.name} onChange={this.handleAnimationNameDropdownChanged.bind(this)}>
                {this.getOptionsForAnimationDropdown()}
              </select>
            </div>
          </div>
        </div>
      </div>
    )
  }
}