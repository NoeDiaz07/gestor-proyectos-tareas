import { useEffect, useState } from 'react'
import { getProjectById } from '../services/api'

function ProjectDetail({ projectId, onClose }) {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

    loadProject()

    return () => controller.abort()
  }, [projectId])

  return (
    <section aria-labelledby="project-detail-title">
      <h2 id="project-detail-title">Detalle del proyecto</h2>
      <button type="button" onClick={onClose}>
        Cerrar detalle
      </button>

      {loading && <p role="status">Cargando detalle…</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && project && (
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
      )}
    </section>
  )
}

export default ProjectDetail