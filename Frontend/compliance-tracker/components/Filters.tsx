"use client";

import { TaskFilters } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FiltersProps = {
  filters: TaskFilters;
  categories: string[];
  onChange: (next: TaskFilters) => void;
};

export function Filters({ filters, categories, onChange }: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="min-w-40">
        <p className="mb-1 text-xs text-zinc-600">Status</p>
        <Select
          value={filters.status}
          onValueChange={(value) =>
            onChange({ ...filters, status: value as TaskFilters["status"] })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-40">
        <p className="mb-1 text-xs text-zinc-600">Category</p>
        <Select
          value={filters.category}
          onValueChange={(value) => onChange({ ...filters, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
