import type { Plugin } from "$fresh/server.ts";
import type { Has } from "$std/testing/types.ts";
import { assertType } from "$std/testing/types.ts";
import { hono } from "$fresh-mount/hono";
import { oak } from "$fresh-mount/oak";
import { Hono } from "$hono";
import { Application } from "$oak";

Deno.test("types", () => {
  {
    const app = new Hono();
    const plugin = hono("/api", app);
    assertType<Has<typeof plugin, Plugin>>(true);
  }

  {
    const app = new Application();
    const plugin = oak("/api", app);
    assertType<Has<typeof plugin, Plugin>>(true);
  }
});
