import React, { Component } from 'react';
import './App.css';
import {HealthBar, CastBar} from './components/progress-bar/ProgressBar';
import HealerQuestUIModel from './model/healer-quest-ui-model';
import GameSimulation from './game-logic/game-simulation';
import Canvas from './canvas';
import SPELLS from './game-data/spells';
import { loadAssets, getAllImagesLoaded } from './images/asset-loader';
import { AnimationDevPanel } from './components/animation-viewer/AnimationDevPanel';
import { ACTOR_NAME_MONSTER, ACTOR_NAME_HEALER } from './game-data/actors';
import { AllyVitals } from './components/ally-vitals/AllyVitals';
import { STAT_NAME_HEALTH, STAT_VALUE_MAXIMUM_KEY, STAT_NAME_MANA } from './game-logic/common';

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
    const healer = this.healerQuestModel.getGameState().actors.find(actor => actor.name === ACTOR_NAME_HEALER);
    const healerX = healer.x;
    const healerY = healer.y;
    this.setState({
      healerX: healerX,
      healerY: healerY,
      spellBeingCast: this.healerQuestModel.get('spellBeingCast')
    });
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

  handlePauseGameSimClicked() {
    this.gameSimulation.pauseGame();
  }

  handleTickClicked() {
    this.gameSimulation.tick();
  }

  handleMediumHealClicked() {
    this.gameSimulation.startHealSpell('mediumHeal');
  }

  handleCancelSpellCastClicked() {
    this.gameSimulation.cancelActiveSpellCast();
  }

  getAllyVitals() {
    const actors = this.healerQuestModel.getGameState().actors.filter(actor => actor.name !== ACTOR_NAME_MONSTER);
    return actors.map((actor) => {
      const healthKey = actor.name + STAT_NAME_HEALTH;
      const healthMax = actor.name + STAT_NAME_HEALTH + STAT_VALUE_MAXIMUM_KEY;
      const manaKey = actor.name + STAT_NAME_MANA;
      const manaMax = actor.name + STAT_NAME_MANA + STAT_VALUE_MAXIMUM_KEY;
      return (
        <AllyVitals 
          currentHealth={this.state[healthKey]}
          totalHealth={this.state[healthMax]}
          currentMana={this.state[manaKey]}
          totalMana={this.state[manaMax]}
          actorName={actor.name}
        />
      )
    })
  }

  render() {
    const enoughManaForSpell = this.state.healerMana > SPELLS.mediumHeal.manaCost;
    const mediumHealDisabled = !enoughManaForSpell || this.state.spellBeingCast;
    const gameResult = this.state.gameResult;
    const gameOverClass = 'game-over-text ' + gameResult.toLowerCase();
    const gameOverText = gameResult === 'YOU-WIN' ? 'You Win!' : 'Game Over';
    return (
      <div className="App">
        <div className="debug-buttons">
          <button className="reset-button" onClick={this.handleResetClicked.bind(this)}>Reset</button>
          <button className="pause-game-simulation" onClick={this.handlePauseGameSimClicked.bind(this)}>Pause</button>
          <button className="tick" onClick={this.handleTickClicked.bind(this)}>Tick</button>
        </div>
        <button className="medium-heal-button" disabled={mediumHealDisabled} onClick={this.handleMediumHealClicked.bind(this)}>Medium Heal</button>
        <button className="cancel-spell-cast-button" disabled={!this.state.spellBeingCast} onClick={this.handleCancelSpellCastClicked.bind(this)}>Cancel Spell</button>
        <div className="canvas-container">
          <div className={gameOverClass}>{gameOverText}</div>
          <canvas id="game-canvas" width="400" height="400"></canvas>
        </div>
        <div className="party-members-container">
          {this.getAllyVitals()}
          <div className="monster-health-indicator">
            <HealthBar
              currentHealth={this.state.monsterHealth}
              totalHealth={this.state.monsterHealthMax}
            />
            <AnimationDevPanel />
          </div>
        </div>
        <div className="cast-bar-container">
          <CastBar
            healerX={this.state.healerX}
            healerY={this.state.healerY}
            spellBeingCast={this.state.spellBeingCast}
          />
        </div>
        
      </div>
    );
  }
}

export default App;
