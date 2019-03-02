import Signal from '../event/signal';
import { INITIAL_STATE } from '../game-logic/game-rules';

const DEFAULT_FIGHTER_HEALTH = 900;
const DEFAULT_MONSTER_HEALTH = 1500;
const DEFAULT_HEALER_HEALTH = 10;
const DEFAULT_HEALER_MANA = 50;
const DEFAULT_HEALER_MANA_REGEN = 6;

function HealerQuestUIModel() {
  var properties = {
    fighterHealth: DEFAULT_FIGHTER_HEALTH,
    fighterHealthMax: DEFAULT_FIGHTER_HEALTH,
    healerHealth: DEFAULT_HEALER_HEALTH,
    healerHealthMax: DEFAULT_HEALER_HEALTH,
    healerMana: DEFAULT_HEALER_MANA,
    healerManaMax: DEFAULT_HEALER_MANA,
    healerManaRegen: DEFAULT_HEALER_MANA_REGEN,
    monsterHealth: DEFAULT_MONSTER_HEALTH,
    monsterHealthMax: DEFAULT_MONSTER_HEALTH,
    spellBeingCast: null,
    isGameOver: false,
    gameResult: '',
    isRegeneratingMana: false
  }

  var gameState = INITIAL_STATE;
  var actorsByName = {
    'healer': INITIAL_STATE.actors[2],
    'fighter': INITIAL_STATE.actors[1],
    'monster': INITIAL_STATE.actors[0]
  }

  return {
    getActorByName: function(actorName) {
      return actorsByName[actorName];
    },
    get: function(propertyName) {
      if (propertyName.endsWith('Changed') && !properties[propertyName]) {
        properties[propertyName] = new Signal();
      }
      if (properties[propertyName] !== undefined) {
        return properties[propertyName];
      }
      //TODO: Don't output properties with error message. This is for debug purposes.
      console.error(`Unable to get property name: ${propertyName}. Does not ` +
        `exist on HealerQuestModel:  ${properties}`);
    },
    set: function(propertyName, newValue) {
      const oldValue = properties[propertyName];
      if (oldValue === undefined) {
        console.error(`Unable to set property name: ${propertyName}. Does not` +
          ` exist on HealerQuestModel: ${properties}`);
      } else if (oldValue !== newValue) {
        const propertySignalKey = propertyName + 'Changed';
        const signal = this.get(propertySignalKey);
        properties[propertyName] = newValue;
        signal.dispatch();
      }
    },
    add: function(propertyName, initialValue) {
      if (!properties[propertyName]) {
        properties[propertyName] = initialValue;
      } else {
        console.error(`ERROR: Property ${propertyName} already exists on` +
          ` HealerQuestModel with value: ${properties[propertyName]}`);
      }
    },
    getGameState: function() {
      return gameState;
    },
    setGameState: function(newGameState) {
      gameState = newGameState;
    }
  }
}

export default HealerQuestUIModel;