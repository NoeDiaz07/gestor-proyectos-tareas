import { useState } from 'react'
import { createProject, updateProject } from '../services/api'

const emptyForm = {
  name: '',
  description: '',
  startDate: '',
}

function ProjectForm({
  project = null,
  onCreated,
  onUpdated,
  onCancel,
}) {
  const editing = project !== null

  const [form, setForm] = useState(() =>
    project
      ? {
          name: project.name,
          description: project.description ?? '',
          startDate: project.startDate,
        }
      : { ...emptyForm }
  )

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [success, setSuccess] = useState('')

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (saving) {
      return
    }

    setSaving(true)
    setError('')
    setFieldErrors({})
    setSuccess('')

    try {
      const data = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        startDate: form.startDate,
      }

      if (editing) {
        const updatedProject = await updateProject(project.id, data)
        onUpdated(updatedProject)
      } else {
        const createdProject = await createProject(data)
        onCreated(createdProject)

        setForm({ ...emptyForm })
        setSuccess('Proyecto creado correctamente.')
      }
    } catch (err) {
      setError(
        editing
          ? `No se pudo actualizar. ${err.message}`
          : 'No se pudo guardar. Revisa los datos y que la API esté funcionando.'
      )

      setFieldErrors(err.validationErrors || {})
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <h2>{editing ? 'Editar proyecto' : 'Crear proyecto'}</h2>

      <form onSubmit={handleSubmit}>
        <fieldset disabled={saving}>
          <legend>Datos del proyecto</legend>

          <p>
            <label htmlFor="project-name">Nombre</label>
            <input
              id="project-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              maxLength={100}
            />
          </p>

          {fieldErrors.Name?.map((message) => (
            <p key={message} role="alert">
              {message}
            </p>
          ))}

          <p>
            <label htmlFor="project-description">Descripción</label>
            <textarea
              id="project-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={1000}
            />
          </p>

          {fieldErrors.Description?.map((message) => (
            <p key={message} role="alert">
              {message}
            </p>
          ))}

          <p>
            <label htmlFor="project-start-date">Fecha de inicio</label>
            <input
              id="project-start-date"
              name="startDate"
              type="date"
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </p>

          {fieldErrors.StartDate?.map((message) => (
            <p key={message} role="alert">
              {message}
            </p>
          ))}

          <button type="submit">
            {saving
              ? 'Guardando…'
              : editing
                ? 'Guardar cambios'
                : 'Guardar proyecto'}
          </button>

          {editing && (
            <button type="button" onClick={onCancel}>
              Cancelar edición
            </button>
          )}
        </fieldset>

        {error && <p role="alert">{error}</p>}
        {success && <p role="status">{success}</p>}
      </form>
    </section>
  )
}

export default ProjectForm