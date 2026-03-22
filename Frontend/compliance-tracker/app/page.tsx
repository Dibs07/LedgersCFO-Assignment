
"use client";

import { useEffect, useMemo, useState } from "react";
import { ClientList } from "@/components/ClientList";
import { Filters } from "@/components/Filters";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getClients } from "@/lib/clientApi";
import { createTask, getTasks, updateTaskStatus } from "@/lib/taskApi";
import { Client, CreateTaskInput, Task, TaskFilters } from "@/lib/types";

const defaultFilters: TaskFilters = {
  status: "all",
  category: "all",
};

const isOverdueTask = (task: Task): boolean =>
  task.status !== "completed" &&
  new Date(task.due_date).setHours(0, 0, 0, 0) <
    new Date().setHours(0, 0, 0, 0);

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters);

  const [isClientsLoading, setIsClientsLoading] = useState(true);
  const [isTasksLoading, setIsTasksLoading] = useState(false);
  const [clientsError, setClientsError] = useState<string | null>(null);
  const [tasksError, setTasksError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClients() {
      setIsClientsLoading(true);
      setClientsError(null);

      try {
        const fetchedClients = await getClients();
        setClients(fetchedClients);

        if (fetchedClients.length > 0) {
          setSelectedClientId(fetchedClients[0].id);
        }
      } catch (error) {
        setClientsError(
          error instanceof Error ? error.message : "Failed to load clients."
        );
      } finally {
        setIsClientsLoading(false);
      }
    }

    void loadClients();
  }, []);

  useEffect(() => {
    async function loadTasks(clientId: string) {
      setIsTasksLoading(true);
      setTasksError(null);

      try {
        const fetchedTasks = await getTasks(clientId);
        setTasks(fetchedTasks);
      } catch (error) {
        setTasksError(
          error instanceof Error ? error.message : "Failed to load tasks."
        );
      } finally {
        setIsTasksLoading(false);
      }
    }

    if (!selectedClientId) {
      setTasks([]);
      return;
    }

    void loadTasks(selectedClientId);
  }, [selectedClientId]);

  const categories = useMemo(
    () => Array.from(new Set(tasks.map((task) => task.category))).sort(),
    [tasks]
  );

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const matchesStatus =
          filters.status === "all"
            ? true
            : filters.status === "completed"
              ? task.status === "completed"
              : task.status !== "completed";
        const matchesCategory =
          filters.category === "all" ? true : task.category === filters.category;

        return matchesStatus && matchesCategory;
      }),
    [tasks, filters]
  );

  const counts = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((task) => task.status !== "completed").length;
    const overdue = tasks.filter((task) => isOverdueTask(task)).length;
    return { total, pending, overdue };
  }, [tasks]);

  async function handleCreateTask(payload: CreateTaskInput) {
    await createTask(payload);
    const refreshedTasks = await getTasks(payload.client_id);
    setTasks(refreshedTasks);
  }

  async function handleToggleStatus(task: Task) {
    const nextStatus = task.status === "completed" ? "pending" : "completed";

    // Optimistic update keeps the UI responsive while the API call is in-flight.
    setTasks((current) =>
      current.map((existing) =>
        existing.id === task.id ? { ...existing, status: nextStatus } : existing
      )
    );

    try {
      await updateTaskStatus(task.id, nextStatus);
    } catch (error) {
      setTasks((current) =>
        current.map((existing) =>
          existing.id === task.id ? { ...existing, status: task.status } : existing
        )
      );
      setTasksError(
        error instanceof Error ? error.message : "Failed to update task status."
      );
    }
  }

  const selectedClient =
    clients.find((client) => client.id === selectedClientId) ?? null;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-0 p-4 md:grid-cols-[320px_1fr]">
        <ClientList
          clients={clients}
          selectedClientId={selectedClientId}
          onSelectClient={(client) => {
            setSelectedClientId(client.id);
            setFilters(defaultFilters);
          }}
          isLoading={isClientsLoading}
          error={clientsError}
        />

        <section className="space-y-4 p-4 md:p-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Compliance Task Tracker</CardTitle>
              <CardDescription>
              {selectedClient
                ? `Managing tasks for ${selectedClient.company_name} (${selectedClient.country})`
                : "Select a client to start managing tasks."}
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="secondary">Total: {counts.total}</Badge>
                <Badge variant="warning">Pending: {counts.pending}</Badge>
                <Badge variant="destructive">Overdue: {counts.overdue}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-lg">Tasks</CardTitle>

                <div className="flex flex-wrap items-center gap-3">
                  <TaskForm
                    selectedClientId={selectedClientId}
                    onCreate={handleCreateTask}
                  />

                  <Filters
                    filters={filters}
                    categories={categories}
                    onChange={setFilters}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="mt-4">
                <TaskList
                  tasks={filteredTasks}
                  isLoading={isTasksLoading}
                  error={tasksError}
                  onToggleStatus={handleToggleStatus}
                />
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
