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
  - Crear, consultar por ID, editar y eliminar proyectos siguen pendientes.
- Implementado GET /api/projects/{id}.
  - Comprobación: compilación sin errores y respuesta 404 para ID inexistente.
	- Implementado POST /api/projects con creación en SQL Server. Comprobación: compilación sin errores, respuesta con ID generado y datos esperados, y registro confirmado en dbo.Projects.
	- Integrado Swagger UI para probar la API en desarrollo.
- Documentadas las respuestas 201 y 400 del POST.
- Comprobado POST: respuesta 201 y Location /api/projects/2.
- Comprobada la consulta por ID de un proyecto existente.
## Pendiente
- Completar CRUD de proyectos desde SQL Server hasta React.
- Completar responsables y tareas, relaciones, validaciones y filtros.
- Crear y aplicar las migraciones que requieran responsables y tareas.
- Incorporar seguridad y autenticación solicitadas adicionalmente.
  - Detalles del mecanismo pendientes de concretar.
- Registrar resultados y evidencias de las pruebas P01–P12.
- Preparar README y demostración final.
- volver a comprobar la respuesta 201 Created y la cabecera Location