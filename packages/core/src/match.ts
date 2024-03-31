import { sort } from "./sort";
import type { BasicTreeNode } from "./type";
import {
  exactSlugReg,
  isExactName,
  isExactSlug,
  isGroup,
  isOptionalRestSlug,
  isRestSlug,
  mergeParams,
  optionalRestSlugReg,
  restSlugReg,
} from "./utils";

const checkOptionalCatchAll = <T extends any>(node: BasicTreeNode<T>) => {
  if (node.children.length)
    throw new Error(
      `Route name: ${node.name}, optional catch-all segments must be placed last`
    );
};

const checkCatchAll = <T extends any>(node: BasicTreeNode<T>) => {
  if (node.children.length)
    throw new Error(
      `Route name: ${node.name}, catch-all segments must be placed last`
    );
};

export const match = <T>(path: string, tree: BasicTreeNode<T>[]) => {
  const segments = path.split("/");
  segments.shift();

  const matched: [BasicTreeNode<T>, Record<string, any>][] = [];
  const paramsStack: Record<string, any>[] = [];

  const walk = (segmentIndex: number, children: BasicTreeNode<T>[]) => {
    const segment = segments[segmentIndex];

    for (let i = 0; i < children.length; i++) {
      const node = children[i];

      if (isGroup(node.name)) {
        walk(segmentIndex, node.children);
      } else if (isOptionalRestSlug(node.name)) {
        checkOptionalCatchAll(node);
        const match = node.name.match(optionalRestSlugReg) as RegExpMatchArray;
        paramsStack.push({
          [match[1]]: segments.slice(segmentIndex),
        });
        matched.push([node, mergeParams([...paramsStack])]);
        paramsStack.pop();
      } else if (isRestSlug(node.name)) {
        checkCatchAll(node);
        const match = node.name.match(restSlugReg) as RegExpMatchArray;
        paramsStack.push({
          [match[1]]: segments.slice(segmentIndex),
        });
        matched.push([node, mergeParams([...paramsStack])]);
        paramsStack.pop();
      } else if (isExactName(node.name)) {
        if (node.name === segment) {
          const isNextSegmentExist = !!segments[segmentIndex + 1];
          if (isNextSegmentExist) {
            walk(segmentIndex + 1, node.children);
          } else {
            const lastOptionalNode = node.children.find((child) =>
              isOptionalRestSlug(child.name)
            );
            if (lastOptionalNode) {
              checkOptionalCatchAll(lastOptionalNode);
              const match = lastOptionalNode.name.match(
                optionalRestSlugReg
              ) as RegExpMatchArray;
              paramsStack.push({
                [match[1]]: segments.slice(segmentIndex),
              });
              matched.push([lastOptionalNode, mergeParams([...paramsStack])]);
              paramsStack.pop();
            } else {
              matched.push([node, mergeParams([...paramsStack])]);
            }
          }
        }
      } else if (isExactSlug(node.name)) {
        const isNextSegmentExist = !!segments[segmentIndex + 1];
        const lastOptionalNode = node.children.find((child) =>
          isOptionalRestSlug(child.name)
        );
        const match = node.name.match(exactSlugReg) as RegExpMatchArray;
        paramsStack.push({
          [match[1]]: segment,
        });
        if (!isNextSegmentExist && !lastOptionalNode) {
          matched.push([node, mergeParams([...paramsStack])]);
        } else {
          walk(segmentIndex + 1, node.children);
        }
        paramsStack.pop();
      } else {
        throw new Error(`Route name: "${node.name}", is not supported`);
      }
    }
  };

  const [root] = tree;

  matched.push([root, []]);

  walk(0, root.children);

  const [first] = sort(matched);

  return first as typeof first | undefined;
};
