import {DEFAULT_MONSTER, DEFAULT_FIGHTER, DEFAULT_HEALER} from '../game-data/actors';

export function getGameResult(healerQuestModel) {
  const fighterHealth = healerQuestModel.get('fighterHealth');
  const monsterHealth = healerQuestModel.get('monsterHealth');
  const healerHealth = healerQuestModel.get('healerHealth');
  if (healerHealth <= 0) {
    return 'YOU-LOSE';
  } else if (monsterHealth <= 0) {
    return 'YOU-WIN';
  } else if (fighterHealth <= 0) {
    return 'YOU-LOSE';
  }
  return '';
}

export const INITIAL_STATE = {
  actors: [DEFAULT_MONSTER, DEFAULT_FIGHTER, DEFAULT_HEALER],
  projectiles: [],
  damageZones: []
}
