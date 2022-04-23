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
  const right = ranks[nextIndex];
  const rank = LexoRank.parse(right);
  return rank.between(nextIndex > prevIndex ? rank.genNext() : rank.genPrev());
};
