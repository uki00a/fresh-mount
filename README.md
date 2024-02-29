# fresh-mount

Mount Hono and Oak applications as Fresh routes.

## Usage

### Mount Hono applications as Fresh routes

```typescript
// fresh.config.ts
import { defineConfig } from "$fresh/server.ts";
import { hono } from "https://deno.land/x/fresh_mount@$MODULE_VERSION/hono/mod.ts";
import { Hono } from "https://deno.land/x/hono/mod.ts";

const app = new Hono();
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default defineConfig({
  plugins: [
    // Mount a Hono application at `/api`
    hono("/api", app),
  ],
});
```

### Mount Oak applications as Fresh routes

```typescript
// fresh.config.ts
import { defineConfig } from "$fresh/server.ts";
import { oak } from "https://deno.land/x/fresh_mount@$MODULE_VERSION/oak/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.body = "Hello Oak!";
  });
app.use(router.routes());
app.use(router.allowedMethods());

export default defineConfig({
  plugins: [
    // Mount an Oak application at `/api`
    oak("/api", app),
  ],
});
```

## Acknowledgement

This package is inspired by the following projects.

- [koa-mount](https://github.com/koajs/mount)
