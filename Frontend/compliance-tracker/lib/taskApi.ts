import { CreateTaskInput, Task, TaskStatus } from "@/lib/types";
import { isRecord, requestWithFallback } from "@/lib/api";

function normalizeTasks(payload: unknown): Task[] {
  if (Array.isArray(payload)) {
    return payload as Task[];
  }

  if (isRecord(payload) && Array.isArray(payload.tasks)) {
    return payload.tasks as Task[];
  }

  return [];
}

function normalizeTask(payload: unknown): Task {
  if (isRecord(payload) && isRecord(payload.task)) {
    return payload.task as Task;
  }

  return payload as Task;
}

export async function getTasks(clientId: string): Promise<Task[]> {
  const payload = await requestWithFallback([
    `/tasks?client_id=${clientId}`,
    `/api/task/client/${clientId}`,
  ]);
  return normalizeTasks(payload);
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const payload = await requestWithFallback(
    ["/tasks", "/api/task/create"],
    {
      method: "POST",
      body: JSON.stringify({
        ...input,
        status: "pending",
      }),
    }
  );

  return normalizeTask(payload);
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<void> {
  await requestWithFallback([
    `/tasks/${taskId}`,
    `/api/task/update/${taskId}`,
  ], {
    method: "PATCH",
    body: JSON.stringify({ status }),
  }).catch(async () => {
    await requestWithFallback([`/api/task/update/${taskId}`], {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  });
}
