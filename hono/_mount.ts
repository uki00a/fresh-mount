import { stripPathPrefix } from "../internal/requests.ts";
import { stripSuffix } from "../internal/strings.ts";

interface Hono {
  fetch(request: Request): Response | Promise<Response>;
}

export function hono(basePath: string, hono: Hono) {
  const path = `${stripSuffix(basePath, "/")}/[...path]`;
  function handler(request: Request /*, ctx*/): Response | Promise<Response> {
    // TODO: support access to `FreshContext`
    return hono.fetch(stripPathPrefix(request, basePath));
  }
  const routes = [
    {
      path,
      handler,
    },
  ];
  return {
    name: "fresh-mount-hono",
    routes,
  };
}
