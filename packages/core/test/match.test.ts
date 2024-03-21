import { it, expect } from "bun:test";
import { match } from "../src/utils/match";
import { build } from "../src";
import { sort } from "../src/utils/sort";

it("match", async () => {
  const tree = await build("test/app", {});

  const matchedNodes0 = match("/", tree);
  const sortedUrl0 = sort(matchedNodes0);
  expect(sortedUrl0[0].route).toBe("/");

  const matchedNodes1 = match("/settings/a", tree);
  const sortedUrl1 = sort(matchedNodes1);
  expect(sortedUrl1[0].route).toBe("/settings/[user]");

  const matchedNodes2 = match("/settings/a/c", tree);
  const sortedUrl2 = sort(matchedNodes2);
  expect(sortedUrl2[0].route).toBe("/settings/[user]/[role]");

  const matchedNodes3 = match("/settings/a/admin", tree);
  const sortedUrl3 = sort(matchedNodes3);
  expect(sortedUrl3[0].route).toBe("/settings/[user]/admin");

  const matchedNodes4 = match("/settings/a/b/inner", tree);
  const sortedUrl4 = sort(matchedNodes4);
  expect(sortedUrl4[0].route).toBe("/settings/[user]/[role]/inner");

  const matchedNodes5 = match("/settings/a/b/c/d", tree);
  const sortedUrl5 = sort(matchedNodes5);
  expect(sortedUrl5[0].route).toBe("/settings/[user]/[...rest]");

  const matchedNodes6 = match("/settings/a/b/c", tree);
  const sortedUrl6 = sort(matchedNodes6);
  expect(sortedUrl6[0].route).toBe("/settings/[user]/[...rest]");

  const matchedNodes7 = match("/home/a/b/c", tree);
  const sortedUrl7 = sort(matchedNodes7);
  expect(sortedUrl7[0].route).toBe("/home/[[...optional]]");

  const matchedNodes8 = match("/home", tree);
  const sortedUrl8 = sort(matchedNodes8);
  expect(sortedUrl8[0].route).toBe("/home/[[...optional]]");
});
