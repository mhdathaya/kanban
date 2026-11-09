import { useEffect, useMemo, useState } from 'react'
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Tag, Modal, Input, Select, message } from 'antd'
import { useAuth } from '../store/useAuthStore'
import { useKanban } from '../store/useKanbanStore'
import WorkspaceLayout from '../components/layout/WorkspaceLayout'
import KanbanColumn from '../components/kanban/KanbanColumn'
import TaskCard from '../components/kanban/TaskCard'
import type { Task, TaskFormValues } from '../types/task'

const { TextArea } = Input

const blankForm = (assignee?: string, status: Task['status'] = 'todo'): TaskFormValues => ({
  title: '', description: '', priority: 'medium', status,
  dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
  assignee: assignee || 'Emily Johnson',
})

const StatIcon = ({ kind }: { kind: string }) => {
  const paths: Record<string, React.ReactNode> = {
    total: <><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M8 2v4m8-4v4M3 10h18" /></>,
    backlog: <><circle cx="12" cy="12" r="9" /><path d="M8 12h8" /></>,
    todo: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>,
    active: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    done: <><path d="M20 6 9 17l-5-5" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></>,
  }
  return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>
}

export const Dashboard = () => {
  const { user } = useAuth()
  const { tasks, filter, addTask, deleteTask, updateTask, moveTask, reorderTasks, setFilter, resetFilter, initializeFromLocalStorage } = useKanban()
  const [isInitializing, setIsInitializing] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Task | null>(null)
  const [titleError, setTitleError] = useState(false)
  const [newTaskForm, setNewTaskForm] = useState<TaskFormValues>(() => blankForm())
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  useEffect(() => {
    try { initializeFromLocalStorage() } finally { setIsInitializing(false) }
  }, [initializeFromLocalStorage])

  useEffect(() => {
    setNewTaskForm((form) => ({ ...form, assignee: user?.name || user?.username || form.assignee }))
  }, [user])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const filteredTasks = useMemo(() => tasks.filter((task) => {
    const query = filter.search.toLowerCase()
    const matchesSearch = !query || task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query) || (task.assignee && task.assignee.toLowerCase().includes(query))
    return matchesSearch && (filter.priority === 'all' || task.priority === filter.priority)
  }), [tasks, filter])

  const columnData = useMemo(() => ({
    backlog: filteredTasks.filter((task) => task.status === 'backlog'),
    todo: filteredTasks.filter((task) => task.status === 'todo'),
    in_progress: filteredTasks.filter((task) => task.status === 'in_progress'),
    done: filteredTasks.filter((task) => task.status === 'done'),
  }), [filteredTasks])

  const counts = {
    total: tasks.length,
    backlog: tasks.filter((task) => task.status === 'backlog').length,
    todo: tasks.filter((task) => task.status === 'todo').length,
    active: tasks.filter((task) => task.status === 'in_progress').length,
    done: tasks.filter((task) => task.status === 'done').length,
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((item) => item.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return
    const activeId = String(active.id)
    const overId = String(over.id)
    if (activeId === overId) return
    const current = tasks.find((task) => task.id === activeId)
    if (!current) return
    if (['backlog', 'todo', 'in_progress', 'done'].includes(overId)) {
      if (current.status !== overId) moveTask(activeId, overId as Task['status'])
      return
    }
    const target = tasks.find((task) => task.id === overId)
    if (target && current.status !== target.status) moveTask(activeId, target.status, tasks.findIndex((task) => task.id === overId))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return
    const activeId = String(active.id)
    const overId = String(over.id)
    if (['backlog', 'todo', 'in_progress', 'done'].includes(overId)) {
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

  const openAddModal = (status: Task['status'] = 'todo') => {
    setEditingTask(null)
    setNewTaskForm(blankForm(user?.name || user?.username, status))
    setTitleError(false)
    setIsModalOpen(true)
  }

  const editTask = (task: Task) => {
    setEditingTask(task)
    setNewTaskForm({ title: task.title, description: task.description, priority: task.priority, status: task.status, dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '', assignee: task.assignee })
    setTitleError(false)
    setIsModalOpen(true)
  }

  const saveTask = () => {
    const title = newTaskForm.title.trim()
    if (!title) { setTitleError(true); return }
    if (editingTask) {
      updateTask({ ...editingTask, ...newTaskForm, title, dueDate: newTaskForm.dueDate })
      message.success('Tugas berhasil diperbarui')
    } else {
      addTask({ ...newTaskForm, title })
      message.success('Tugas berhasil ditambahkan')
    }
    setIsModalOpen(false)
    setEditingTask(null)
    setNewTaskForm(blankForm(user?.name || user?.username))
    setTitleError(false)
  }

  const confirmDelete = () => {
    if (!pendingDelete) return
    deleteTask(pendingDelete.id)
    message.success('Tugas berhasil dihapus')
    setPendingDelete(null)
  }

  const statItems = [
    { title: 'Total Tasks', count: counts.total, caption: `${counts.total} Items`, color: 'blue', icon: 'total', tone: '#4f46e5' },
    { title: 'Backlog', count: counts.backlog, caption: `${counts.backlog} Pending`, color: 'default', icon: 'backlog', tone: '#64748b' },
    { title: 'To Do', count: counts.todo, caption: `${counts.todo} To Do`, color: 'cyan', icon: 'todo', tone: '#0891b2' },
    { title: 'In Progress', count: counts.active, caption: `${counts.active} Active`, color: 'orange', icon: 'active', tone: '#ea580c' },
    { title: 'Completed', count: counts.done, caption: `${counts.done} Done`, color: 'green', icon: 'done', tone: '#16a34a' },
  ]

  if (isInitializing) return <div className="dashboard-loading"><span className="dashboard-spinner" /><span>Memuat data...</span></div>

  return (
    <WorkspaceLayout>
      <main className="main-content">
        <section className="stats-container">
          {statItems.map((item) => <div className="stat-card" key={item.title}>
            <div className="stat-summary"><span className="stat-icon" style={{ color: item.tone, background: `${item.tone}12` }}><StatIcon kind={item.icon} /></span><div><div className="stat-title">{item.title}</div><div className="stat-value">{item.count}</div></div></div>
            <Tag color={item.color}>{item.caption}</Tag>
          </div>)}
        </section>

        {tasks.length > 0 && <div className="action-bar">
          <div className="filter-group">
            <Input placeholder="Cari judul, deskripsi, atau assignee..." value={filter.search} onChange={(event) => setFilter({ search: event.target.value })} style={{ width: 280 }} allowClear />
            <Select value={filter.priority} onChange={(value) => setFilter({ priority: value })} style={{ width: 160 }} options={[{ label: 'Semua Prioritas', value: 'all' }, { label: 'High Priority', value: 'high' }, { label: 'Medium Priority', value: 'medium' }, { label: 'Low Priority', value: 'low' }]} />
            {(filter.search || filter.priority !== 'all') && <button type="button" className="filter-reset" onClick={resetFilter}>Reset filter</button>}
          </div>
          <button type="button" className="btn-add-task" onClick={() => openAddModal('todo')}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>Tambah Tugas</button>
        </div>}

        {tasks.length === 0 ? <section className="dashboard-empty-state"><div><div className="dashboard-empty-icon"><StatIcon kind="total" /></div><h1>Belum ada tugas</h1><p>Mulai dengan menambahkan tugas pertama Anda</p><button type="button" className="btn-add-task" onClick={() => openAddModal('todo')}>Tambah Tugas Pertama</button></div></section> : <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <section className="kanban-board"><div className="kanban-grid">
            <KanbanColumn id="backlog" title="Backlog" color="#64748b" tasks={columnData.backlog} onAddTask={openAddModal} onDeleteTask={(id) => setPendingDelete(tasks.find((task) => task.id === id) || null)} onEdit={editTask} onStatusChange={(task, status) => updateTask({ ...task, status })} />
            <KanbanColumn id="todo" title="To Do" color="#0284c7" tasks={columnData.todo} onAddTask={openAddModal} onDeleteTask={(id) => setPendingDelete(tasks.find((task) => task.id === id) || null)} onEdit={editTask} onStatusChange={(task, status) => updateTask({ ...task, status })} />
            <KanbanColumn id="in_progress" title="In Progress" color="#d97706" tasks={columnData.in_progress} onAddTask={openAddModal} onDeleteTask={(id) => setPendingDelete(tasks.find((task) => task.id === id) || null)} onEdit={editTask} onStatusChange={(task, status) => updateTask({ ...task, status })} />
            <KanbanColumn id="done" title="Done" color="#16a34a" tasks={columnData.done} onAddTask={openAddModal} onDeleteTask={(id) => setPendingDelete(tasks.find((task) => task.id === id) || null)} onEdit={editTask} onStatusChange={(task, status) => updateTask({ ...task, status })} />
          </div></section>
          <DragOverlay>{activeTask ? <div style={{ width: 280, pointerEvents: 'none' }}><TaskCard task={activeTask} isOverlay /></div> : null}</DragOverlay>
        </DndContext>}
      </main>
      <Modal title={editingTask ? 'Edit Tugas' : 'Buat Tugas Baru'} open={isModalOpen} onOk={saveTask} onCancel={() => { setIsModalOpen(false); setEditingTask(null); setTitleError(false) }} okText={editingTask ? 'Simpan Perubahan' : 'Simpan'} cancelText="Batal">
        <div className="task-form-fields">
          <div><label htmlFor="task-title">Judul Tugas *</label><Input id="task-title" placeholder="Contoh: Implementasi Form Validasi" value={newTaskForm.title} onChange={(event) => { setNewTaskForm({ ...newTaskForm, title: event.target.value }); if (event.target.value.trim()) setTitleError(false) }} aria-invalid={titleError} aria-describedby={titleError ? 'task-title-error' : undefined} />{titleError && <span id="task-title-error" role="alert">Judul tugas wajib diisi</span>}</div>
          <div><label htmlFor="task-description">Deskripsi</label><TextArea id="task-description" rows={3} placeholder="Jelaskan detail tugas yang harus dikerjakan..." value={newTaskForm.description} onChange={(event) => setNewTaskForm({ ...newTaskForm, description: event.target.value })} /></div>
          <div className="task-form-grid">
            <label>Kolom Status<Select value={newTaskForm.status} onChange={(status) => setNewTaskForm({ ...newTaskForm, status })} options={[{ label: 'Backlog', value: 'backlog' }, { label: 'To Do', value: 'todo' }, { label: 'In Progress', value: 'in_progress' }, { label: 'Done', value: 'done' }]} /></label>
            <label>Prioritas<Select value={newTaskForm.priority} onChange={(priority) => setNewTaskForm({ ...newTaskForm, priority })} options={[{ label: 'High Priority', value: 'high' }, { label: 'Medium Priority', value: 'medium' }, { label: 'Low Priority', value: 'low' }]} /></label>
            <label>Batas Waktu<Input type="date" value={newTaskForm.dueDate} onChange={(event) => setNewTaskForm({ ...newTaskForm, dueDate: event.target.value })} /></label>
            <label>Assignee<Input placeholder="Nama penanggung jawab" value={newTaskForm.assignee} onChange={(event) => setNewTaskForm({ ...newTaskForm, assignee: event.target.value })} /></label>
          </div>
        </div>
      </Modal>
      <Modal title="Hapus Tugas" open={Boolean(pendingDelete)} onOk={confirmDelete} onCancel={() => setPendingDelete(null)} okText="Ya, Hapus" cancelText="Batal"><p style={{ margin: 0, color: '#475569', lineHeight: 1.65 }}>Apakah Anda yakin ingin menghapus tugas '{pendingDelete?.title}'? Tindakan ini tidak dapat dibatalkan.</p></Modal>
    </WorkspaceLayout>
  )
}

export default Dashboard
