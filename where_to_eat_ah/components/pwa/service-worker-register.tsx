"use client";

import { useEffect } from "react";

export const ServiceWorkerRegister = () => {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      // Only register in production, or in dev if explicitly enabled
      const enableInDev = process.env.NEXT_PUBLIC_ENABLE_PWA_DEV === "true";
      const shouldRegister = process.env.NODE_ENV === "production" || enableInDev;

      if (!shouldRegister) {
        console.log("[SW] Service Worker registration skipped in development mode");
        return;
      }
      // Register service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[SW] Service Worker registered with scope:", registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000); // Check every hour

          // Listen for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New service worker installed, show update prompt
                  console.log("[SW] New content available, please refresh");

                  // You can dispatch a custom event here to show an update notification
                  window.dispatchEvent(
                    new CustomEvent("sw-update-available", {
                      detail: { registration },
                    })
                  );
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("[SW] Service Worker registration failed:", error);
        });

      // Handle controller change (new service worker activated)
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("[SW] Controller changed, reloading page");
        window.location.reload();
      });
    } else if (typeof window !== "undefined" && !("serviceWorker" in navigator)) {
      console.log("[SW] Service Worker not supported in this browser");
    }
  }, []);

  return null; // This component doesn't render anything
};
