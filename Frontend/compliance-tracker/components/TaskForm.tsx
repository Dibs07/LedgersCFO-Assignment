"use client";

import { FormEvent, useState } from "react";
import { CreateTaskInput, TaskPriority } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type TaskFormProps = {
  selectedClientId: string | null;
  onCreate: (payload: CreateTaskInput) => Promise<void>;
};

type FormState = {
  title: string;
  description: string;
  category: string;
  due_date: string;
  priority: TaskPriority;
};

const initialState: FormState = {
  title: "",
  description: "",
  category: "",
  due_date: "",
  priority: "medium",
};

export function TaskForm({ selectedClientId, onCreate }: TaskFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedClientId) {
      setError("Please select a client before adding a task.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await onCreate({
        client_id: selectedClientId,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        due_date: form.due_date,
        priority: form.priority,
      });
      setForm(initialState);
      setOpen(false);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Failed to create task."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={!selectedClientId}>Add Task</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Compliance Task</DialogTitle>
          <DialogDescription>
            Add a new task for the selected client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <Input
            required
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Title"
          />

          <Textarea
            required
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            placeholder="Description"
            rows={3}
          />

          <Input
            required
            value={form.category}
            onChange={(event) => setForm({ ...form, category: event.target.value })}
            placeholder="Category"
          />

          <Input
            required
            type="date"
            value={form.due_date}
            onChange={(event) => setForm({ ...form, due_date: event.target.value })}
          />

          <Select
            value={form.priority}
            onValueChange={(value) =>
              setForm({ ...form, priority: value as TaskPriority })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedClientId}
              className="w-full"
            >
              {isSubmitting ? "Saving..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
