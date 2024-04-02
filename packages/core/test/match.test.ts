import { it, expect } from "bun:test";
import { match } from "../src/match";
import { build } from "../src";

it("match", async () => {
  const tree = await build("test/app", {});

  const matched0 = match("/", tree)!;
  expect(matched0[0].route).toBe("/");
  expect(matched0[1]).toMatchObject({});

  const matched1 = match("/settings/a", tree)!;
  expect(matched1[0].route).toBe("/settings/[user]");
  expect(matched1[1]).toMatchObject({ user: "a" });

  const matched2 = match("/settings/a/c", tree)!;
  expect(matched2[0].route).toBe("/settings/[user]/[role]");
  expect(matched2[1]).toMatchObject({ user: "a", role: "c" });

  const matched3 = match("/settings/a/admin", tree)!;
  expect(matched3[0].route).toBe("/settings/[user]/admin");
  expect(matched3[1]).toMatchObject({ user: "a" });

  const matched4 = match("/settings/a/b/inner", tree)!;
  expect(matched4[0].route).toBe("/settings/[user]/[role]/inner");
  expect(matched4[1]).toMatchObject({ user: "a", role: "b" });

  const matched5 = match("/settings/a/b/c/d", tree)!;
  expect(matched5[0].route).toBe("/settings/[user]/[...rest]");
  expect(matched5[1]).toMatchObject({ user: "a", rest: ["b", "c", "d"] });

  const matched6 = match("/settings/a/b/c", tree)!;
  expect(matched6[0].route).toBe("/settings/[user]/[...rest]");
  expect(matched6[1]).toMatchObject({ user: "a", rest: ["b", "c"] });

  const matched7 = match("/home/a/b/c", tree)!;
  expect(matched7[0].route).toBe("/home/[[...optional]]");
  expect(matched7[1]).toMatchObject({ optional: ["a", "b", "c"] });

  const matched8 = match("/home", tree)!;
  expect(matched8[0].route).toBe("/home/[[...optional]]");
  expect(matched8[1]).toMatchObject({});
});
