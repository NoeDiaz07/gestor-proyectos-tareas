import { useState } from 'react'
import { createAssignee } from '../services/api'

const emptyForm = {
  name: '',
  email: '',
}

function AssigneeForm({ onCreated }) {
  const [form, setForm] = useState({ ...emptyForm })
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
      const assignee = await createAssignee({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      })

      onCreated(assignee)
      setForm({ ...emptyForm })
      setSuccess('Responsable creado correctamente.')
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
    <section aria-labelledby="assignee-form-title">
      <h3 id="assignee-form-title">Crear responsable</h3>

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
            {saving ? 'Guardando…' : 'Guardar responsable'}
          </button>
        </fieldset>

        {error && <p role="alert">{error}</p>}
        {success && <p role="status">{success}</p>}
      </form>
    </section>
  )
}

export default AssigneeForm