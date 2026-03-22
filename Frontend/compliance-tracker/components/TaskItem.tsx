"use client";

import { Task } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TaskItemProps = {
  task: Task;
  isOverdue: boolean;
  onToggleStatus: (task: Task) => void;
};

const priorityStyles: Record<Task["priority"], string> = {
  low: "bg-zinc-100 text-zinc-700",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-rose-100 text-rose-800",
};

export function TaskItem({ task, isOverdue, onToggleStatus }: TaskItemProps) {
  const isCompleted = task.status === "completed";

  return (
    <li>
      <Card className={isOverdue ? "border-red-300 bg-red-50" : ""}>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">{task.title}</CardTitle>
              <p className="mt-1 text-sm text-zinc-600">{task.description}</p>
            </div>

            <Button type="button" variant="outline" onClick={() => onToggleStatus(task)}>
              {isCompleted ? "Mark as Pending" : "Mark as Completed"}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="secondary">{task.category}</Badge>
            <Badge variant={isCompleted ? "success" : "secondary"}>
              {isCompleted ? "Completed" : "Pending"}
            </Badge>
            <Badge className={priorityStyles[task.priority]}>
              {task.priority[0].toUpperCase() + task.priority.slice(1)} Priority
            </Badge>
            <Badge variant="outline">
              Due {new Date(task.due_date).toLocaleDateString()}
            </Badge>
            {isOverdue && <Badge variant="destructive">Overdue</Badge>}
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
