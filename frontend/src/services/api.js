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
