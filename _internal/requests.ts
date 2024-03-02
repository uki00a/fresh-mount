export function stripPathPrefix(request: Request, pathPrefix: string): Request {
  const url = new URL(request.url);
  if (url.pathname.startsWith(pathPrefix)) {
    url.pathname = url.pathname.slice(pathPrefix.length);
  } else if (
    pathPrefix.endsWith("/") && url.pathname.startsWith(pathPrefix.slice(0, -1))
  ) {
    url.pathname = url.pathname.slice(pathPrefix.length - 1);
  }
  return new Request(url, {
    method: request.method,
    body: request.body,
    cache: request.cache,
    credentials: request.credentials,
    headers: request.headers,
    integrity: request.integrity,
    keepalive: request.keepalive,
    mode: request.mode,
    redirect: request.redirect,
    referrer: request.referrer,
    referrerPolicy: request.referrerPolicy,
    signal: request.signal,
  });
}

export function isSecure(request: Request): boolean {
  return new URL(request.url).protocol === "https:";
}
