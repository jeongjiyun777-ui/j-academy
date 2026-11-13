let pendingRefresh: Promise<Response> | undefined;

export async function requestRefresh() {
  pendingRefresh ??= fetch("/api/backend/refresh", {
    method: "POST",
    cache: "no-store",
  }).finally(() => { pendingRefresh = undefined; });

  return (await pendingRefresh).clone();
}

export async function sessionFetch(input: string, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.status !== 401) return response;

  const refreshed = await requestRefresh();
  if (!refreshed.ok) {
    if (refreshed.status === 401) {
      sessionStorage.removeItem("displayUser");
      window.dispatchEvent(new Event("auth-session-expired"));
    }
    return response;
  }
  return fetch(input, init);
}
