import { defineConfig } from "$fresh/server.ts";
import twind from "$fresh/plugins/twindv1.ts";
import { hono } from "$fresh-mount/hono";
import { oak } from "$fresh-mount/oak";
import { Hono } from "$hono";
import { Application, Router } from "$oak";
import twindConfig from "./twind.config.ts";

const honoApp = new Hono();
honoApp.get("/", (c) => {
  return c.text("Hello Hono!");
});
honoApp.post("/messages", async (c) => {
  const body = await c.req.json();
  return c.json({ id: crypto.randomUUID(), message: body.message });
});

const oakApp = new Application();
const oakRouter = new Router();
oakRouter
  .get("/", (ctx) => {
    ctx.response.body = "Hello Oak!";
  })
  .get("/ip", (ctx) => {
    ctx.response.body = ctx.request.ip;
  })
  .post("/posts", async (ctx) => {
    const post = await ctx.request.body.json();
    ctx.response.body = { ...post, id: crypto.randomUUID() };
  });
oakApp.use(oakRouter.routes());
oakApp.use(oakRouter.allowedMethods());

export default defineConfig({
  plugins: [
    twind(twindConfig),
    hono("/api/hono", honoApp),
    oak("/api/oak", oakApp),
  ],
});
