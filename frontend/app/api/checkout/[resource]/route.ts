const paymentApi = process.env.PAYMENT_API_BASE_URL ?? "http://127.0.0.1:8080";

async function forward(resource: string, request: Request) {
  const headers = new Headers();
  const cookie = request.headers.get("cookie")?.split(/;\s*/).find((part) => part.startsWith("access_token="));
  if (cookie) headers.set("Cookie", cookie);
  const isOrder = resource === "orders";
  if (isOrder && request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ message: "허용되지 않은 요청입니다." }, { status: 403 });
  }
  if (isOrder) headers.set("Content-Type", "application/json");

  try {
    const upstream = await fetch(new URL("/checkout/" + resource, paymentApi), {
      method: request.method,
      headers,
      body: isOrder ? await request.text() : undefined,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
    const responseHeaders = new Headers({ "Cache-Control": "no-store" });
    for (const name of ["content-type", "www-authenticate"]) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch {
    return Response.json({ message: "결제 서버에 연결할 수 없습니다." }, { status: 502 });
  }
}

export async function GET(request: Request, context: { params: Promise<{ resource: string }> }) {
  const { resource } = await context.params;
  return resource === "courses" ? forward(resource, request) : new Response(null, { status: 404 });
}

export async function POST(request: Request, context: { params: Promise<{ resource: string }> }) {
  const { resource } = await context.params;
  return resource === "orders" ? forward(resource, request) : new Response(null, { status: 404 });
}
