import { isSecure, stripPathPrefix } from "./requests.ts";
import { assert } from "$std/assert/assert.ts";
import { assertStrictEquals } from "$std/assert/assert_strict_equals.ts";
import { assertEquals } from "$std/assert/assert_equals.ts";

Deno.test("isSecure", {
  permissions: "none",
}, () => {
  assert(!isSecure(new Request("http://localhost:3000/")));
  assert(isSecure(new Request("https://localhost:3000/")));
});

Deno.test("stripPathPrefix", {
  permissions: "none",
}, () => {
  assert(
    stripPathPrefix(new Request("https://localhost:3000/"), "/") instanceof
      Request,
  );

  assertStrictEquals(
    stripPathPrefix(new Request("http://localhost:3000/api/hono"), "/api/hono")
      .url,
    "http://localhost:3000/",
  );
  assertStrictEquals(
    stripPathPrefix(new Request("http://localhost:3001/api/hono/"), "/api/hono")
      .url,
    "http://localhost:3001/",
  );
  assertStrictEquals(
    stripPathPrefix(new Request("http://localhost:3002/api/hono"), "/api/").url,
    "http://localhost:3002/hono",
  );
  assertStrictEquals(
    stripPathPrefix(new Request("http://localhost:3003/foo/"), "/api/").url,
    "http://localhost:3003/foo/",
  );
  assertStrictEquals(
    stripPathPrefix(
      new Request("http://localhost:3004/api/v1/users"),
      "/api/v1/users/",
    ).url,
    "http://localhost:3004/",
  );

  {
    const request = new Request("https://localhost:8000/api/users", {
      headers: { "x-foo": "bar" },
    });
    const keys = [
      "body",
      "cache",
      "credentials",
      "destination",
      "headers",
      "integrity",
      "keepalive",
      "method",
      "mode",
      "redirect",
      "referrer",
      "referrerPolicy",
      "signal",
    ] satisfies Array<keyof Request>;
    const actual = stripPathPrefix(request, "/api");
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key === "headers") {
        const actualHeaders = Array.from(actual[key].entries());
        const expectedHeaders = Array.from(request[key].entries());
        assertEquals(actualHeaders, expectedHeaders);
      } else {
        assertEquals(actual[key], request[key]);
      }
    }
  }
});
