let pendingRefresh: Promise<Response> | undefined;

export async function requestRefresh(apiBaseUrl: string) {
  pendingRefresh ??= fetch(apiBaseUrl + "/refresh", {
    method: "POST",
    cache: "no-store",
    headers: { "ngrok-skip-browser-warning": "true" },
    credentials: "include",
  }).finally(() => { pendingRefresh = undefined; });

  return (await pendingRefresh).clone();
}
