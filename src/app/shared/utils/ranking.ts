/**
 * LexoRank wrapped utils
 */
import { LexoRank } from 'lexorank';

export const parseRank = (rank: string) => LexoRank.parse(rank);

export const sortByRank = (a: string, b: string): number => {
  const left = parseRank(a);
  const right = parseRank(b);
  return left.compareTo(right);
};

export const sortArrayByRankProperty = <
  T,
  K extends keyof Pick<
    T,
    // TODO: fix type
    keyof { [key in keyof T]: T[key] extends string ? key : never }
  >
>(
  array: readonly T[],
  key: K
): readonly T[] => {
  return (array as T[]).sort((a, b) =>
    sortByRank(a[key] as unknown as string, b[key] as unknown as string)
  );
};

export const getNextRank = (ranks: string[]): LexoRank => {
  if (ranks.length === 0) return LexoRank.middle();
  const lastRank = ranks[ranks.length - 1];
  return LexoRank.parse(lastRank).genNext();
};

export const moveRank = (
  ranks: string[],
  prevIndex: number,
  nextIndex: number
): LexoRank => {
  if (!ranks || ranks.length === 0) return LexoRank.middle();
  const parsedRanks = ranks.map(LexoRank.parse);
  const replacedItemRank = LexoRank.parse(ranks[nextIndex]);
  const isFirst = nextIndex === 0;
  const isLast = nextIndex === ranks.length - 1;

  if (isFirst) {
    return replacedItemRank.between(parsedRanks[0].genPrev());
  } else if (isLast) {
    return replacedItemRank.between(parsedRanks[nextIndex].genNext());
  } else {
    const siblingIndex = prevIndex < nextIndex ? nextIndex + 1 : nextIndex - 1;
    return replacedItemRank.between(parsedRanks[siblingIndex]);
  }
};
