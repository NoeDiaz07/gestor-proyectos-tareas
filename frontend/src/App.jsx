import { useEffect, useState } from 'react'
import ProjectDetail from './components/ProjectDetail'
import ProjectForm from './components/ProjectForm'
import { getProjects } from './services/api'
import './App.css'

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadProjects() {
      try {
        const data = await getProjects(controller.signal)

        if (!controller.signal.aborted) {
          setProjects(data)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            `No se pudieron cargar los proyectos. Comprueba que la API esté funcionando. ${err.message}`
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadProjects()

    return () => controller.abort()
  }, [])

  return (
    <main>
      <h1>Proyectos</h1>

      {selectedProjectId !== null && (
        <ProjectDetail
          key={selectedProjectId}
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}

      {!loading && !error && (
        <ProjectForm
          onCreated={(project) =>
            setProjects((current) => [...current, project])
          }
        />
      )}

      {loading && <p role="status">Cargando proyectos…</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        projects.length === 0 ? (
          <p>No hay proyectos registrados.</p>
        ) : (
          <table>
            <caption>Proyectos registrados</caption>
<thead>
  <tr>
    <th scope="col">Nombre</th>
    <th scope="col">Descripción</th>
    <th scope="col">Fecha de inicio</th>
    <th scope="col">Acciones</th>
  </tr>
</thead>

            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.name}</td>
                  <td>{project.description || 'Sin descripción'}</td>
                  <td>{project.startDate}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => setSelectedProjectId(project.id)}
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </main>
  )
}

export default App