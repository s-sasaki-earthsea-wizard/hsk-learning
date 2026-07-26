import type {
  CategoryFilter,
  HskItem,
  QuizDirection,
  QuizQuestion,
} from '../types';

type RandomSource = () => number;

export function shuffle<T>(items: readonly T[], random: RandomSource = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

function getChoiceKey(item: HskItem, direction: QuizDirection): string {
  return direction === 'zh-to-ja'
    ? item.japanese
    : `${item.simplified}|${item.traditional}`;
}

function buildChoices(
  item: HskItem,
  direction: QuizDirection,
  categoryPool: readonly HskItem[],
  random: RandomSource,
): HskItem[] {
  const correctKey = getChoiceKey(item, direction);
  const candidates = categoryPool.filter(
    (candidate, index, pool) =>
      candidate.id !== item.id &&
      getChoiceKey(candidate, direction) !== correctKey &&
      pool.findIndex(
        (entry) => getChoiceKey(entry, direction) === getChoiceKey(candidate, direction),
      ) === index,
  );

  if (candidates.length < 4) {
    throw new Error(`Category "${item.category}" needs at least five distinct choices.`);
  }

  return shuffle([item, ...shuffle(candidates, random).slice(0, 4)], random);
}

function selectBalancedItems(
  items: readonly HskItem[],
  requestedCount: number,
  random: RandomSource,
): HskItem[] {
  const totalCount = Math.min(requestedCount, items.length);
  const targetCounts = {
    vocabulary: Math.ceil(totalCount * 0.6),
    expression: Math.floor(totalCount * 0.2),
    conversation: totalCount - Math.ceil(totalCount * 0.6) - Math.floor(totalCount * 0.2),
  };
  const selected = (Object.keys(targetCounts) as Array<keyof typeof targetCounts>).flatMap(
    (category) =>
      shuffle(
        items.filter((item) => item.category === category),
        random,
      ).slice(0, targetCounts[category]),
  );

  if (selected.length < totalCount) {
    const selectedIds = new Set(selected.map((item) => item.id));
    selected.push(
      ...shuffle(
        items.filter((item) => !selectedIds.has(item.id)),
        random,
      ).slice(0, totalCount - selected.length),
    );
  }

  return shuffle(selected, random);
}

export function createQuizSession(
  items: readonly HskItem[],
  category: CategoryFilter,
  requestedCount: number,
  random: RandomSource = Math.random,
): QuizQuestion[] {
  const categoryPool = items.filter(
    (item) => category === 'all' || item.category === category,
  );
  const selectedItems = category === 'all'
    ? selectBalancedItems(categoryPool, requestedCount, random)
    : shuffle(categoryPool, random).slice(0, Math.min(requestedCount, categoryPool.length));
  const startsWithJapanese = random() >= 0.5;

  return selectedItems.map((item, index) => {
    const direction: QuizDirection =
      (index % 2 === 0) === startsWithJapanese ? 'ja-to-zh' : 'zh-to-ja';
    const sameCategory = items.filter((candidate) => candidate.category === item.category);

    return {
      item,
      direction,
      choices: buildChoices(item, direction, sameCategory, random),
    };
  });
}

export function getCategoryCount(
  items: readonly HskItem[],
  category: CategoryFilter,
): number {
  return category === 'all'
    ? items.length
    : items.filter((item) => item.category === category).length;
}
