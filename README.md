# app-route

App route core package for js runtime, e.g `Node` `Bun`.

## Install

```shell
npm i @app-route/core
```

## Usage

- `build`
  build the directory tree
- `match`
  match url return directory node and params

example:

```javascript
import { build, match } from "@app-route/core";

const root = await build("./app", {
  resolve: async (node) => {
    // return extra data to `node.resolved`
    // example:
    return {
      hello: "world",
    };
  },
});

const matched = match("/hello", root);

if (!matched) return;

const [node, params] = matched;

// node.resolved.hello === "world"
// params: {}
```

## Dynamic Routes

The App Router file system routing has three types of dynamic route segments

- `[slug]`
- `[...slug]`
- `[[...slug]]`

```
app
├── roles
│   └── [id]
│       └── [name]
├── posts
│   └── [[...ids]]
└── users
    └── [...ids]

```

Corresponding URLs, routes, and parameter matching table

| URL          | Route               | Params                       |
| ------------ | ------------------- | ---------------------------- |
| `/roles/a/b` | `roles/[id]/[name]` | `{ "id": "a", "name": "b" }` |
| `/roles/a`   | `roles/[id]`        | `{ "id": "a" }`              |
| `/users/a/b` | `users/[...ids]`    | `{ "ids": ["a", "b"] }`      |
| `/users/a`   | `users/[...ids]`    | `{ "ids": ["a"] }`           |
| `/users`     | `users`             | `{}`                         |
| `/posts/a/b` | `posts/[[...ids]]`  | `{ "ids": ["a", "b"] }`      |
| `/posts/a`   | `posts/[[...ids]]`  | `{ "ids": ["a"] }`           |
| `/posts`     | `posts/[[...ids]]`  | `{"ids": []}`                |

Get Params in the interface

## Node struct

```typescript
interface BasicTreeNode<R = unknown> {
  name: string;
  route: string | undefined;
  path: string;
  parent?: BasicTreeNode<R>;
  children: BasicTreeNode<R>[];
  resolved?: R;
}
```

## LICENSE

MIT
