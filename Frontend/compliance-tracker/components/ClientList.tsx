"use client";

import { Client } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ClientListProps = {
  clients: Client[];
  selectedClientId: string | null;
  onSelectClient: (client: Client) => void;
  isLoading: boolean;
  error: string | null;
};

export function ClientList({
  clients,
  selectedClientId,
  onSelectClient,
  isLoading,
  error,
}: ClientListProps) {
  return (
    <aside className="p-4">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Clients</CardTitle>
          <CardDescription>Select a client to view tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <p className="rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-600">
              Loading clients...
            </p>
          )}

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          {!isLoading && !error && clients.length === 0 && (
            <p className="rounded-md bg-zinc-100 px-3 py-2 text-sm text-zinc-600">
              No clients available.
            </p>
          )}

          <ul className="mt-4 space-y-2">
            {clients.map((client) => {
              const isSelected = selectedClientId === client.id;

              return (
                <li key={client.id}>
                  <Button
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => onSelectClient(client)}
                    className="h-auto w-full justify-start py-3 text-left"
                  >
                    <div>
                      <p className="font-medium">{client.company_name}</p>
                      <p className="text-xs opacity-80">{client.country}</p>
                    </div>
                  </Button>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </aside>
  );
}
