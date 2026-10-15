import { useState } from 'react'
import { createProject } from '../services/api'

const emptyForm = {
  name: '',
  description: '',
  startDate: '',
}

function ProjectForm({ onCreated }) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [success, setSuccess] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setFieldErrors({})
    setSuccess('')

    try {
      const project = await createProject({
        name: form.name.trim(),
        description: form.description.trim() || null,
        startDate: form.startDate,
      })

      onCreated(project)
      setForm(emptyForm)
      setSuccess('Proyecto creado correctamente.')
    } catch (err) {
      setError(
        'No se pudo guardar. Revisa los datos y que la API esté funcionando.'
      )
      setFieldErrors(err.validationErrors || {})
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <h2>Crear proyecto</h2>

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
            <p key={message} role="alert">{message}</p>
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
            <p key={message} role="alert">{message}</p>
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
            <p key={message} role="alert">{message}</p>
          ))}

          <button type="submit">
            {saving ? 'Guardando…' : 'Guardar proyecto'}
          </button>
        </fieldset>

        {error && <p role="alert">{error}</p>}
        {success && <p role="status">{success}</p>}
      </form>
    </section>
  )
}

export default ProjectForm