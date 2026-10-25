import { useEffect, useState } from 'react'
import TaskDetail from './TaskDetail'
import TaskForm from './TaskForm'
import { deleteTask, getTasks } from '../services/api'

const statusLabels = {
  Pending: 'Pendiente',
  InProgress: 'En progreso',
  Completed: 'Completada',
}

const emptyFilters = {
  projectId: '',
  assigneeId: '',
  status: '',
}

function TaskResults({
  filters,
  onViewDetail,
  onEdit,
  onDelete,
  deletingId,
}) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { projectId, assigneeId, status } = filters
  const hasFilters = Boolean(projectId || assigneeId || status)
  const deleting = deletingId !== null

  useEffect(() => {
    const controller = new AbortController()

    async function loadTasks() {
      try {
        const data = await getTasks(
          { projectId, assigneeId, status },
          controller.signal
        )

        if (!controller.signal.aborted) {
          setTasks(data)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          const validationMessages = Object.values(
            err.validationErrors || {}
          ).flat()

          setError(
            validationMessages.length > 0
              ? validationMessages.join(' ')
              : `No se pudieron cargar las tareas. Comprueba que la API esté funcionando. ${err.message}`
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadTasks()

    return () => controller.abort()
  }, [projectId, assigneeId, status])

  if (loading) {
    return <p role="status">Cargando tareas…</p>
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  if (tasks.length === 0) {
    return (
      <p role="status">
        {hasFilters
          ? 'No hay tareas que coincidan con los filtros.'
          : 'No hay tareas registradas.'}
      </p>
    )
  }

  return (
    <>
      <p role="status">
        Tareas encontradas: {tasks.length}
      </p>

      <table>
        <caption>
          {hasFilters ? 'Tareas filtradas' : 'Tareas registradas'}
        </caption>

        <thead>
          <tr>
            <th scope="col">Título</th>
            <th scope="col">Descripción</th>
            <th scope="col">Estado</th>
            <th scope="col">Vencimiento</th>
            <th scope="col">Proyecto</th>
            <th scope="col">Responsable</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description || 'Sin descripción'}</td>
              <td>{statusLabels[task.status] || task.status}</td>
              <td>{task.dueDate}</td>
              <td>{task.projectName}</td>
              <td>{task.assigneeName}</td>
              <td>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => onViewDetail(task.id)}
                >
                  Ver detalle
                </button>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => onEdit(task)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => onDelete(task)}
                >
                  {deletingId === task.id
                    ? 'Eliminando…'
                    : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

function TaskList({ projects = [], assignees = [] }) {
  const [filters, setFilters] = useState({ ...emptyFilters })
  const [appliedFilters, setAppliedFilters] = useState({
    ...emptyFilters,
  })
  const [requestId, setRequestId] = useState(0)
  const [selectedTaskId, setSelectedTaskId] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [success, setSuccess] = useState('')
  const [actionError, setActionError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const deleting = deletingId !== null

  function handleChange(event) {
    const { name, value } = event.target

    setFilters((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    setSelectedTaskId(null)
    setAppliedFilters({ ...filters })
    setRequestId((current) => current + 1)
  }

  function handleClear() {
    setSelectedTaskId(null)
    setFilters({ ...emptyFilters })
    setAppliedFilters({ ...emptyFilters })
    setRequestId((current) => current + 1)
  }

  function handleTaskCreated() {
    setSuccess('')
    setActionError('')
    setSelectedTaskId(null)
    setFilters({ ...emptyFilters })
    setAppliedFilters({ ...emptyFilters })
    setRequestId((current) => current + 1)
  }

  function handleTaskUpdated() {
    setEditingTask(null)
    setSelectedTaskId(null)
    setActionError('')
    setSuccess('Tarea actualizada correctamente.')
    setRequestId((current) => current + 1)
  }

  function handleTaskEdit(task) {
    setEditingTask(task)
    setSelectedTaskId(null)
    setSuccess('')
    setActionError('')
  }

  function handleTaskCancelEdit() {
    setEditingTask(null)
    setSuccess('')
    setActionError('')
  }

  function handleViewDetail(taskId) {
    setSelectedTaskId(taskId)
  }

  async function handleTaskDelete(task) {
    if (deletingId !== null) {
      return
    }

    const confirmed = window.confirm(
      `¿Eliminar la tarea "${task.title}" (ID ${task.id})? Esta acción no se puede deshacer.`
    )

    if (!confirmed) {
      return
    }

    setDeletingId(task.id)
    setActionError('')
    setSuccess('')

    try {
      await deleteTask(task.id)

      setSelectedTaskId((current) =>
        current === task.id ? null : current
      )

      setEditingTask((current) =>
        current?.id === task.id ? null : current
      )

      setSuccess('Tarea eliminada correctamente.')
      setRequestId((current) => current + 1)
    } catch (err) {
      setActionError(`No se pudo eliminar. ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section aria-labelledby="tasks-title">
      <h2 id="tasks-title">Tareas</h2>

      {success && <p role="status">{success}</p>}
      {actionError && <p role="alert">{actionError}</p>}

      {selectedTaskId !== null && (
        <TaskDetail
          key={selectedTaskId}
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}

      <fieldset disabled={deleting}>
        <legend>Formulario de tarea</legend>

        <TaskForm
          key={editingTask?.id ?? 'create-task'}
          task={editingTask}
          projects={projects}
          assignees={assignees}
          onCreated={handleTaskCreated}
          onUpdated={handleTaskUpdated}
          onCancel={handleTaskCancelEdit}
        />
      </fieldset>

      <form onSubmit={handleSubmit}>
        <fieldset disabled={deleting}>
          <legend>Filtrar tareas</legend>

          <p>
            <label htmlFor="task-filter-project">
              Proyecto
            </label>
            <select
              id="task-filter-project"
              name="projectId"
              value={filters.projectId}
              onChange={handleChange}
            >
              <option value="">Todos los proyectos</option>

              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </p>

          <p>
            <label htmlFor="task-filter-assignee">
              Responsable
            </label>
            <select
              id="task-filter-assignee"
              name="assigneeId"
              value={filters.assigneeId}
              onChange={handleChange}
            >
              <option value="">Todos los responsables</option>

              {assignees.map((assignee) => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </option>
              ))}
            </select>
          </p>

          <p>
            <label htmlFor="task-filter-status">
              Estado
            </label>
            <select
              id="task-filter-status"
              name="status"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="">Todos los estados</option>
              <option value="Pending">Pendiente</option>
              <option value="InProgress">En progreso</option>
              <option value="Completed">Completada</option>
            </select>
          </p>

          <button type="submit">
            Aplicar filtros
          </button>

          <button type="button" onClick={handleClear}>
            Limpiar filtros
          </button>
        </fieldset>
      </form>

      <TaskResults
        key={requestId}
        filters={appliedFilters}
        onViewDetail={handleViewDetail}
        onEdit={handleTaskEdit}
        onDelete={handleTaskDelete}
        deletingId={deletingId}
      />
    </section>
  )
}

export default TaskList