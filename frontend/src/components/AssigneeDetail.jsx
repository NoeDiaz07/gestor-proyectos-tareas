import { useEffect, useState } from 'react'
import { getAssigneeById } from '../services/api'

function AssigneeDetail({ assigneeId, onClose }) {
  const [assignee, setAssignee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

    loadAssignee()

    return () => controller.abort()
  }, [assigneeId])

  return (
    <section aria-labelledby="assignee-detail-title">
      <h3 id="assignee-detail-title">Detalle del responsable</h3>

      <button type="button" onClick={onClose}>
        Cerrar detalle
      </button>

      {loading && <p role="status">Cargando detalle…</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && assignee && (
        <dl>
          <dt>ID</dt>
          <dd>{assignee.id}</dd>

          <dt>Nombre</dt>
          <dd>{assignee.name}</dd>

          <dt>Correo electrónico</dt>
          <dd>{assignee.email}</dd>
        </dl>
      )}
    </section>
  )
}

export default AssigneeDetail