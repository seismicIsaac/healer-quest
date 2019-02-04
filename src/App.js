import React, { Component } from 'react';
import {HealthBar, ManaBar, CastBar} from './components/progress-bar/ProgressBar';
import './App.css';

import HealerQuestUIModel from './model/healer-quest-ui-model';
import GameSimulation from './game-logic/game-simulation';
import Canvas from './canvas';
import SPELLS from './game-data/spells';
import { loadAssets, getAllImagesLoaded } from './images/asset-loader';
import { AnimationDevPanel } from './components/animation-viewer/AnimationDevPanel';

class App extends Component {
  constructor(props) {
    super(props);
    loadAssets();
    this.healerQuestModel = HealerQuestUIModel();
    const monsterHealth = this.healerQuestModel.get('monsterHealth');
    const monsterHealthMax = this.healerQuestModel.get('monsterHealthMax');
    const fighterHealth = this.healerQuestModel.get('fighterHealth');
    const fighterHealthMax = this.healerQuestModel.get('fighterHealthMax');
    const healerHealth = this.healerQuestModel.get('healerHealth');
    const healerHealthMax = this.healerQuestModel.get('healerHealthMax');
    const healerMana = this.healerQuestModel.get('healerMana');
    const healerManaMax = this.healerQuestModel.get('healerManaMax');
    this.state = { 
      monsterHealth: monsterHealth,
      monsterHealthMax: monsterHealthMax,
      fighterHealth: fighterHealth,
      fighterHealthMax: fighterHealthMax,
      healerHealth: healerHealth,
      healerHealthMax: healerHealthMax,
      healerMana: healerMana,
      healerManaMax: healerManaMax,
      spellBeingCast: null,
      isGameOver: false,
      gameResult: ''
    };
    this.healerQuestModel.get('monsterHealthChanged').add(this.setMonsterHealthState.bind(this));
    this.healerQuestModel.get('fighterHealthChanged').add(this.setFighterHealthState.bind(this));
    this.healerQuestModel.get('healerHealthChanged').add(this.setHealerHealthState.bind(this));
    this.healerQuestModel.get('healerManaChanged').add(this.setHealerManaState.bind(this));
    this.healerQuestModel.get('spellBeingCastChanged').add(this.setSpellBeingCastState.bind(this));
    this.healerQuestModel.get('isGameOverChanged').add(this.setIsGameOver.bind(this));
    this.healerQuestModel.get('gameResultChanged').add(this.setGameResultState.bind(this));
  }

  setMonsterHealthState() {
    this.setState({monsterHealth: this.healerQuestModel.get('monsterHealth')});
  }
  
  setFighterHealthState() {
    this.setState({fighterHealth: this.healerQuestModel.get('fighterHealth')});
  }

  setHealerHealthState() {
    this.setState({healerHealth: this.healerQuestModel.get('healerHealth')});
  }

  setHealerManaState() {
    this.setState({healerMana: this.healerQuestModel.get('healerMana')});
  }

  setSpellBeingCastState() {
    this.setState({spellBeingCast: this.healerQuestModel.get('spellBeingCast')});
  }

  setGameResultState() {
    this.setState({gameResult: this.healerQuestModel.get('gameResult')});
  }

  setIsGameOver() {
    this.setState({isGameOver: this.healerQuestModel.get('isGameOver')});
  }

  componentDidMount() {
    this.startGameSimulation();
  }

  startGameSimulation() {
    if (getAllImagesLoaded()) {
      const canvas = Canvas();
      this.gameSimulation = new GameSimulation(this.healerQuestModel, canvas);
      this.gameSimulation.startGame();
    } else {
      setTimeout(this.startGameSimulation.bind(this), 1000);
    }
  }

  componentWillUnmount() {
    this.gameSimulation.cleanupGame();
  }

  handleResetClicked() {
    this.gameSimulation.resetGame();
  }

  handleMediumHealClicked() {
    this.gameSimulation.startHealSpell('mediumHeal');
  }

  handleCancelSpellCastClicked() {
    this.gameSimulation.cancelActiveSpellCast();
  }

  render() {
    const enoughManaForSpell = this.state.healerMana > SPELLS.mediumHeal.manaCost;
    const mediumHealDisabled = !enoughManaForSpell || this.state.spellBeingCast;
    const gameResult = this.state.gameResult;
    const gameOverClass = 'game-over-text ' + gameResult.toLowerCase();
    const gameOverText = gameResult === 'YOU-WIN' ? 'You Win!' : 'Game Over';
    return (
      <div className="App">
        <div className="healer-quest-header">Healer Quest</div>
        <button className="reset-button" onClick={this.handleResetClicked.bind(this)}>Reset</button>
        <button className="medium-heal-button" disabled={mediumHealDisabled} onClick={this.handleMediumHealClicked.bind(this)}>Medium Heal</button>
        <button className="cancel-spell-cast-button" disabled={!this.state.spellBeingCast} onClick={this.handleCancelSpellCastClicked.bind(this)}>Cancel Spell</button>
        <div className="canvas-container">
          <div className={gameOverClass}>{gameOverText}</div>
          <canvas id="game-canvas" width="400" height="400"></canvas>
        </div>
        <div className="health-indicators">
          <HealthBar 
            currentHealth={this.state.fighterHealth}
            totalHealth={this.state.fighterHealthMax}
          />
          <div className="healer-stats">
            <HealthBar
              currentHealth={this.state.healerHealth}
              totalHealth={this.state.healerHealthMax}
            />
            <CastBar
              spellBeingCast={this.state.spellBeingCast}
            />
            <ManaBar
              currentMana={this.state.healerMana}
              totalMana={this.state.healerManaMax}
            />
          </div>
        </div>
        <div className="monster-health-indicator">
          <HealthBar
            currentHealth={this.state.monsterHealth}
            totalHealth={this.state.monsterHealthMax}
          />
        </div>
        <AnimationDevPanel />
      </div>
    );
  }
}

export default App;
