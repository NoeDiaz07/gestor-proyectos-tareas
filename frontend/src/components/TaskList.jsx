import { useEffect, useState } from 'react'
import TaskForm from './TaskForm'
import { getTasks } from '../services/api'

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

function TaskResults({ filters }) {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { projectId, assigneeId, status } = filters
  const hasFilters = Boolean(projectId || assigneeId || status)

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

  function handleChange(event) {
    const { name, value } = event.target

    setFilters((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    setAppliedFilters({ ...filters })
    setRequestId((current) => current + 1)
  }

  function handleClear() {
    setFilters({ ...emptyFilters })
    setAppliedFilters({ ...emptyFilters })
    setRequestId((current) => current + 1)
  }

  function handleTaskCreated() {
    setFilters({ ...emptyFilters })
    setAppliedFilters({ ...emptyFilters })
    setRequestId((current) => current + 1)
  }

  return (
    <section aria-labelledby="tasks-title">
      <h2 id="tasks-title">Tareas</h2>

      <TaskForm
        projects={projects}
        assignees={assignees}
        onCreated={handleTaskCreated}
      />

      <form onSubmit={handleSubmit}>
        <fieldset>
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
      />
    </section>
  )
}

export default TaskList