import type { BasicTreeNode } from "../type";

const WEIGHTS = {
  Exact: 9,
  ExactSlug: 8,
  RestSlug: 7,
  OptinalRestSlug: 6,
};

const MAX_SEGMENTS = 10;

export const isPrivate = (segment: string) => {
  return /^\_\w+$/.test(segment);
};

export const isGroup = (segment: string) => {
  return /^\(\w+\)$/.test(segment);
};

export const isExactName = (segment: string) => {
  return /^\w+$/.test(segment);
};

export const isExactSlug = (segment: string) => {
  return /^\[\w+\]$/.test(segment);
};

export const isRestSlug = (segment: string) => {
  return /^\[\.\.\.\w+\]$/.test(segment);
};

export const isOptionalRestSlug = (segment: string) => {
  return /^\[\[\.\.\.\w+\]\]$/.test(segment);
};

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

export const sort = (nodes: BasicTreeNode[]) => {
  return [...nodes].sort((a, b) => getScore(b.route!) - getScore(a.route!));
};
