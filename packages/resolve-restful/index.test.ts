import { it, expect } from "bun:test";
import path from "path";
import { build } from "@app-route/core";
import { resolve } from ".";

it("resolve", async () => {
  const tree = await build("./app", {
    resolve,
  });
  const { handler, middleware } = tree[0].resolved!;
  expect(handler).toBe(path.resolve("app/handler.ts"));
  expect(middleware).toBe(path.resolve("app/middleware.ts"));
});
