# Registro de avances — Gestor de proyectos y tareas

## Forma de trabajo
- Backend en C#: Visual Studio.
- Frontend en React: Visual Studio Code.
- Cada avance se comprueba antes de confirmar los cambios y subirlos a GitHub.
- Cada confirmación explica qué cambió, para qué sirve y cómo se comprobó.

## Implementado y comprobado

### Entorno y proyecto inicial
- Instalados Node, npm, Git y SDK .NET 10.0.401.
- Comprobada la conexión local a SQL Server.
- Creada la API ASP.NET Core con controladores.
- Configurado .gitignore para excluir archivos generados.
- Comprobadas la compilación y la respuesta JSON de WeatherForecast.
- Commit inicial publicado: f9fa41f.
- Invitación enviada al mentor EzRD12; posteriormente recibidos sus comentarios sobre los commits.

### Modelo Project
- Campos: Id, Name, Description y StartDate.
- Nombre obligatorio, máximo 100 caracteres.
- Descripción opcional, máximo 1000 caracteres.
- Fecha de inicio sin hora.
- Compilación correcta.
- Commit del modelo: 625c625.

### Acceso a SQL Server
- Instalados EF Core SqlServer y Tools 10.0.13.
- Creado ApplicationDbContext con DbSet<Project>.
- Registrado el contexto en Program.cs.
- Configurada la conexión local a SQL Server.
- Creada y aplicada la migración CreateProjects.
- Update-Database finalizó correctamente.
- Verificadas en SSMS la tabla Projects y el historial de migraciones.

### Documentación de la API
- Configurado OpenAPI.
- Integrado Swagger UI para pruebas en desarrollo.
- Documentadas las respuestas 201 y 400 de creación.
- Comprobada la respuesta 201 y la cabecera Location al crear un proyecto.

### Consulta de proyectos en la API
- Implementados GET /api/projects y GET /api/projects/{id}.
- Utilizado ProjectResponseDto para las respuestas.
- Comprobados el listado, la consulta de un proyecto existente y el 404 para un ID inexistente.

### Creación de proyectos en la API
- Implementado POST /api/projects con CreateProjectDto.
- Comprobados el ID generado y el guardado en SQL Server.
- Verificaciones realizadas:
  - Creación válida: 201 con cabecera Location.
  - Nombre con solo espacios: 400.
  - Fecha omitida: 400.
  - Nombre de 101 caracteres: 400.
  - Los intentos inválidos no agregaron registros, comprobado en SSMS.

### Actualización de proyectos en la API
- Implementado PUT /api/projects/{id} con UpdateProjectDto.
- Comprobadas la respuesta 200 y la persistencia de los cambios.
- Comprobados el 404 para un ID inexistente y el 400 para un nombre con solo espacios.
- Durante la integración con React se detectó que HttpPut estaba asociado por error al método Delete.
- Corregida la ubicación de los atributos: PUT actualiza y DELETE elimina.
- Tras la corrección, comprobado que editar conserva el proyecto y guarda los cambios.

### Eliminación de proyectos en la API
- Implementado DELETE /api/projects/{id}.
- Comprobada la respuesta 204 al eliminar.
- Comprobado el 404 al repetir la eliminación de un registro eliminado.
- Verificada la eliminación en SQL Server.

### Base del frontend
- Creado el frontend con React y Vite 8.3.4.
- Comprobada la ejecución en http://localhost:5173/.
- node_modules y dist excluidos de Git.
- Configurado CORS para ese origen, únicamente en desarrollo.

### Listado de proyectos desde React
- Creado services/api.js.
- Conectado App.jsx con GET /api/projects.
- Mostrados los proyectos registrados y el mensaje de listado vacío.
- Comprobado el mensaje de error con la API detenida.
- Al reiniciar la API y recargar, el listado vuelve a cargar.

### Creación de proyectos desde React
- Creado ProjectForm y conectado con POST.
- Guardado confirmado en SQL Server.
- Comprobados el mensaje de éxito, la limpieza del formulario y la actualización de la tabla sin recargar.
- Comprobados los mensajes de error por nombre inválido y API detenida.

### Detalle de proyectos desde React
- Agregado el botón Ver detalle y la consulta GET /api/projects/{id}.
- Mostrados ID, nombre, descripción y fecha de inicio.
- Incluidos estados de carga y error.
- Comprobados la apertura, el cambio entre proyectos y el cierre del detalle.

### Edición de proyectos desde React
- Reutilizado el formulario para crear y editar.
- Conectada la edición con PUT.
- Comprobados el mensaje de éxito y la actualización de la tabla sin recargar.
- Verificada la persistencia después de recargar y consultar el detalle.
- Comprobado que Cancelar edición descarta los cambios y conserva los datos originales después de recargar.

### Eliminación de proyectos desde React
- Agregado Eliminar con confirmación.
- Incluidos estado de procesamiento y mensajes de éxito y error.
- La tabla se actualiza después de eliminar.
- Comprobado que el proyecto eliminado sigue ausente después de recargar.
- Comprobado que cancelar la confirmación conserva el proyecto después de recargar.

### Verificación técnica
- Compilación de la API correcta en Visual Studio.
- Compilación de producción del frontend correcta.
- Análisis con Oxlint: 0 advertencias y 0 errores.
### Creación de responsables en la API
- Creado CreateAssigneeDto e implementado POST /api/assignees.
- Se recortan espacios exteriores y se convierte el correo a minúsculas.
- Se comprueban duplicados y se controla la restricción única de SQL Server.
- Verificado: creación con 201 y datos normalizados.
- Correo duplicado en mayúsculas: 400; el listado conserva un solo registro.
- Correo con formato inválido: 400.
- Listado y consulta individual: 200.
- Compilación correcta.
- Pendientes: comprobar Location, campos obligatorios y límites de longitud.
### Edición de responsables en la API
- Creado UpdateAssigneeDto e implementado PUT /api/assignees/{id}.
- Se normalizan el nombre y el correo.
- Se permite conservar el correo propio y se rechaza el de otro responsable.
- Verificado: actualización 200 y datos persistidos mediante consulta.
- Identificador inexistente: 404.
- Correo de otro responsable enviado en mayúsculas: 400.
- Confirmado que el intento rechazado no modifica los datos.
- Pendientes las restantes validaciones de campos y la eliminación.
### Eliminación de responsables en la API
- Implementado DELETE /api/assignees/{id}.
- Verificado: responsable temporal creado con 201 y eliminado con 204.
- Repetir la eliminación y consultar el registro eliminado devuelve 404.
- El listado conserva a Ana y Luis.
- Pendiente: bloqueo 409 al incorporar tareas relacionadas.
### Listado de responsables desde React
- Agregada getAssignees al servicio de la API.
- Incorporada la tabla de responsables con nombre y correo.
- Incluidos estados de carga, error y listado vacío.
- Verificado: aparecen Ana Pérez actualizada y Luis Gómez con sus correos.
- Compilación de producción correcta y Oxlint sin errores ni advertencias.
- Pendientes: probar los estados de error y vacío, e incorporar creación, detalle, edición y eliminación.
### Creación de responsables desde React
- Creado AssigneeForm y conectado con POST mediante createAssignee.
- Verificados el mensaje de éxito, la limpieza del formulario y la actualización del listado sin recargar.
- Confirmada la persistencia después de recargar.
- Correo duplicado: se muestra el error, se conservan los campos y se rehabilita el botón Guardar.
- El intento duplicado no agrega otra fila al listado.
- Compilación de producción correcta y Oxlint sin errores ni advertencias.
- Pendiente: comprobar el comportamiento con la API detenida. 
### Edición de responsables desde React
- Reutilizado AssigneeForm para crear y editar mediante PUT.
- Agregado Editar al listado y actualización de la tabla sin recargar.
- Verificada la persistencia del cambio después de recargar.
- Cancelar edición conserva los datos originales.
- Correo duplicado: muestra el error, conserva los campos y habilita nuevamente los botones.
- El intento rechazado no modifica los datos del listado.
- Compilación de producción correcta y Oxlint sin errores ni advertencias.
### Eliminación de responsables desde React
- Agregada deleteAssignee y el botón Eliminar con confirmación.
- Incluidos bloqueo de controles durante la eliminación y mensajes de resultado.
- Verificado: cancelar conserva el registro.
- Confirmar elimina el registro y actualiza la tabla sin recargar.
- Después de recargar, el eliminado sigue ausente y los demás permanecen.
- Compilación de producción correcta y Oxlint sin errores ni advertencias.
- Pendientes: prueba con API detenida y bloqueo por tareas relacionadas.
### Detalle de responsables desde React
- Agregada getAssigneeById al servicio de la API.
- Creado AssigneeDetail para mostrar ID, nombre y correo con estados de carga y error.
- Integrado Ver detalle y Cerrar detalle en el listado de responsables.
- Compilación correcta y Oxlint sin advertencias ni errores.
### Estructura de tareas en SQL Server
- Creado TaskItem con título, descripción, estado, vencimiento, proyecto y responsable.
- Agregado Tasks al contexto y configuradas ambas relaciones con Restrict.
- Creada y aplicada la migración CreateTasks.
- Verificados en SSMS la tabla vacía y las dos claves foráneas con NO_ACTION.
- Compilación de la API correcta.
- Pendientes: endpoints, validación de estados y fechas, filtros y respuestas 409 por dependencias.
### Consultas de tareas y primera práctica de depuración
- Creado TaskResponseDto con datos de la tarea y nombres del proyecto y responsable.
- Implementados GET /api/tasks y GET /api/tasks/{id}.
- Verificados el listado vacío con 200 y el identificador inexistente con 404.
- Depuración: inspeccionado tasks.Count = 0 y recorrido el caso inexistente hasta NotFound.
- Compilación de la API correcta.
- Pendientes: consulta de una tarea existente, creación, edición, eliminación y filtros.
### Creación y validación de tareas
- Creado CreateTaskDto e implementado POST /api/tasks.
- Verificada creación con 201, título recortado y cabecera Location.
- Vencimiento anterior al inicio del proyecto: 400 en DueDate.
- Proyecto y responsable inexistentes: 400 en ambos campos.
- Estado no permitido: 400 en Status.
- Listado y consulta individual: 200 con nombres relacionados.
- El listado contiene dos creaciones válidas equivalentes, IDs 1 y 2; no aparecen las tareas de pruebas inválidas.
- Practicada la depuración del recorrido de validación y guardado.
- Pendientes: restantes validaciones, edición, eliminación y filtros.
### Edición de tareas en la API
- Creado UpdateTaskDto e implementado PUT /api/tasks/{id}.
- Verificada actualización con 200 de descripción, estado y responsable.
- Consulta posterior confirma los cambios guardados.
- Fecha anterior al inicio del proyecto: 400.
- Tarea inexistente: 404.
- Proyecto y responsable inexistentes: 400 en ambos campos.
- Practicada la depuración comparando los datos anteriores de task con los nuevos de dto.
- Compilación correcta.
- Pendientes: restantes validaciones y comprobación final de persistencia tras el último rechazo por relaciones.
### Eliminación de tareas en la API
- Implementado DELETE /api/tasks/{id}.
- Comprobado con la tarea temporal 3: eliminación 204, consulta posterior 404 y segundo borrado 404.
- Recorrido con el depurador en Visual Studio y compilación sin errores.
### Protección de proyectos con tareas
- DELETE /api/projects/{id} devuelve 409 si el proyecto tiene tareas.
- Verificado con el depurador: hasTasks = true para el proyecto 6.
- Swagger devolvió 409; consultas posteriores confirmaron que el proyecto y sus tareas 1 y 2 permanecen.
- Compilación sin errores.
### Protección de responsables con tareas
- DELETE /api/assignees/{id} devuelve 409 si el responsable tiene tareas.
- Depuración: hasTasks = true para el responsable 1.
- Comprobado: respuesta 409 y conservación del responsable y su tarea relacionada.
- Compilación sin errores.
### Validación del inicio de proyectos con tareas
- PUT rechaza una fecha de inicio posterior al vencimiento de alguna tarea del proyecto.
- Depuración: hasTasksBeforeStartDate = true.
- Comprobado con el proyecto 6: inicio propuesto 2026-10-21 devuelve 400 en StartDate.
- Consulta posterior confirma que conserva el inicio 2026-10-10.
- Comprobado: inicio igual al vencimiento (2026-10-20) permitido con 200.
- Comprobado: restauración del inicio a 2026-10-10 y consulta posterior correctas.
### Filtros de tareas en la API
- GET /api/tasks permite filtrar por proyecto, responsable y estado.
- Los filtros combinados exigen que se cumplan todas las condiciones.
- Comprobados filtros individuales, combinados y listado sin filtros.
- Sin coincidencias: 200 con lista vacía.
- Estado inválido: 400 con error en status.
- Compilación correcta y consulta recorrida con el depurador.
### Listado de tareas desde React
- Creada getTasks en api.js, con soporte para filtros opcionales.
- Creado TaskList e integrado en App.jsx.
- Comprobadas las dos tareas con estado en español, proyecto y responsable.
- API detenida: aparece un error. Al reiniciarla y recargar, vuelve el listado.
- Build correcto y Oxlint sin advertencias ni errores.
- Pendiente: controles de filtros y acciones de tareas en React.
### Filtros de tareas desde React
- Agregados desplegables de proyecto, responsable y estado.
- Aplicar filtros consulta la API con la selección.
- Limpiar filtros restablece los controles y recupera el listado completo.
- Comprobados: combinación con una tarea, combinación sin coincidencias y limpieza con recuperación de las dos tareas.
- Build correcto y Oxlint sin advertencias ni errores.

## Pendiente
- Completar las validaciones y pruebas de proyectos:
  - Límites de descripción y demás casos pendientes de P04.
  - Restantes validaciones del PUT.
  ### Protección de responsables con tareas
- DELETE /api/assignees/{id} devuelve 409 si el responsable tiene tareas.
- Depuración: hasTasks = true para el responsable 1.
- Comprobado: respuesta 409 y conservación del responsable y su tarea relacionada.
- Compilación sin errores.
### Validación del inicio de proyectos con tareas
- PUT rechaza una fecha de inicio posterior al vencimiento de alguna tarea del proyecto.
- Depuración: hasTasksBeforeStartDate = true.
- Comprobado con el proyecto 6: inicio propuesto 2026-10-21 devuelve 400 en StartDate.
- Consulta posterior confirma que conserva el inicio 2026-10-10.
- Pendiente: comprobar una fecha permitida y el caso de igualdad.
  - Conservación de campos y rehabilitación del botón Guardar después de errores.
  - Manejo de errores al editar y eliminar desde React.
- Implementar responsables y tareas: modelos, DTOs, controladores y pantallas.
- Crear y aplicar las migraciones correspondientes.
- Implementar relaciones, validaciones y filtros de tareas.
- Bloquear con 409 la eliminación de proyectos o responsables con tareas asociadas.
- Validar las fechas de tareas respecto al inicio del proyecto y proteger las actualizaciones que las invaliden.
- Incorporar seguridad y autenticación; mecanismo pendiente de concretar.
- Completar y registrar los resultados y evidencias de P01–P12.
- Preparar README y demostración final.
### Base de datos de responsables
- Creado el modelo Assignee con Id, Name obligatorio de hasta 100 caracteres y Email obligatorio de hasta 254, con validación de formato.
- Agregado Assignees al contexto y configurado un índice único para Email.
- Creada y aplicada la migración CreateAssignees.
- Verificados en SSMS la tabla vacía y el índice IX_Assignees_Email con is_unique = 1.
- Compilación de la API correcta.
- Pendientes los endpoints, la normalización del correo y las pruebas de validación mediante la API.
### Consultas de responsables en la API
- Creado AssigneeResponseDto con Id, Name y Email.
- Implementados GET /api/assignees y GET /api/assignees/{id}.
- Verificados el listado vacío y la respuesta 404 para un ID inexistente.
- Compilación de la API correcta.
- Pendiente: consulta de un responsable existente, creación, edición y eliminación.