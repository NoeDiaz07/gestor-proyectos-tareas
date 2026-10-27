# Gestor de proyectos y tareas

Aplicación de aprendizaje desarrollada con React, ASP.NET Core
y SQL Server para organizar proyectos, responsables y tareas.

Cada tarea pertenece a un proyecto y tiene un responsable asignado.

## Funcionalidades

- Crear, listar, consultar, editar y eliminar proyectos.
- Crear, listar, consultar, editar y eliminar responsables.
- Crear, listar, consultar, editar y eliminar tareas.
- Mostrar las tareas relacionadas en el detalle de proyectos
  y responsables.
- Filtrar tareas por proyecto, responsable y estado.
- Combinar filtros y limpiar la selección.
- Mostrar estados de carga, errores y confirmaciones.
- Actualizar los listados después de guardar o eliminar.
- Navegar entre las secciones mediante un menú.
- Adaptar formularios y navegación a ventanas estrechas.

## Herramientas utilizadas

- Backend: C# y ASP.NET Core Web API, con destino net10.0.
- Persistencia: Entity Framework Core 10.0.13 y SQL Server.
- Frontend: React con Vite 8.3.4 y JavaScript.
- Estilos: CSS.
- Análisis del frontend: Oxlint.
- Pruebas manuales: Swagger UI, navegador y SSMS.
- Control de versiones: Git y GitHub.

Versiones utilizadas durante el desarrollo:

- .NET SDK: 10.0.401.
- Node.js: 24.21.0.
- npm: 11.19.0.

## Organización

- `backend/Controllers`: operaciones HTTP y reglas de negocio.
- `backend/Models`: entidades Project, Assignee y TaskItem.
- `backend/DTOs`: datos de entrada y salida de la API.
- `backend/Data`: contexto de Entity Framework Core.
- `backend/Migrations`: cambios versionados de la base de datos.
- `frontend/src/components`: formularios, detalles y listado de tareas.
- `frontend/src/services/api.js`: llamadas HTTP al backend.
- `frontend/src/App.jsx`: integración de proyectos, responsables
  y tareas, y menú de navegación.
- `docs/PRUEBAS.md`: seguimiento de pruebas de aceptación.
- `docs/evidencias`: capturas de las comprobaciones.
- `backend/AVANCES.md`: registro de avances y pendientes.

## Requisitos para ejecutar

- SDK de .NET compatible con net10.0.
- Node.js y npm.
- SQL Server instalado y en ejecución.
- Git, si se descargará el repositorio mediante clonación.
- Herramienta dotnet-ef compatible con EF Core 10.0.13.

Visual Studio, Visual Studio Code y SSMS son las herramientas
utilizadas en este proyecto.

## Preparación

Descargar o clonar el repositorio y abrir una terminal en su
carpeta principal, `gestor-proyectos-tareas`.

Restaurar las dependencias del backend:

```powershell
dotnet restore backend
```

Instalar las dependencias del frontend:

```powershell
npm.cmd --prefix frontend install
```

Los comandos del frontend se muestran con `npm.cmd` para PowerShell
en Windows. En otros entornos puede utilizarse `npm`.

## Configuración de SQL Server

Revisar `ConnectionStrings:DefaultConnection` en la configuración
del backend.

Ejemplo para SQL Server local con autenticación de Windows:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=GestorProyectosDb;Trusted_Connection=True;Encrypt=True;TrustServerCertificate=True;"
  }
}
```

Integrar esta sección en el archivo de configuración existente;
no reemplazar las demás opciones.

Adaptar `Server` si la instalación utiliza una instancia con nombre.
El ejemplo es para desarrollo local. No publicar contraseñas reales.

## Migraciones

Las migraciones están incluidas en `backend/Migrations`.

Si dotnet-ef no está instalado:

```powershell
dotnet tool install --global dotnet-ef --version 10.0.13
```

Si ya está instalado, comprobar su versión:

```powershell
dotnet ef --version
```

Desde la carpeta principal, crear o actualizar la base:

```powershell
dotnet ef database update --project backend --startup-project backend
```

Este comando aplica las migraciones; no carga los datos de
demostración.

También puede utilizarse `Update-Database` desde la Consola del
Administrador de paquetes de Visual Studio, seleccionando
GestorProyectos.Api como proyecto predeterminado.

## Iniciar la API

En Visual Studio:

1. Abrir la solución del backend.
2. Seleccionar el perfil `http`.
3. Iniciar con el botón de ejecución.

Alternativa desde la carpeta principal:

```powershell
dotnet run --project backend --launch-profile http
```

Direcciones locales:

- API: http://localhost:5008
- Swagger: http://localhost:5008/swagger
- Proyectos: http://localhost:5008/api/projects
- Responsables: http://localhost:5008/api/assignees
- Tareas: http://localhost:5008/api/tasks

Swagger está disponible en desarrollo.

## Iniciar React

En otra terminal, desde la carpeta principal:

```powershell
npm.cmd --prefix frontend run dev
```

Abrir http://localhost:5173 y mantener la API ejecutándose.

La URL base de la API está definida en
`frontend/src/services/api.js`.

CORS permite el origen http://localhost:5173 en desarrollo.
Si cambia el puerto del frontend, revisar esa configuración
en `backend/Program.cs`.

## Verificaciones de compilación y código

Backend:

```powershell
dotnet build backend
```

Frontend:

```powershell
npm.cmd --prefix frontend run build
npm.cmd --prefix frontend run lint
```

Ejecutar estos comandos en una terminal diferente de la que
mantiene React en funcionamiento.

Build y lint no sustituyen las pruebas funcionales.

## Reglas principales

- Nombres y títulos obligatorios; se eliminan espacios exteriores.
- Nombre de proyecto o responsable: máximo 100 caracteres.
- Título de tarea: máximo 150 caracteres.
- Descripción: opcional, máximo 1000 caracteres.
- Correo obligatorio, válido y único, máximo 254 caracteres.
- El correo se normaliza eliminando espacios exteriores
  y convirtiéndolo a minúsculas.
- Una tarea nueva comienza en Pending.
- Al editar se permiten Pending, InProgress y Completed.
- Se permite reabrir una tarea completada.
- Proyecto y responsable deben existir.
- El vencimiento debe ser igual o posterior al inicio del proyecto.
- No puede cambiarse el inicio de un proyecto si deja tareas
  con vencimiento anterior.
- No se eliminan proyectos ni responsables con tareas asociadas,
  incluso si están completadas.
- Las fechas se intercambian sin hora, como YYYY-MM-DD.

## Operaciones de la API

Para `/api/projects`, `/api/assignees` y `/api/tasks`:

| Operación | Método | Respuesta correcta |
|---|---|---|
| Listar | GET | 200 con lista |
| Consultar por ID | GET /{id} | 200 |
| Crear | POST | 201 y cabecera Location |
| Actualizar | PUT /{id} | 200 |
| Eliminar | DELETE /{id} | 204 sin contenido |

Respuestas de error:

- 400: datos inválidos o reglas incumplidas.
- 404: registro inexistente.
- 409: correo duplicado o eliminación bloqueada por dependencias.

Ejemplo de filtros combinados:

```text
GET /api/tasks?projectId=1&assigneeId=2&status=Pending
```

Los filtros son opcionales y se combinan mediante AND.
Un estado desconocido devuelve 400.
Una consulta válida sin coincidencias devuelve una lista vacía.

## Pruebas y estado de entrega

Consultar `docs/PRUEBAS.md` para distinguir comprobaciones
realizadas, evidencias y escenarios pendientes.

Las pruebas de aceptación restantes se han pausado temporalmente
para avanzar con la presentación y documentación.

Pendientes de cierre:

- Completar la cobertura y evidencias de P01 a P12.
- Preparar los datos exactos de demostración del documento del reto.
- Documentar el modelo de entidades y relaciones.
- Verificar la instalación siguiendo este README en una base nueva,
  sin borrar la base utilizada durante el desarrollo.
- Preparar la demostración final.
- Concretar el alcance de autenticación solicitado adicionalmente
  por el mentor; todavía no está implementado.

El alcance original del PDF no incluye inicio de sesión.
Los responsables son registros de personas, no cuentas de acceso.

## Detener la aplicación

- API desde Visual Studio: botón Detener.
- API o React desde una terminal: Ctrl + C.