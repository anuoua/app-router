import { it, expect } from "bun:test";
import { build } from "../src/utils/build";

it("read dir", async () => {
  const result = await build("test/app", {
    resolve: async (node) => {
      // @ts-expect-error
      delete node.path;
    },
  });
  expect(result).toMatchSnapshot();
});
