"use client";

import { useEffect, useRef } from "react";

interface RefreshResponse {
  access_token: string;
  user: {
    name: string;
    role: "manager" | "student";
  };
}

export default function RefreshSession() {
  const isRefreshing = useRef(false);

  useEffect(() => {
    let isActive = true;

    const refreshWhenNeeded = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken || isRefreshing.current) return;

      let expiresAt = 0;
      try {
        const payload = accessToken.split(".")[1];
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const claims = JSON.parse(
          atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="))
        );
        expiresAt = typeof claims.exp === "number" ? claims.exp * 1000 : 0;
      } catch {
        expiresAt = 0;
      }

        const hasCachedUser = sessionStorage.getItem("displayUser") !== null;
        if (expiresAt - Date.now() > 60_000 && hasCachedUser) return;

      isRefreshing.current = true;
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? `http://${window.location.hostname}:8000`;

      try {
        const response = await fetch(`${apiBaseUrl}/refresh`, {
          method: "POST",
          cache: "no-store",
          headers: { "ngrok-skip-browser-warning": "true" },
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token");
            sessionStorage.removeItem("displayUser");
            window.dispatchEvent(new Event("auth-session-expired"));
          }
          return;
        }

        const result = (await response.json()) as RefreshResponse;
        if (
          typeof result.access_token !== "string" ||
          typeof result.user?.name !== "string" ||
          !["manager", "student"].includes(result.user.role)
        ) {
          return;
        }

        localStorage.setItem("access_token", result.access_token);
        sessionStorage.setItem(
          "displayUser",
          JSON.stringify({ name: result.user.name, role: result.user.role })
        );
        window.dispatchEvent(
          new CustomEvent("auth-session-restored", {
            detail: { name: result.user.name, role: result.user.role },
          })
        );
      } catch {
        // The next scheduled refresh attempt will retry the request.
      } finally {
        isRefreshing.current = false;
      }
    };

    const startupTimer = window.setTimeout(() => {
      if (isActive) void refreshWhenNeeded();
    }, 0);
    const timer = window.setInterval(() => {
      if (isActive) void refreshWhenNeeded();
    }, 30_000);

    return () => {
      isActive = false;
      window.clearTimeout(startupTimer);
      window.clearInterval(timer);
    };
  }, []);

  return null;
}
