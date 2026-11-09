import type React from 'react'
import { useDroppable } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import type { Task } from '../../types/task'
import { TaskCard } from './TaskCard'

export interface KanbanColumnProps {
  id: Task['status']
  title: string
  color: string
  tasks: Task[]
  onAddTask: (status: Task['status']) => void
  onDeleteTask: (id: string) => void
  onEdit: (task: Task) => void
  onStatusChange: (task: Task, status: Task['status']) => void
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  color,
  tasks,
  onAddTask,
  onDeleteTask,
  onEdit,
  onStatusChange,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      columnId: id,
    },
  })

  const taskIds = tasks.map((t) => t.id)

  return (
    <div
      ref={setNodeRef}
      className="kanban-column"
      style={{
        backgroundColor: isOver ? '#eef2ff' : '#f8fafc',
        borderColor: isOver ? '#818cf8' : '#e2e8f0',
        boxShadow: isOver ? '0 0 0 3px rgba(99, 102, 241, 0.12)' : undefined,
        transition: 'background-color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
      }}
    >
      <div className="column-title">
        <div className="column-title-left">
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 0 3px ${color}20`,
            }}
          />
          <span>{title}</span>
        </div>
        <span className="task-count">{tasks.length}</span>
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div className="column-tasks task-list-scroll" style={{ flex: 1, minHeight: 110, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tasks.length === 0 ? (
            <div
              className="empty-state"
              style={{
                border: isOver ? '2px dashed #818cf8' : '1px dashed #cbd5e1',
                backgroundColor: isOver ? '#eef2ff' : 'rgba(255, 255, 255, 0.72)',
                transition: 'all 0.22s ease',
                borderRadius: 10,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: isOver ? '#6366f1' : '#94a3b8' }}>
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span style={{ display: 'block', fontWeight: 500, color: '#64748b' }}>
                Belum ada tugas
              </span>
              <span style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                Tarik tugas ke sini atau tambahkan tugas baru
              </span>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onEdit={onEdit}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </div>
      </SortableContext>

      <button
        type="button"
        className="btn-column-add"
        onClick={() => onAddTask(id)}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Tambah ke {title}
      </button>
    </div>
  )
}

export default KanbanColumn
