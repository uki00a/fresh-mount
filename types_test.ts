import type { Plugin } from "$fresh/server.ts";
import type { Has } from "$std/testing/types.ts";
import { assertType } from "$std/testing/types.ts";
import { hono } from "$fresh-mount/hono";
import { Hono } from "$hono";

Deno.test("types", () => {
  {
    const app = new Hono();
    const plugin = hono("/api", app);
    assertType<Has<typeof plugin, Plugin>>(true);
  }
});
