export type Client = {
  id: string;
  company_name: string;
  country: string;
  entity_type: "individual" | "company" | "organization";
};

export type TaskStatus = "pending" | "in_progress" | "completed";

export type TaskPriority = "low" | "medium" | "high";

export type Task = {
  id: string;
  client_id: string;
  title: string;
  description: string;
  category: string;
  due_date: string;
  status: TaskStatus;
  priority: TaskPriority;
};

export type TaskFilters = {
  status: "all" | "pending" | "completed";
  category: "all" | string;
};

export type CreateTaskInput = {
  client_id: string;
  title: string;
  description: string;
  category: string;
  due_date: string;
  priority: TaskPriority;
};
