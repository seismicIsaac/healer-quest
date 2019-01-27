
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
  actors: [
    {
      name: 'monster',
      type: 'monster',
      x: 40,
      y: 40,
      hpCurrent: 1500,
      hpTotal: 1500
    },
    {
      name: 'fighter',
      type: 'ally',
      x: 60,
      y: 60,
      hpCurrent: 900,
      hpTotal: 900
    },
    {
      name: 'healer',
      type: 'player',
      x: 150,
      y: 150,
      width: 48,
      height: 48,
      hitboxWidth: 24,
      hitboxHeight: 24,
      speed: 4,
      hpCurrent: 10,
      hpTotal: 10,
      mana: 50,
      manaTotal: 50,
      facingDirection: 'down',
      animationState: 'IDLE'
    }
  ],
  projectiles: []
}