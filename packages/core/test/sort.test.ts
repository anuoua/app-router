import { it, expect } from "bun:test";
import { getScore } from "../src/utils/sort";

const sort = (routes: string[]) => {
  return [...routes].sort((a, b) => getScore(b) - getScore(a));
};

it("sort", () => {
  const sortedRoutes = sort([
    "/abc/[slug]",
    "/abc/[[...slug]]",
    "/abc/[...slug]",
    "/abc/a",
    "/abc/a/[[...slug]]",
  ]);
  expect(sortedRoutes).toMatchObject([
    "/abc/a/[[...slug]]",
    "/abc/a",
    "/abc/[slug]",
    "/abc/[...slug]",
    "/abc/[[...slug]]",
  ]);
});
