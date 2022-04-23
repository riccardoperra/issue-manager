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
