import { defineConfig } from "$fresh/server.ts";
import twind from "$fresh/plugins/twindv1.ts";
import { hono } from "$fresh-mount/hono";
import { Hono } from "$hono";
import twindConfig from "./twind.config.ts";

const honoApp = new Hono();
honoApp.get("/", (c) => {
  return c.text("Hello Hono!");
});
honoApp.post("/messages", async (c) => {
  const body = await c.req.json();
  return c.json({ id: crypto.randomUUID(), message: body.message });
});

export default defineConfig({
  plugins: [
    twind(twindConfig),
    hono("/api/hono", honoApp),
  ],
});
