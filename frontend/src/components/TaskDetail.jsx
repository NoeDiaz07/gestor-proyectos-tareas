import { useEffect, useState } from 'react'
import { getTaskById } from '../services/api'

const statusLabels = {
  Pending: 'Pendiente',
  InProgress: 'En progreso',
  Completed: 'Completada',
}

function TaskDetail({ taskId, onClose }) {
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadTask() {
      try {
        const data = await getTaskById(
          taskId,
          controller.signal
        )

        if (!controller.signal.aborted) {
          setTask(data)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            `No se pudo cargar el detalle. ${err.message}`
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadTask()

    return () => controller.abort()
  }, [taskId])

  return (
    <section aria-labelledby="task-detail-title">
      <h3 id="task-detail-title">Detalle de la tarea</h3>

      <button type="button" onClick={onClose}>
        Cerrar detalle
      </button>

      {loading && (
        <p role="status">Cargando detalle de la tarea…</p>
      )}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && task && (
        <dl>
          <dt>ID</dt>
          <dd>{task.id}</dd>

          <dt>Título</dt>
          <dd>{task.title}</dd>

          <dt>Descripción</dt>
          <dd>{task.description || 'Sin descripción'}</dd>

          <dt>Estado</dt>
          <dd>
            {statusLabels[task.status] || task.status}
          </dd>

          <dt>Fecha de vencimiento</dt>
          <dd>{task.dueDate}</dd>

          <dt>Proyecto</dt>
          <dd>{task.projectName}</dd>

          <dt>Responsable</dt>
          <dd>{task.assigneeName}</dd>
        </dl>
      )}
    </section>
  )
}

export default TaskDetail