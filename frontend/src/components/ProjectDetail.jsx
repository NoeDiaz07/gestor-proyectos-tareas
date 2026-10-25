import { useEffect, useState } from 'react'
import { getProjectById, getTasks } from '../services/api'

const statusLabels = {
  Pending: 'Pendiente',
  InProgress: 'En progreso',
  Completed: 'Completada',
}

function ProjectDetail({ projectId, onClose }) {
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [error, setError] = useState('')
  const [tasksError, setTasksError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadProject() {
      try {
        const data = await getProjectById(
          projectId,
          controller.signal
        )

        if (!controller.signal.aborted) {
          setProject(data)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(`No se pudo cargar el detalle. ${err.message}`)
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    async function loadTasks() {
      try {
        const data = await getTasks(
          { projectId },
          controller.signal
        )

        if (!controller.signal.aborted) {
          setTasks(data)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setTasksError(
            `No se pudieron cargar las tareas del proyecto. ${err.message}`
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingTasks(false)
        }
      }
    }

    loadProject()
    loadTasks()

    return () => controller.abort()
  }, [projectId])

  return (
    <section aria-labelledby="project-detail-title">
      <h2 id="project-detail-title">Detalle del proyecto</h2>

      <button type="button" onClick={onClose}>
        Cerrar detalle
      </button>

      {loading && (
        <p role="status">Cargando detalle…</p>
      )}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && project && (
        <>
          <dl>
            <dt>ID</dt>
            <dd>{project.id}</dd>

            <dt>Nombre</dt>
            <dd>{project.name}</dd>

            <dt>Descripción</dt>
            <dd>{project.description || 'Sin descripción'}</dd>

            <dt>Fecha de inicio</dt>
            <dd>{project.startDate}</dd>
          </dl>

          <h3>Tareas del proyecto</h3>

          {loadingTasks && (
            <p role="status">
              Cargando tareas del proyecto…
            </p>
          )}

          {tasksError && (
            <p role="alert">{tasksError}</p>
          )}

          {!loadingTasks && !tasksError && (
            tasks.length === 0 ? (
              <p>No hay tareas registradas en este proyecto.</p>
            ) : (
              <>
                <p role="status">
                  Tareas del proyecto: {tasks.length}
                </p>

                <table>
                  <caption>
                    Tareas de {project.name}
                  </caption>

                  <thead>
                    <tr>
                      <th scope="col">Título</th>
                      <th scope="col">Descripción</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Vencimiento</th>
                      <th scope="col">Responsable</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>
                          {task.description || 'Sin descripción'}
                        </td>
                        <td>
                          {statusLabels[task.status] || task.status}
                        </td>
                        <td>{task.dueDate}</td>
                        <td>{task.assigneeName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )
          )}
        </>
      )}
    </section>
  )
}

export default ProjectDetail