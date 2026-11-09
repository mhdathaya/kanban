import type React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Tag } from 'antd'
import type { Task } from '../../types/task'

export interface TaskCardProps {
  task: Task
  isOverlay?: boolean
  onDelete?: (id: string) => void
  onEdit?: (task: Task) => void
  onStatusChange?: (task: Task, status: Task['status']) => void
}

const priorityStyles: Record<Task['priority'], { color: string; label: string; className: string }> = {
  high: { color: 'error', label: 'High', className: 'priority-high' },
  medium: { color: 'warning', label: 'Medium', className: 'priority-medium' },
  low: { color: 'success', label: 'Low', className: 'priority-low' },
}

const statusOptions: Array<{ value: Task['status']; label: string }> = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
]

export const TaskCard: React.FC<TaskCardProps> = ({ task, isOverlay = false, onDelete, onEdit, onStatusChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'Task', task },
    disabled: isOverlay,
  })

  const priority = priorityStyles[task.priority] ?? { color: 'default', label: task.priority, className: '' }
  const dueDate = task.dueDate ? new Date(task.dueDate) : null
  const formattedDueDate = dueDate && !Number.isNaN(dueDate.getTime())
    ? dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Tanpa batas waktu'

  const cardStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    ...(isOverlay ? { boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)', border: '2px solid #4f46e5' } : {}),
  }

  return (
    <article ref={setNodeRef} style={cardStyle} className={`task-card ${priority.className}${isOverlay ? ' task-card-overlay' : ''}`} aria-label={`Tugas: ${task.title}`}>
      <div className="task-card-topline">
        <Tag color={priority.color} className="task-priority-badge">{priority.label}</Tag>
        <button type="button" className="task-drag-handle" aria-label={`Pindahkan tugas ${task.title}`} title="Tarik untuk memindahkan tugas" {...attributes} {...listeners}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <circle cx="7" cy="5" r="1.3" /><circle cx="13" cy="5" r="1.3" />
            <circle cx="7" cy="10" r="1.3" /><circle cx="13" cy="10" r="1.3" />
            <circle cx="7" cy="15" r="1.3" /><circle cx="13" cy="15" r="1.3" />
          </svg>
        </button>
      </div>

      <div className="task-card-copy">
        <h3 className="task-card-title">{task.title}</h3>
        {task.description && <p className="task-card-description">{task.description}</p>}
        <button type="button" className="task-card-edit" onClick={() => onEdit?.(task)} title="Edit tugas" aria-label={`Edit tugas ${task.title}`}>
          Edit
        </button>
      </div>

      <div className="task-meta">
        <span className="task-assignee" title={`Penanggung jawab: ${task.assignee || 'Belum ditentukan'}`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
          <span>{task.assignee || 'Belum ditentukan'}</span>
        </span>
        <span className="task-date" title={`Batas waktu: ${formattedDueDate}`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
          <span>{formattedDueDate}</span>
        </span>
      </div>

      <div className="task-card-footer" onPointerDown={(event) => event.stopPropagation()}>
        <label className="task-status-control">
          <span>Status</span>
          <select value={task.status} aria-label={`Status tugas ${task.title}`} onChange={(event) => onStatusChange?.(task, event.target.value as Task['status'])}>
            {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        {onDelete && <button type="button" className="task-action-btn" onClick={() => onDelete(task.id)} aria-label={`Hapus tugas ${task.title}`} title="Hapus tugas">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
        </button>}
      </div>
    </article>
  )
}

export default TaskCard
