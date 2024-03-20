import path from "path";
import { it, expect } from "bun:test";
import { build } from "@app-route/core";
import { resolve } from "./index";

it("resolve", async () => {
  const tree = await build("./app", {
    resolve,
  });
  const { handler, middleware, GET, POST } = tree[0].resolved!;
  expect(handler).toBe(path.resolve("app/handler.ts"));
  expect(middleware).toBe(path.resolve("app/middleware.ts"));
  expect(GET).toBe(path.resolve("app/GET.ts"));
  expect(POST).toBeUndefined();
});
