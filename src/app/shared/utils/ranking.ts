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
