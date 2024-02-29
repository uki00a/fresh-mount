import { stripPathPrefix } from "../internal/requests.ts";
import { stripSuffix } from "../internal/strings.ts";
interface Application {
  handle(request: Request): Promise<Response | undefined>;
}

export function oak(basePath: string, app: Application) {
  const path = `${stripSuffix(basePath, "/")}/[...path]`;
  async function handler(request: Request /*, ctx*/): Promise<Response> {
    // TODO: support access to `FreshContext`
    const maybeResponse = await app.handle(stripPathPrefix(request, basePath));
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
