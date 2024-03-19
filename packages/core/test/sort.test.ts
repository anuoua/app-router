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
    "/abc/[a]/[[...slug]]",
    "/abc/[a]/b",
  ]);
  expect(sortedRoutes).toMatchObject([
    "/abc/a/[[...slug]]",
    "/abc/a",
    "/abc/[a]/b",
    "/abc/[a]/[[...slug]]",
    "/abc/[slug]",
    "/abc/[...slug]",
    "/abc/[[...slug]]",
  ]);
});
