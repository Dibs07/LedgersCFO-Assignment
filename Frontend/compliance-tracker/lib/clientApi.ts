import { Client } from "@/lib/types";
import { isRecord, requestWithFallback } from "@/lib/api";

function normalizeClients(payload: unknown): Client[] {
  if (Array.isArray(payload)) {
    return payload as Client[];
  }

  if (isRecord(payload) && Array.isArray(payload.clients)) {
    return payload.clients as Client[];
  }

  return [];
}

export async function getClients(): Promise<Client[]> {
  const payload = await requestWithFallback(["/clients", "/api/client/all"]);
  return normalizeClients(payload);
}
