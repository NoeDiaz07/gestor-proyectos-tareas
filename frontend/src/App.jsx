import { useEffect, useState } from 'react'
import AssigneeForm from './components/AssigneeForm'
import ProjectDetail from './components/ProjectDetail'
import ProjectForm from './components/ProjectForm'
import {
  deleteProject,
  getProjects,
  getAssignees,
} from './services/api'
import './App.css'

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState(null)
  const [editingProject, setEditingProject] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [success, setSuccess] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const [assignees, setAssignees] = useState([])
  const [loadingAssignees, setLoadingAssignees] = useState(true)
  const [assigneesError, setAssigneesError] = useState('')
  const [editingAssignee, setEditingAssignee] = useState(null)
  const [assigneeSuccess, setAssigneeSuccess] = useState('')

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

  useEffect(() => {
    const controller = new AbortController()

    async function loadAssignees() {
      try {
        const data = await getAssignees(controller.signal)

        if (!controller.signal.aborted) {
          setAssignees(data)
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setAssigneesError(
            `No se pudieron cargar los responsables. Comprueba que la API esté funcionando. ${err.message}`
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingAssignees(false)
        }
      }
    }

    loadAssignees()

    return () => controller.abort()
  }, [])

  function handleCreated(project) {
    setProjects((current) => [...current, project])
    setSuccess('')
    setActionError('')
  }

  function handleUpdated(project) {
    setProjects((current) =>
      current.map((item) =>
        item.id === project.id ? project : item
      )
    )

    setEditingProject(null)
    setSelectedProjectId(null)
    setActionError('')
    setSuccess('Proyecto actualizado correctamente.')
  }

  function handleEdit(project) {
    setEditingProject(project)
    setSelectedProjectId(null)
    setSuccess('')
    setActionError('')
  }

  function handleCancelEdit() {
    setEditingProject(null)
    setSuccess('')
  }

  async function handleDelete(project) {
    if (deletingId !== null) {
      return
    }

    const confirmed = window.confirm(
      `¿Eliminar el proyecto "${project.name}"? Esta acción no se puede deshacer.`
    )

    if (!confirmed) {
      return
    }

    setDeletingId(project.id)
    setActionError('')
    setSuccess('')

    try {
      await deleteProject(project.id)

      setProjects((current) =>
        current.filter((item) => item.id !== project.id)
      )

      setSelectedProjectId((current) =>
        current === project.id ? null : current
      )

      setEditingProject((current) =>
        current?.id === project.id ? null : current
      )

      setSuccess('Proyecto eliminado correctamente.')
    } catch (err) {
      setActionError(`No se pudo eliminar. ${err.message}`)
    } finally {
      setDeletingId(null)
    }
  }

  function handleAssigneeCreated(assignee) {
    setAssignees((current) => [...current, assignee])
    setAssigneeSuccess('')
  }

  function handleAssigneeUpdated(assignee) {
    setAssignees((current) =>
      current.map((item) =>
        item.id === assignee.id ? assignee : item
      )
    )

    setEditingAssignee(null)
    setAssigneeSuccess('Responsable actualizado correctamente.')
  }

  function handleAssigneeEdit(assignee) {
    setEditingAssignee(assignee)
    setAssigneeSuccess('')
  }

  function handleAssigneeCancelEdit() {
    setEditingAssignee(null)
    setAssigneeSuccess('')
  }

  return (
    <main>
      <h1>Gestor de proyectos y tareas</h1>

      <section aria-labelledby="projects-title">
        <h2 id="projects-title">Proyectos</h2>

        {success && <p role="status">{success}</p>}
        {actionError && <p role="alert">{actionError}</p>}

        {selectedProjectId !== null && (
          <ProjectDetail
            key={selectedProjectId}
            projectId={selectedProjectId}
            onClose={() => setSelectedProjectId(null)}
          />
        )}

        {!loading && !error && (
          <fieldset disabled={deletingId !== null}>
            <legend>Formulario de proyecto</legend>

            <ProjectForm
              key={editingProject?.id ?? 'create'}
              project={editingProject}
              onCreated={handleCreated}
              onUpdated={handleUpdated}
              onCancel={handleCancelEdit}
            />
          </fieldset>
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
                    <td>
                      {project.description || 'Sin descripción'}
                    </td>
                    <td>{project.startDate}</td>
                    <td>
                      <button
                        type="button"
                        disabled={deletingId !== null}
                        onClick={() =>
                          setSelectedProjectId(project.id)
                        }
                      >
                        Ver detalle
                      </button>

                      <button
                        type="button"
                        disabled={deletingId !== null}
                        onClick={() => handleEdit(project)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        disabled={deletingId !== null}
                        onClick={() => handleDelete(project)}
                      >
                        {deletingId === project.id
                          ? 'Eliminando…'
                          : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </section>

      <section aria-labelledby="assignees-title">
        <h2 id="assignees-title">Responsables</h2>

        {assigneeSuccess && (
          <p role="status">{assigneeSuccess}</p>
        )}

        {!loadingAssignees && !assigneesError && (
          <AssigneeForm
            key={editingAssignee?.id ?? 'create-assignee'}
            assignee={editingAssignee}
            onCreated={handleAssigneeCreated}
            onUpdated={handleAssigneeUpdated}
            onCancel={handleAssigneeCancelEdit}
          />
        )}

        {loadingAssignees && (
          <p role="status">Cargando responsables…</p>
        )}

        {assigneesError && (
          <p role="alert">{assigneesError}</p>
        )}

        {!loadingAssignees && !assigneesError && (
          assignees.length === 0 ? (
            <p>No hay responsables registrados.</p>
          ) : (
            <table>
              <caption>Responsables registrados</caption>

              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Correo electrónico</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {assignees.map((assignee) => (
                  <tr key={assignee.id}>
                    <td>{assignee.name}</td>
                    <td>{assignee.email}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() =>
                          handleAssigneeEdit(assignee)
                        }
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </section>
    </main>
  )
}

export default App