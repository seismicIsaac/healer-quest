import React, { Component } from 'react';
import {HealthBar, ManaBar} from '../progress-bar/ProgressBar';
import './AllyVitals.css';
import monkFace from './monk-face1.png';
import healerFace from './healer-m-face1.png';

export class AllyVitals extends Component {
  getActorPortrait() {
    if (this.props.actorName === 'healer') {
      return healerFace;
    } else if (this.props.actorName === 'fighter') {
      return monkFace;
    }
  }
  
  getBars() {
    if (this.props.actorName === 'healer') {
      return (
        <div className="stat-bars">
          <HealthBar 
              currentHealth={this.props.currentHealth}
              totalHealth={this.props.totalHealth}
            />    
          <ManaBar
            currentMana={this.props.currentMana}
            totalMana={this.props.totalMana}
          />
        </div>
      );
    } else {
      return (
        <div className="stat-bars">
          <HealthBar 
          currentHealth={this.props.currentHealth}
          totalHealth={this.props.totalHealth}
          />  
        </div>
      );
    }
  }

  render() {
    return (
      <div className="ally-vitals-container">
        <div className="ally-portrait-container">
          <img className="ally-portrait-image" src={this.getActorPortrait()} alt=""></img>
        </div>
        {this.getBars()}
    </div>
    );
  }

}