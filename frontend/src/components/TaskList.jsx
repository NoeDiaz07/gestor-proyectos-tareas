import { useEffect, useState } from 'react'
import { getTasks } from '../services/api'

const statusLabels = {
  Pending: 'Pendiente',
  InProgress: 'En progreso',
  Completed: 'Completada',
}

function TaskList() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadTasks() {
      try {
        const data = await getTasks({}, controller.signal)

        if (!controller.signal.aborted) {
          setTasks(data)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            `No se pudieron cargar las tareas. Comprueba que la API esté funcionando. ${err.message}`
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
  }, [])

  return (
    <section aria-labelledby="tasks-title">
      <h2 id="tasks-title">Tareas</h2>

      {loading && (
        <p role="status">Cargando tareas…</p>
      )}

      {error && (
        <p role="alert">{error}</p>
      )}

      {!loading && !error && (
        tasks.length === 0 ? (
          <p>No hay tareas registradas.</p>
        ) : (
          <table>
            <caption>Tareas registradas</caption>

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
                  <td>
                    {task.description || 'Sin descripción'}
                  </td>
                  <td>
                    {statusLabels[task.status] || task.status}
                  </td>
                  <td>{task.dueDate}</td>
                  <td>{task.projectName}</td>
                  <td>{task.assigneeName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </section>
  )
}

export default TaskList