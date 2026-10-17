const API_URL = 'http://localhost:5008/api';


export async function getProjects(signal) {
  const response = await fetch(`${API_URL}/projects`, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `No se pudieron cargar los proyectos (${response.status}).`
    );
  }

  return response.json();
  
}
export async function createProject(project) {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(project),
  })

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}))

    const error = new Error(
      problem.detail || 'No se pudo guardar el proyecto.'
    )

    error.validationErrors = problem.errors || {}
    throw error
  }

  return response.json()
}
export async function getProjectById(id, signal) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? 'El proyecto no existe.'
        : `No se pudo cargar el proyecto (${response.status}).`
    )
  }

  return response.json()
}
export async function updateProject(id, project) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(project),
  })

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}))

    const error = new Error(
      response.status === 404
        ? 'El proyecto ya no existe.'
        : problem.detail || 'No se pudo actualizar el proyecto.'
    )

    error.validationErrors = problem.errors || {}
    throw error
  }

  return response.json()
}
export async function deleteProject(id) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}))

    throw new Error(
      response.status === 404
        ? 'El proyecto ya no existe. Actualiza el listado.'
        : response.status === 409
          ? problem.detail ||
            'No se puede eliminar porque tiene registros relacionados.'
          : problem.detail || 'No se pudo eliminar el proyecto.'
    )
  }
}
export async function getAssignees(signal) {
  const response = await fetch(`${API_URL}/assignees`, {
    signal,
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(
      `No se pudieron cargar los responsables (${response.status}).`
    )
  }

  return response.json()
}