import { createHandler } from "$fresh/server.ts";
import { assertStrictEquals } from "$std/assert/assert_strict_equals.ts";
import { assertObjectMatch } from "$std/assert/assert_object_match.ts";
import { faker } from "@faker-js/faker";
import manifest from "./demo/fresh.gen.ts";
import config from "./demo/fresh.config.ts";

Deno.test("integration tests", async (t) => {
  const handler = await createHandler(manifest, config);
  await t.step("hono", async (t) => {
    await t.step("request to the root URL", async () => {
      const res = await handler(new Request("/api/hono"));
      assertStrictEquals(await res.text(), "Hello Hono!");
      assertStrictEquals(res.status, 200);
    });

    await t.step(
      "redirect a request that end with a trailing shash by default",
      async () => {
        const res = await handler(new Request("/api/hono/"));
        // NOTE: https://github.com/denoland/fresh/blob/1.6.5/src/server/context.ts#L234-L240
        assertStrictEquals(
          res.status,
          307,
          "Fresh should redirect requests that end with a trailing slash by default",
        );
      },
    );

    await t.step(
      "handle a request that end with a trailing slash if `router.trailingSlash` is set",
      async () => {
        const handler = await createHandler(manifest, {
          ...config,
          router: {
            ...config.router,
            trailingSlash: true,
          },
        });
        const res = await handler(new Request("/api/hono/"));
        assertStrictEquals(res.status, 200);
        assertStrictEquals(await res.text(), "Hello Hono!");
      },
    );

    await t.step("request to a non-root URL", async () => {
      const message = faker.word.words();
      const res = await handler(
        new Request("/api/hono/messages", {
          method: "POST",
          body: JSON.stringify({ message }),
          headers: { "content-type": "text/json" },
        }),
      );
      assertObjectMatch(await res.json(), { message: message });
      assertStrictEquals(res.status, 200);
    });
  });

  await t.step("oak", async (t) => {
    await t.step("request to the root URL", async () => {
      const res = await handler(new Request("/api/oak"));
      assertStrictEquals(await res.text(), "Hello Oak!");
      assertStrictEquals(res.status, 200);
    });

    await t.step("request to a non-root URL", async () => {
      const content = faker.lorem.text();
      const res = await handler(
        new Request("/api/oak/posts", {
          method: "POST",
          body: JSON.stringify({ content }),
          headers: { "content-type": "text/json" },
        }),
      );
      assertObjectMatch(await res.json(), { content });
      assertStrictEquals(res.status, 200);
    });

    await t.step("support `Context.request.ip`", async () => {
      const res = await handler(new Request("/api/oak/ip"), {
        remoteAddr: { transport: "tcp", hostname: "example.com", port: 443 },
      });
      assertStrictEquals(res.status, 200);
      assertStrictEquals(await res.text(), "example.com");
    });
  });
});
