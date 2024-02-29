import { isSecure, stripPathPrefix } from "../internal/requests.ts";
import { stripSuffix } from "../internal/strings.ts";
import type { FreshContext } from "../internal/fresh.ts";

interface Application {
  handle(
    request: Request,
    remoteAddr?: Deno.NetAddr,
    secure?: boolean,
  ): Promise<Response | undefined>;
}

export function oak(basePath: string, app: Application) {
  const path = `${stripSuffix(basePath, "/")}/[...path]`;
  async function handler(
    request: Request,
    ctx: FreshContext,
  ): Promise<Response> {
    // TODO: support access to `FreshContext`
    const maybeResponse = await app.handle(
      stripPathPrefix(request, basePath),
      ctx.remoteAddr,
      isSecure(request),
    );
    if (maybeResponse == null) {
      // TODO: improve error handling
      return new Response("Internal Server Error", { status: 500 });
    }
    return maybeResponse;
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
