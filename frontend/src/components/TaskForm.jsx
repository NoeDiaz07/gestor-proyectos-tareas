import { useState } from 'react'
import { createTask } from '../services/api'

const emptyForm = {
  title: '',
  description: '',
  status: 'Pending',
  dueDate: '',
  projectId: '',
  assigneeId: '',
}

function TaskForm({ projects = [], assignees = [], onCreated }) {
  const [form, setForm] = useState({ ...emptyForm })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [success, setSuccess] = useState('')

  const missingOptions =
    projects.length === 0 || assignees.length === 0

  function handleChange(event) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setSuccess('')
  }

  function renderFieldErrors(name) {
    const messages =
      fieldErrors[name] ||
      fieldErrors[name.charAt(0).toLowerCase() + name.slice(1)] ||
      []

    return messages.map((message) => (
      <p key={message} role="alert">
        {message}
      </p>
    ))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (saving || missingOptions) {
      return
    }

    setError('')
    setFieldErrors({})
    setSuccess('')

    if (!form.title.trim()) {
      setFieldErrors({
        Title: ['El título es obligatorio.'],
      })
      return
    }

    setSaving(true)

    try {
      const task = await createTask({
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: form.status,
        dueDate: form.dueDate,
        projectId: Number(form.projectId),
        assigneeId: Number(form.assigneeId),
      })

      setForm({ ...emptyForm })
      setSuccess('Tarea creada correctamente.')
      onCreated(task)
    } catch (err) {
      const validationErrors = err.validationErrors || {}

      setFieldErrors(validationErrors)
      setError(
        Object.keys(validationErrors).length > 0
          ? 'No se pudo guardar. Revisa los campos indicados.'
          : `No se pudo guardar. ${err.message}`
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <section aria-labelledby="task-form-title">
      <h3 id="task-form-title">Crear tarea</h3>

      {missingOptions && (
        <p role="status">
          Para crear una tarea, debe haber al menos un proyecto
          y un responsable disponibles.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <fieldset disabled={saving || missingOptions}>
          <legend>Datos de la tarea</legend>

          <p>
            <label htmlFor="task-title">Título</label>
            <input
              id="task-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={150}
            />
          </p>

          {renderFieldErrors('Title')}

          <p>
            <label htmlFor="task-description">Descripción</label>
            <textarea
              id="task-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              maxLength={1000}
            />
          </p>

          {renderFieldErrors('Description')}

          <p>
            <label htmlFor="task-status">Estado</label>
            <select
              id="task-status"
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="Pending">Pendiente</option>
              <option value="InProgress">En progreso</option>
              <option value="Completed">Completada</option>
            </select>
          </p>

          {renderFieldErrors('Status')}

          <p>
            <label htmlFor="task-due-date">
              Fecha de vencimiento
            </label>
            <input
              id="task-due-date"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              required
            />
          </p>

          {renderFieldErrors('DueDate')}

          <p>
            <label htmlFor="task-project">Proyecto</label>
            <select
              id="task-project"
              name="projectId"
              value={form.projectId}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un proyecto</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </p>

          {renderFieldErrors('ProjectId')}

          <p>
            <label htmlFor="task-assignee">Responsable</label>
            <select
              id="task-assignee"
              name="assigneeId"
              value={form.assigneeId}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un responsable</option>
              {assignees.map((assignee) => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name}
                </option>
              ))}
            </select>
          </p>

          {renderFieldErrors('AssigneeId')}

          <button type="submit">
            {saving ? 'Guardando…' : 'Guardar tarea'}
          </button>
        </fieldset>

        {error && <p role="alert">{error}</p>}
        {success && <p role="status">{success}</p>}
      </form>
    </section>
  )
}

export default TaskForm