import { useEffect, useState } from 'react'
import { getAssigneeById, getTasks } from '../services/api'

const statusLabels = {
  Pending: 'Pendiente',
  InProgress: 'En progreso',
  Completed: 'Completada',
}

function AssigneeDetail({ assigneeId, onClose }) {
  const [assignee, setAssignee] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingTasks, setLoadingTasks] = useState(true)
  const [error, setError] = useState('')
  const [tasksError, setTasksError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadAssignee() {
      try {
        const data = await getAssigneeById(
          assigneeId,
          controller.signal
        )

        if (!controller.signal.aborted) {
          setAssignee(data)
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
          { assigneeId },
          controller.signal
        )

        if (!controller.signal.aborted) {
          setTasks(data)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setTasksError(
            `No se pudieron cargar las tareas del responsable. ${err.message}`
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingTasks(false)
        }
      }
    }

    loadAssignee()
    loadTasks()

    return () => controller.abort()
  }, [assigneeId])

  return (
    <section aria-labelledby="assignee-detail-title">
      <h3 id="assignee-detail-title">Detalle del responsable</h3>

      <button type="button" onClick={onClose}>
        Cerrar detalle
      </button>

      {loading && (
        <p role="status">Cargando detalle…</p>
      )}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && assignee && (
        <>
          <dl>
            <dt>ID</dt>
            <dd>{assignee.id}</dd>

            <dt>Nombre</dt>
            <dd>{assignee.name}</dd>

            <dt>Correo electrónico</dt>
            <dd>{assignee.email}</dd>
          </dl>

          <h4>Tareas asignadas</h4>

          {loadingTasks && (
            <p role="status">
              Cargando tareas asignadas…
            </p>
          )}

          {tasksError && (
            <p role="alert">{tasksError}</p>
          )}

          {!loadingTasks && !tasksError && (
            tasks.length === 0 ? (
              <p>Este responsable no tiene tareas asignadas.</p>
            ) : (
              <>
                <p role="status">
                  Tareas asignadas: {tasks.length}
                </p>

                <table>
                  <caption>
                    Tareas de {assignee.name}
                  </caption>

                  <thead>
                    <tr>
                      <th scope="col">Título</th>
                      <th scope="col">Descripción</th>
                      <th scope="col">Estado</th>
                      <th scope="col">Vencimiento</th>
                      <th scope="col">Proyecto</th>
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
                        <td>{task.projectName}</td>
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

export default AssigneeDetail