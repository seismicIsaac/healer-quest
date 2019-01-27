import React, { Component } from 'react';
import './ProgressBar.css';

export class HealthBar extends Component {
  getCurrentHealthStyle() {
    const totalHealth = this.props.totalHealth;
    const currentHealth = this.props.currentHealth;
    let healthPercentage = currentHealth / totalHealth;
    let backgroundColor = 'green';
    if (healthPercentage < .4) {
      backgroundColor = 'red';
    } else if (healthPercentage < .75) {
      backgroundColor = 'yellow';
    } else if (healthPercentage > 1) {
      backgroundColor = 'gold';
      healthPercentage = 1;
    }
    return {
      transform: `scaleX(${healthPercentage})`,
      backgroundColor: backgroundColor
    }
  }

  render() {
    return (
      <ProgressBar 
        additionalClassName={'fighter-health'}
        progressStyle={this.getCurrentHealthStyle()}
        progressBarMessage={this.props.currentHealth + '/' + this.props.totalHealth}
      />
    )
  }
}

export class ManaBar extends Component {
  getCurrentManaStyle() {
    return {
      transform: `scaleX(${this.props.currentMana / this.props.totalMana})`
    }
  }
  render() {
    return (
      <ProgressBar
        additionalClassName={'healer-mana-bar'}
        progressStyle={this.getCurrentManaStyle()}
        progressBarMessage={this.props.currentMana + '/' + this.props.totalMana}
      />
    )
  }
}

const MILLISECONDS_IN_A_SECOND = 1000;

export class CastBar extends Component {
  getCastBarPercentCompleteAnimation() {
    if (!this.props.spellBeingCast) {
      return {
        animation: 'none'
      }
    }
    const spellBeingCast = this.props.spellBeingCast;
    const spellCastTime = spellBeingCast.castTime / MILLISECONDS_IN_A_SECOND;
    return {
      animation: `scale0to100 ${spellCastTime}s linear`
    }
  }

  render() {
    let spellName = 'No Spell Being Cast';
    if (this.props.spellBeingCast) {
      spellName = this.props.spellBeingCast.name;
    }
    const castBarContainerClassname = this.props.spellBeingCast !== null ? '' : 'hidden';
    return (
      <ProgressBar 
        additionalClassName={castBarContainerClassname}
        progressStyle={this.getCastBarPercentCompleteAnimation()}
        progressBarMessage={spellName}
      />
    )
  }
}

function ProgressBar(props) {
  const className = 'progress-bar-container ' + props.additionalClassName;
  return (
  <div className={className}>
    <div className="progress-bar-frame">
      <div className="progress-bar-percent-complete" style={props.progressStyle}></div>
      <div className="progress-bar-text">{props.progressBarMessage}</div>
    </div>
  </div>
  )
}
