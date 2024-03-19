export interface BasicTreeNode<R = unknown> {
  name: string;
  route: string | undefined;
  path: string;
  parent?: BasicTreeNode;
  children: BasicTreeNode[];
  resolved?: R;
}
