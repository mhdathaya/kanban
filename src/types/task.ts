export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'backlog' | 'todo' | 'in_progress' | 'done';
  dueDate: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormValues {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'backlog' | 'todo' | 'in_progress' | 'done';
  dueDate: string;
  assignee?: string;
}

export interface KanbanColumns {
  backlog: Task[];
  todo: Task[];
  in_progress: Task[];
  done: Task[];
}

export interface FilterState {
  search: string;
  priority: 'low' | 'medium' | 'high' | 'all';
  status: 'backlog' | 'todo' | 'in_progress' | 'done' | 'all';
  assignee: string;
}
