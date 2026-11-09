import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { message } from 'antd'
import { useAuth } from '../store/useAuthStore'
import { useKanban } from '../store/useKanbanStore'
import KanbanColumn from '../components/kanban/KanbanColumn'
import TaskCard from '../components/kanban/TaskCard'
import type { Task } from '../types/task'
import WorkspaceLayout from '../components/layout/WorkspaceLayout'

const statuses: Task['status'][] = ['backlog', 'todo', 'in_progress', 'done']

const MyTasks = () => {
  const { user } = useAuth()
  const { tasks, moveTask, reorderTasks, updateTask, deleteTask } = useKanban()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTaskId = searchParams.get('task')
  const activeTask = tasks.find((task) => task.id === activeTaskId) ?? null

  const myTasks = useMemo(() => {
    if (!user) return tasks
    const owner = (user.name || user.username || '').trim().toLowerCase()
    return tasks.filter((task) => !task.assignee || task.assignee.trim().toLowerCase() === owner)
  }, [tasks, user])

  const columns = useMemo(() => Object.fromEntries(
    statuses.map((status) => [status, myTasks.filter((task) => task.status === status)])
  ) as Record<Task['status'], Task[]>, [myTasks])

  const handleDragStart = (event: DragStartEvent) => {
    setSearchParams({ task: String(event.active.id) }, { replace: true })
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (!event.over) return
    const dragged = tasks.find((task) => task.id === String(event.active.id))
    const overId = String(event.over.id)
    if (!dragged) return
    if (statuses.includes(overId as Task['status'])) {
      if (dragged.status !== overId) moveTask(dragged.id, overId as Task['status'])
      return
    }
    const target = tasks.find((task) => task.id === overId)
    if (target && target.status !== dragged.status) {
      moveTask(dragged.id, target.status, tasks.findIndex((task) => task.id === target.id))
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setSearchParams({}, { replace: true })
    if (!event.over) return
    const activeId = String(event.active.id)
    const overId = String(event.over.id)
    if (statuses.includes(overId as Task['status'])) {
      moveTask(activeId, overId as Task['status'])
      return
    }
    const oldIndex = tasks.findIndex((task) => task.id === activeId)
    const newIndex = tasks.findIndex((task) => task.id === overId)
    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      const targetStatus = tasks[newIndex].status
      const reordered = arrayMove(tasks, oldIndex, newIndex)
      reorderTasks(reordered.map((task) => task.id === activeId ? { ...task, status: targetStatus } : task))
    }
  }

  const handleDelete = (id: string) => {
    deleteTask(id)
    message.success('Tugas berhasil dihapus')
  }

  return (
    <WorkspaceLayout>
      <main className="main-content utility-page">
        <header className="utility-page-heading">
          <div><p className="utility-eyebrow">Ruang kerja</p><h1>Tugas Saya</h1><p>Kelola tugas yang ditugaskan kepada Anda.</p></div>
          <span className="utility-page-count">{myTasks.length} tugas</span>
        </header>
        <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <section className="kanban-board utility-kanban-board" aria-label="Daftar tugas saya">
            <div className="kanban-grid utility-kanban-grid">
              {statuses.map((status) => <KanbanColumn
                key={status}
                id={status}
                title={{ backlog: 'Backlog', todo: 'To Do', in_progress: 'In Progress', done: 'Done' }[status]}
                color={{ backlog: '#64748b', todo: '#0284c7', in_progress: '#d97706', done: '#16a34a' }[status]}
                tasks={columns[status]}
                onAddTask={() => message.info('Tambahkan tugas melalui Dashboard')}
                onDeleteTask={handleDelete}
                onEdit={(task) => message.info(`Edit tugas “${task.title}” melalui Dashboard`)}
                onStatusChange={(task, newStatus) => updateTask({ ...task, status: newStatus })}
              />)}
            </div>
          </section>
          <DragOverlay>{activeTask ? <div style={{ width: 280, pointerEvents: 'none' }}><TaskCard task={activeTask} isOverlay /></div> : null}</DragOverlay>
        </DndContext>
      </main>
    </WorkspaceLayout>
  )
}

export default MyTasks
