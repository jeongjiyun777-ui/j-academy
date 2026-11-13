const baseUrl = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

const routes: Record<string, string[]> = {
  GET: ["me", "applications/me", "lesson/access", "chat/access", "admin/applications", "admin/students", "admin/students/search", "admin/students/export", "admin/inquiries/export"],
  POST: ["login", "refresh", "logout", "applications", "chat"],
  PATCH: ["admin/applications/status"],
};

type Context = { params: Promise<{ path: string[] }> };

async function forward(request: Request, context: Context) {
  const path = (await context.params).path.join("/");
  if (!routes[request.method]?.includes(path)) return new Response(null, { status: 404 });
  const url = new URL(request.url);
  if (request.method !== "GET" && request.headers.get("origin") !== url.origin) {
    return Response.json({ detail: "허용되지 않은 요청입니다." }, { status: 403 });
  }

  const headers = new Headers({ "ngrok-skip-browser-warning": "true" });
  for (const name of ["cookie", "content-type"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  try {
    const upstream = await fetch(new URL("/" + path + url.search, baseUrl), {
      method: request.method,
      headers,
      body: request.method === "GET" ? undefined : await request.text(),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    const outgoing = new Headers({ "Cache-Control": "no-store" });
    for (const name of ["content-type", "content-disposition", "www-authenticate"]) {
      const value = upstream.headers.get(name);
      if (value) outgoing.set(name, value);
    }
    for (const cookie of upstream.headers.getSetCookie()) {
      const secureCookie = url.protocol === "https:" && !/;\s*Secure(?:;|$)/i.test(cookie);
      outgoing.append("Set-Cookie", secureCookie ? cookie + "; Secure" : cookie);
    }
    return new Response(upstream.body, { status: upstream.status, headers: outgoing });
  } catch {
    return Response.json({ detail: "서버에 연결할 수 없습니다." }, { status: 502 });
  }
}

export { forward as GET, forward as POST, forward as PATCH };
