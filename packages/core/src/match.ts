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
        const match = node.name.match(optionalRestSlugReg) as RegExpMatchArray;
        paramsStack.push({
          [match[1]]: segments.slice(segmentIndex),
        });
        matched.push([node, mergeParams([...paramsStack])]);
        paramsStack.pop();
      } else if (isRestSlug(node.name)) {
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
        throw new Error(`Route name: "${node.name}" is not supported`);
      }
    }
  };

  const [root] = tree;

  if (segments[0] === "") {
    matched.push([root, []]);
  } else {
    walk(0, root.children);
  }

  const [first] = sort(matched);

  return first as typeof first | undefined;
};
