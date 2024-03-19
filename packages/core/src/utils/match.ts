import type { BasicTreeNode } from "../type";
import {
  isExactName,
  isExactSlug,
  isGroup,
  isOptionalRestSlug,
  isRestSlug,
} from "./sort";

export const match = (path: string, root: BasicTreeNode) => {
  const segments = path.split("/");
  segments.shift();

  const matched: BasicTreeNode[] = [];

  const walk = (segmentIndex: number, children: BasicTreeNode[]) => {
    const segment = segments[segmentIndex];

    for (let i = 0; i < children.length; i++) {
      const node = children[i];

      if (isGroup(node.name)) {
        walk(segmentIndex, node.children);
        continue;
      }
      if (isExactName(node.name) || isExactSlug(node.name)) {
        if (node.name === segment || isExactSlug(node.name)) {
          const isNextSegmentExist = !!segments[segmentIndex + 1];
          if (!isNextSegmentExist) {
            const lastOptionalNode = node.children.find((child) =>
              isOptionalRestSlug(child.name)
            );
            if (lastOptionalNode) {
              matched.push(lastOptionalNode);
            } else {
              matched.push(node);
            }
          } else {
            walk(segmentIndex + 1, node.children);
          }
        }
        continue;
      }

      if (isOptionalRestSlug(node.name)) {
        matched.push(node);
        continue;
      }

      if (isRestSlug(node.name)) {
        matched.push(node);
        continue;
      }

      walk(segmentIndex + 1, node.children);
    }
  };

  walk(0, root.children);

  return matched;
};
