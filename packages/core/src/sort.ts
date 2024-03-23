import type { BasicTreeNode } from "./type";
import {
  isExactName,
  isExactSlug,
  isGroup,
  isOptionalRestSlug,
  isPrivate,
  isRestSlug,
} from "./utils";

const WEIGHTS = {
  Exact: 9,
  ExactSlug: 8,
  RestSlug: 7,
  OptinalRestSlug: 6,
};

const MAX_SEGMENTS = 10;

export const getScore = (route: string) => {
  const segments = route.split("/");

  segments.shift();

  let score = 0;

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const levelWeights = 10 ** (MAX_SEGMENTS - i);
    if (isExactName(segment)) {
      score += levelWeights * WEIGHTS.Exact;
      continue;
    }
    if (isOptionalRestSlug(segment)) {
      score += levelWeights * WEIGHTS.OptinalRestSlug;
      continue;
    }
    if (isRestSlug(segment)) {
      score += levelWeights * WEIGHTS.RestSlug;
      continue;
    }
    if (isExactSlug(segment)) {
      score += levelWeights * WEIGHTS.ExactSlug;
      continue;
    }
  }
  return score;
};

export const sort = <T extends BasicTreeNode>(
  nodes: [T, Record<string, any>][]
) => {
  return [...nodes].sort(([a], [b]) => getScore(b.route!) - getScore(a.route!));
};
