import { useState } from 'react'
import {
  createAssignee,
  updateAssignee,
} from '../services/api'

const emptyForm = {
  name: '',
  email: '',
}

function AssigneeForm({
  assignee = null,
  onCreated,
  onUpdated,
  onCancel,
}) {
  const editing = assignee !== null

  const [form, setForm] = useState(() =>
    assignee
      ? {
          name: assignee.name,
          email: assignee.email,
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
        email: form.email.trim().toLowerCase(),
      }

      if (editing) {
        const updatedAssignee = await updateAssignee(
          assignee.id,
          data
        )

        onUpdated(updatedAssignee)
      } else {
        const createdAssignee = await createAssignee(data)

        onCreated(createdAssignee)
        setForm({ ...emptyForm })
        setSuccess('Responsable creado correctamente.')
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
    <section aria-labelledby="assignee-form-title">
      <h3 id="assignee-form-title">
        {editing ? 'Editar responsable' : 'Crear responsable'}
      </h3>

      <form onSubmit={handleSubmit}>
        <fieldset disabled={saving}>
          <legend>Datos del responsable</legend>

          <p>
            <label htmlFor="assignee-name">Nombre</label>
            <input
              id="assignee-name"
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
            <label htmlFor="assignee-email">
              Correo electrónico
            </label>
            <input
              id="assignee-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              maxLength={254}
            />
          </p>

          {fieldErrors.Email?.map((message) => (
            <p key={message} role="alert">
              {message}
            </p>
          ))}

          <button type="submit">
            {saving
              ? 'Guardando…'
              : editing
                ? 'Guardar cambios'
                : 'Guardar responsable'}
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

export default AssigneeForm