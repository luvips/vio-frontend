export async function fetchBackend<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : `/api/backend${path}`;
  const method = (init?.method ?? "GET").toUpperCase();
  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...(method === "GET" ? { next: { revalidate: 300 } } : { cache: "no-store" }),
  });

  if (!response.ok) {
    let detail = "";
    try {
      const body = (await response.json()) as {
        error?: string;
        detail?: string;
        message?: string | string[];
      };

      if (Array.isArray(body.message)) {
        detail = body.message.join(". ");
      } else {
        detail = body.detail || body.error || body.message || "";
      }
    } catch {
      detail = "";
    }

    throw new Error(`API error ${response.status}${detail ? `: ${detail}` : ""}`);
  }

  return response.json() as Promise<T>;
}
