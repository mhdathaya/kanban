import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Task, TaskFormValues, KanbanColumns, FilterState } from '../types/task';
import type { User } from '../types/user';

export const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Riset Desain UI/UX Kanban',
    description: 'Analisis kebutuhan pengguna dan rancang layout wireframe dashboard kanban board.',
    priority: 'high',
    status: 'done',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    assignee: 'Emily Johnson',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Integrasi DummyJSON Authentication',
    description: 'Implementasi login, refresh token, Bearer auth, dan proteksi route dashboard.',
    priority: 'high',
    status: 'in_progress',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
    assignee: 'Emily Johnson',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Fitur Filter & Search Tasks',
    description: 'Memungkinkan filter berdasarkan status, priority (low/medium/high), dan kata kunci.',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date(Date.now() + 4 * 86400000).toISOString(),
    assignee: 'Michael Chen',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Drag and Drop Antar Kolom',
    description: 'Implementasi fitur drag and drop task card antar kolom status dengan @dnd-kit.',
    priority: 'low',
    status: 'backlog',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    assignee: 'Sarah Connor',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface KanbanState {
  tasks: Task[];
  columns: KanbanColumns;
  filter: FilterState;
  user: User | null;

            
  setTasks: (tasks: Task[]) => void;
  addTask: (task: TaskFormValues) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, targetStatus: Task['status'], targetIndex?: number) => void;
  reorderTasks: (tasks: Task[]) => void;
  setColumn: (column: keyof KanbanColumns, tasks: Task[]) => void;
  setFilter: (filter: Partial<FilterState>) => void;
  resetFilter: () => void;
  setUser: (user: User | null) => void;
  saveToLocalStorage: (tasks: Task[]) => void;
  initializeFromLocalStorage: () => void;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      tasks: initialTasks,
      columns: {
        backlog: [],
        todo: [],
        in_progress: [],
        done: [],
      },
      filter: {
        search: '',
        priority: 'all',
        status: 'all',
        assignee: '',
      },
      user: null,

      setTasks: (tasks: Task[]) => set({ tasks }),

      addTask: (task: TaskFormValues) => {
        const newTask: Task = {
          id: `task-${Date.now()}`,
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate || new Date().toISOString(),
          assignee: task.assignee,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const updatedTasks = [newTask, ...get().tasks];
        set({ tasks: updatedTasks });
        get().saveToLocalStorage(updatedTasks);
      },

      updateTask: (updatedTask: Task) => {
        const taskIndex = get().tasks.findIndex((t: Task) => t.id === updatedTask.id);
        if (taskIndex !== -1) {
          const updatedTasks = [...get().tasks];
          updatedTasks[taskIndex] = {
            ...updatedTasks[taskIndex],
            ...updatedTask,
            updatedAt: new Date().toISOString(),
          };
          set({ tasks: updatedTasks });
          get().saveToLocalStorage(updatedTasks);
        }
      },

      deleteTask: (id: string) => {
        const updatedTasks = get().tasks.filter((t: Task) => t.id !== id);
        set({ tasks: updatedTasks });
        get().saveToLocalStorage(updatedTasks);
      },

      moveTask: (taskId: string, targetStatus: Task['status'], targetIndex?: number) => {
        const currentTasks = [...get().tasks];
        const taskIndex = currentTasks.findIndex((t: Task) => t.id === taskId);
        if (taskIndex === -1) return;

        const [movedTask] = currentTasks.splice(taskIndex, 1);
        const updatedTask: Task = {
          ...movedTask,
          status: targetStatus,
          updatedAt: new Date().toISOString(),
        };

        if (typeof targetIndex === 'number' && targetIndex >= 0) {
          currentTasks.splice(targetIndex, 0, updatedTask);
        } else {
          currentTasks.push(updatedTask);
        }

        set({ tasks: currentTasks });
        get().saveToLocalStorage(currentTasks);
      },

      reorderTasks: (tasks: Task[]) => {
        set({ tasks });
        get().saveToLocalStorage(tasks);
      },

      setColumn: (column: keyof KanbanColumns, tasks: Task[]) =>
        set({ columns: { ...get().columns, [column]: tasks } }),

      setFilter: (filter: Partial<FilterState>) =>
        set({ filter: { ...get().filter, ...filter } }),

      resetFilter: () =>
        set({
          filter: {
            search: '',
            priority: 'all',
            status: 'all',
            assignee: '',
          },
        }),

      setUser: (user: User | null) => set({ user }),

      saveToLocalStorage: (tasks: Task[]) => {
        const serialized = JSON.stringify(tasks);
        localStorage.setItem('kanban_tasks', serialized);
      },

      initializeFromLocalStorage: () => {
        const stored = localStorage.getItem('kanban_tasks');
        if (stored) {
          try {
            const parsed: Task[] = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              set({ tasks: parsed });
              return;
            }
          } catch {
            localStorage.removeItem('kanban_tasks');
          }
        }
                                                     
        set({ tasks: initialTasks });
        get().saveToLocalStorage(initialTasks);
      },
    }),
    {
      name: 'kanban-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useKanban = useKanbanStore;
export default useKanbanStore;
