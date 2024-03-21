export interface BasicTreeNode<R = unknown> {
  name: string;
  route: string | undefined;
  path: string;
  parent?: BasicTreeNode<R>;
  children: BasicTreeNode<R>[];
  resolved?: R;
}
