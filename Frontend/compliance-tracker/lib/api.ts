const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL;

export const buildUrl = (path: string) =>
  `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export async function requestWithFallback(
  paths: string[],
  init?: RequestInit
): Promise<unknown> {
  let latestError = "Request failed";

  for (const path of paths) {
    try {
      const response = await fetch(buildUrl(path), {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init?.headers ?? {}),
        },
      });

      if (!response.ok) {
        let message = `${response.status} ${response.statusText}`;
        try {
          const errorBody: unknown = await response.json();
          if (isRecord(errorBody) && typeof errorBody.message === "string") {
            message = errorBody.message;
          }
        } catch {
          // Keep the HTTP status text when response body is not JSON.
        }
        latestError = message;
        continue;
      }

      if (response.status === 204) {
        return null;
      }

      return (await response.json()) as unknown;
    } catch (error) {
      latestError =
        error instanceof Error ? error.message : "Network request failed";
    }
  }

  throw new Error(latestError);
}
