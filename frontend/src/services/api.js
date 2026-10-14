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