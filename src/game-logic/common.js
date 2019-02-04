export const STAT_NAME_MANA = 'Mana';
export const STAT_NAME_HEALTH = 'Health';
export const STAT_VALUE_MAXIMUM_KEY = 'Max';

export function updateActorStat(healerQuestModel, actorName, statName, delta) {
  const statKey = actorName + statName;
  const currentStatValue = healerQuestModel.get(statKey);
  const maxStatValue = healerQuestModel.get(statKey + STAT_VALUE_MAXIMUM_KEY);
  if (delta < 0) {
    healerQuestModel.set(statKey, Math.max(currentStatValue + delta, 0));
  } else {
    healerQuestModel.set(statKey, Math.min(currentStatValue + delta, maxStatValue));
  }
}