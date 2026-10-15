# Registro de avances — Gestor de proyectos y tareas

## Forma de trabajo
- C# y backend: Visual Studio.
- React y frontend: Visual Studio Code.
- Cada avance se comprueba antes de crear su commit y hacer push.
- Cada commit explica qué cambió, para qué sirve y cómo se comprobó.

## Completado y comprobado
- Entorno: Node, npm, Git, SDK .NET 10.0.401 y conexión local a SQL Server.
- API ASP.NET Core con controladores y archivo .gitignore.
  - Comprobación: compilación correcta y respuesta JSON de WeatherForecast.
  - Commit publicado: f9fa41f.
- Documentación OpenAPI.
  - Comprobación: /openapi/v1.json muestra la operación GET de WeatherForecast.
- Modelo Project: Id, Name, Description y StartDate.
  - Nombre obligatorio, máximo 100 caracteres.
  - Descripción opcional, máximo 1000 caracteres.
  - Fecha de inicio sin hora.
  - Comprobación: recompilación en Visual Studio con 0 errores.
  - Commit publicado: 625c625.
- Invitación enviada al mentor EzRD12.
  - Último estado comprobado: pendiente de aceptación.
- EF Core: SqlServer y Tools 10.0.13 instalados.
  - Comprobación: compilación correcta en Visual Studio.
  - Conexión de la API y migraciones pendientes.
- Creado ApplicationDbContext con DbSet<Project>.
  - Comprobación: compilación correcta, 0 errores.
  - Sin conexión configurada ni migraciones todavía.
- Registrado ApplicationDbContext en Program.cs y configurada la conexión local.
- Creada y aplicada la migración CreateProjects.
  - Comprobación: Update-Database finalizó correctamente.
  - SSMS confirma las columnas de Projects y el historial de migraciones.
- Implementado GET /api/projects con ProjectResponseDto.
  - Comprobación: compilación sin errores y respuesta [] desde la API.
- Implementado GET /api/projects/{id}.
  - Comprobación: compilación sin errores y respuesta 404 para ID inexistente.
	- Implementado POST /api/projects con creación en SQL Server. Comprobación: compilación sin errores, respuesta con ID generado y datos esperados, y registro confirmado en dbo.Projects.
	- Integrado Swagger UI para probar la API en desarrollo.
- Documentadas las respuestas 201 y 400 del POST.
- Comprobado POST: respuesta 201 y Location /api/projects/2.
- Comprobada la consulta por ID de un proyecto existente.
- Pruebas de validación del POST comprobadas en Swagger:
  - Nombre con solo espacios: esperado 400; obtenido 400 con error en Name.
  - Fecha omitida: esperado 400; obtenido 400 con error en StartDate.
  - Nombre de 101 caracteres: esperado 400; obtenido 400 por máximo de 100.
  - SSMS confirma que permanecen únicamente los dos proyectos válidos.
  - Pendiente: probar el límite de la descripción y los demás casos de P04.
  - Implementado PUT /api/projects/{id} con UpdateProjectDto.
  - Comprobado: edición con 200 y cambio guardado en SQL Server.
  - ID inexistente: 404. Nombre con solo espacios: 400.
  - Pendiente: restantes validaciones del PUT y protección de fechas al incorporar tareas.
	- Implementado DELETE /api/projects/{id}.
  - Comprobado: respuesta 204 al eliminar el proyecto temporal 3.
  - Verificación en SSMS: permanecen los proyectos 1 y 2.
  - Pendiente: confirmar los 404 de consulta y borrado del ID eliminado.
  - Pendiente: bloqueo 409 al incorporar tareas asociadas.
  - Creada la base del frontend con React y Vite 8.3.4.
  - Pantalla inicial comprobada en localhost:5173.
  - Build correcto y Oxlint sin advertencias ni errores.
  - node_modules y dist excluidos de Git.
  - Pendiente: pantallas de proyectos y conexión con la API.
  - Configurado CORS para React en localhost:5173, solo en desarrollo.
- Creado services/api.js y listado de proyectos en App.jsx.
  - Comprobado: aparecen los dos proyectos de SQL Server.
  - API detenida: se muestra un error; al reiniciarla y recargar, vuelve el listado.
  - Build correcto y Oxlint sin advertencias ni errores.
  - Pendiente: formularios y acciones del CRUD en React.
  - Creado ProjectForm y conectada la creación de proyectos desde React.
  - Guardado confirmado en SQL Server.
  - Mensaje de éxito, formulario limpio y tabla actualizada sin recargar.
  - Mostrados errores por nombre inválido y API detenida.
  - Build correcto y Oxlint sin advertencias ni errores.
  - Pendiente: confirmar conservación de campos y rehabilitación de Guardar tras errores.
  ### Consulta del detalle de proyectos desde React
- Se agrega “Ver detalle” al listado y la consulta GET /api/projects/{id}.
- Se muestran ID, nombre, descripción y fecha, con estados de carga y error.
- Verificado: abrir el detalle, cambiar de proyecto y cerrarlo.
- Build y lint completados sin errores ni advertencias.


## Pendiente
- Completar CRUD de proyectos desde SQL Server hasta React.
- Completar responsables y tareas, relaciones, validaciones y filtros.
- Crear y aplicar las migraciones que requieran responsables y tareas.
- Incorporar seguridad y autenticación solicitadas adicionalmente.
  - Detalles del mecanismo pendientes de concretar.
- Registrar resultados y evidencias de las pruebas P01–P12.
- Preparar README y demostración final.
- volver a comprobar la respuesta 201 Created y la cabecera Location