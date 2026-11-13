"use client";

import { useEffect, useRef } from "react";
import { requestRefresh } from "./request-refresh";

interface RefreshResponse {
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
      if (isRefreshing.current) return;
      isRefreshing.current = true;

      try {
        const response = await requestRefresh();

        if (!response.ok) {
          if (response.status === 401) {
            sessionStorage.removeItem("displayUser");
            window.dispatchEvent(new Event("auth-session-expired"));
          }
          return;
        }

        const result = (await response.json()) as RefreshResponse;
        if (
          !isActive || typeof result.user?.name !== "string" ||
          !["manager", "student"].includes(result.user.role)
        ) {
          return;
        }

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

    localStorage.removeItem("access_token"); // Remove tokens stored by older releases.
    const startupTimer = window.setTimeout(() => {
      if (isActive) void refreshWhenNeeded();
    }, 0);
    const timer = window.setInterval(() => {
      if (isActive) void refreshWhenNeeded();
    }, 25 * 60_000);

    return () => {
      isActive = false;
      window.clearTimeout(startupTimer);
      window.clearInterval(timer);
    };
  }, []);

  return null;
}
