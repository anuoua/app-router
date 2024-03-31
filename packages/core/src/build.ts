import path from "path";
import { glob } from "glob";
import { isGroup, isParallel, isInterception, isPrivate } from "./utils";
import type { BasicTreeNode } from "./type";

const buildTree = async (
  routePaths: string[],
  target: string,
  options: Options
) => {
  const root: BasicTreeNode = {
    name: "",
    route: "",
    path: "",
    children: [],
  };

  const routeMap: Record<string, BasicTreeNode> = {};

  for (let routePath of routePaths) {
    const segments = (routePath === "." ? "" : `/${routePath}`).split("/");
    let currentNode: BasicTreeNode = root;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      if (isPrivate(segment) || isParallel(segment) || isInterception(segment))
        break;

      let childNode = currentNode.children?.find(
        (child) => child.name === segment
      );

      if (!childNode) {
        let route =
          segments
            .filter((i) => !isGroup(i))
            .slice(0, i + 1)
            .join("/") || "/";
        childNode = {
          name: segment === "/" ? "" : segment,
          route: isGroup(segment) ? undefined : route,
          path: path.resolve(target, routePath),
          children: [],
        };
        childNode.parent = currentNode === root ? undefined : currentNode;
        childNode.resolved = await options.resolve?.(childNode);
        currentNode.children?.push(childNode);
        if (!isGroup(segment)) routeMap[route] = childNode;
      }

      currentNode = childNode;
    }
  }

  return root.children || [];
};

export interface Options {
  resolve?: (node: BasicTreeNode) => Promise<any>;
}

export const build = async <P extends Options>(target: string, options: P) => {
  const allPaths = await glob("./**/", {
    cwd: path.resolve(target),
  });
  type Resolve = (typeof options)["resolve"];
  type RetType = Resolve extends (...args: any[]) => Promise<infer R>
    ? R
    : undefined;
  return buildTree(allPaths, target, options) as unknown as Promise<
    BasicTreeNode<RetType>[]
  >;
};
