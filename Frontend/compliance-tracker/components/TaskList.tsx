"use client";

import { Task } from "@/lib/types";
import { TaskItem } from "@/components/TaskItem";
import { Card, CardContent } from "@/components/ui/card";

type TaskListProps = {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  onToggleStatus: (task: Task) => void;
};

const isOverdueTask = (task: Task): boolean =>
  task.status !== "completed" &&
  new Date(task.due_date).setHours(0, 0, 0, 0) <
    new Date().setHours(0, 0, 0, 0);

export function TaskList({ tasks, isLoading, error, onToggleStatus }: TaskListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-4 text-sm text-zinc-600">Loading tasks...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-4 text-sm text-red-700">{error}</CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="pt-4 text-sm text-zinc-600">
          No tasks found for current filters.
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          isOverdue={isOverdueTask(task)}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </ul>
  );
}
