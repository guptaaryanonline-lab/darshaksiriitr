"use client";

import { useEffect } from "react";

// Catches errors thrown in the root layout itself, where the normal
// error.tsx boundary cannot help because it renders *inside* the layout.
// This must render its own <html>/<body> since it replaces the whole tree.
export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.25rem",
            textAlign: "center",
            background: "#f7f8fb",
            color: "#172033"
          }}
        >
          <div style={{ maxWidth: "28rem" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>The site hit a critical error</h1>
            <p style={{ marginTop: "1rem", lineHeight: 1.7, color: "#475569" }}>
              Please refresh the page. If the problem continues, try again shortly.
            </p>
            <button
              type="button"
              onClick={reset}
              style={{
                marginTop: "2rem",
                borderRadius: "0.5rem",
                background: "#0b3d91",
                color: "#fff",
                padding: "0.75rem 1.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer"
              }}
            >
              Reload
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
