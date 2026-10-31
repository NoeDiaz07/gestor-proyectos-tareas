# Guion de demostración — Gestor de proyectos y tareas

Duración aproximada: 10 a 15 minutos.

## 1. Preparación antes de grabar

- Mantener la API ejecutándose en http://localhost:5008.
- Mantener React ejecutándose en http://localhost:5173.
- Tener disponibles Swagger, Visual Studio Code y SQL Server Management Studio.
- Cerrar pestañas y ventanas que no se utilizarán.
- Desactivar notificaciones que puedan interrumpir la grabación.
- Comprobar que están disponibles los proyectos Sitio corporativo y Portal interno.
- Identificar a Ana con ana@example.com y Luis con luis@example.com.
- No confundirlos con Ana Pérez y Luis Gómez, que son registros anteriores.
- Limpiar los filtros antes de comenzar.
- Usar registros temporales para las operaciones de creación, edición y eliminación.

No es necesario volver a ejecutar todas las pruebas P01 a P12 durante el video.

## 2. Presentación del proyecto — 1 minuto

Mostrar la pantalla principal de React.

Texto para explicar:

“Esta aplicación permite administrar proyectos, responsables y tareas.
El frontend está desarrollado con React y el backend con ASP.NET Core.
Los datos se almacenan en SQL Server mediante Entity Framework Core.

Cada tarea pertenece a un proyecto y tiene un responsable asignado.
Desde la interfaz podemos crear, consultar, editar y eliminar registros,
además de filtrar las tareas por proyecto, responsable y estado.”

Mostrar el menú y las tres secciones.

## 3. Organización del código — 1 minuto

En Visual Studio Code, mostrar brevemente:

- backend/Controllers
- backend/DTOs
- backend/Models
- backend/Data
- backend/Migrations
- frontend/src/components
- frontend/src/services/api.js

Texto para explicar:

“En el backend, los controladores reciben las solicitudes HTTP.
Los DTO definen los datos que entran y salen de la API.
Los modelos representan las entidades y el contexto conecta la aplicación
con la base de datos. Las migraciones permiten reproducir su estructura.

En el frontend, los componentes organizan los formularios, los detalles
y los listados. El archivo api.js centraliza las llamadas al backend.”

## 4. Crear un proyecto y un responsable — 2 minutos

En React, crear este proyecto:

- Nombre: Proyecto demostración final
- Descripción: Registro temporal para el video
- Fecha de inicio: 01/10/2026

Mostrar que aparece en el listado y abrir su detalle.

Crear este responsable:

- Nombre: Responsable demostración final
- Correo: demo.final@example.com

Utilizar ese correo solamente si no existe.
Si quedó registrado durante un ensayo, utilizar otro correo único.

Mostrar el responsable en el listado y abrir su detalle.

Texto para explicar:

“Los formularios envían los datos a la API. Cuando la operación termina
correctamente, el registro aparece en el listado y podemos consultar
su información desde el botón Ver detalle.”

## 5. Crear, consultar y editar una tarea — 2 minutos

Crear una tarea con estos datos:

- Título: Tarea demostración final
- Descripción: Prueba del flujo completo desde React
- Estado: Pendiente
- Fecha de vencimiento: 30/10/2026
- Proyecto: Proyecto demostración final
- Responsable: Responsable demostración final

Mostrar la tarea en el listado y abrir su detalle.

Pulsar Editar y modificar:

- Título: Tarea demostración final editada
- Estado: En progreso

Guardar los cambios.

Recargar la página y localizar nuevamente la tarea.

Texto para explicar:

“Una tarea nueva comienza en estado Pendiente.
Al editarla puedo cambiar su información y seleccionar otro estado.
Después de guardar y recargar la página, los cambios permanecen,
porque están almacenados en SQL Server.”

## 6. Mostrar una validación de fechas — 1 minuto

Editar la tarea temporal.

Cambiar el vencimiento a 30/09/2026.
El proyecto comienza el 01/10/2026.

Intentar guardar y mostrar el mensaje de validación.

Después, cancelar la edición.

Texto para explicar:

“El vencimiento no puede ser anterior al inicio del proyecto.
La API rechaza esta operación y React muestra el mensaje correspondiente.
Los datos inválidos no reemplazan la información que estaba guardada.”

## 7. Mostrar los filtros — 2 minutos

Utilizar los registros de demostración del reto.

Primera consulta:

- Proyecto: Sitio corporativo
- Responsable: Ana, con correo ana@example.com
- Estado: Pendiente

Pulsar Aplicar filtros.

Resultado esperado:

- Diseñar portada.

Segunda consulta:

- Proyecto: Portal interno
- Responsable: Ana, con correo ana@example.com
- Estado: Completada

Pulsar Aplicar filtros.

Resultado esperado:

- Mensaje indicando que no hay tareas que coincidan.

Pulsar Limpiar filtros.

Texto para explicar:

“Los filtros pueden utilizarse individualmente o combinarse.
Cuando combino proyecto, responsable y estado, una tarea debe cumplir
las tres condiciones para aparecer.

Una consulta válida sin coincidencias muestra un listado vacío.
Al limpiar los filtros vuelvo a consultar todas las tareas.”

El listado general puede incluir registros anteriores del desarrollo,
además de los cinco datos de demostración del reto.

## 8. Mostrar la protección del borrado — 1 minuto

Intentar eliminar Proyecto demostración final mientras conserva su tarea.

Aceptar la confirmación y mostrar el mensaje de bloqueo.

Intentar eliminar Responsable demostración final mientras conserva su tarea.

Aceptar la confirmación y mostrar el mensaje de bloqueo.

Texto para explicar:

“La aplicación impide eliminar proyectos o responsables que tienen
tareas relacionadas. La API responde con un conflicto y la interfaz
explica por qué no se puede completar la eliminación.”

## 9. Eliminar los registros temporales — 1 minuto

Realizar las eliminaciones en este orden:

1. Tarea demostración final editada.
2. Proyecto demostración final.
3. Responsable demostración final.

Confirmar cada eliminación y mostrar que desaparece del listado.

Texto para explicar:

“Primero elimino la tarea temporal.
Una vez que el proyecto y el responsable ya no tienen tareas asociadas,
puedo eliminarlos. Así termino la demostración sin conservar
los registros temporales que creé durante el video.”

No eliminar Sitio corporativo, Portal interno, Ana ni Luis
de los datos de demostración del reto.

## 10. Mostrar la API y la documentación — 1 a 2 minutos

Abrir Swagger y mostrar los grupos:

- Projects.
- Assignees.
- Tasks.

Ejecutar GET /api/tasks sin filtros y mostrar la respuesta.

Texto para explicar:

“La API expone operaciones para proyectos, responsables y tareas.
Las consultas devuelven 200, las creaciones 201 y las eliminaciones
correctas 204 sin contenido.

Los datos inválidos generan 400, los registros inexistentes 404
y los conflictos, como un correo duplicado o un borrado bloqueado, 409.”

En Visual Studio Code, abrir:

- README.md.
- docs/MODELO_DATOS.md.
- docs/PRUEBAS.md.
- docs/evidencias.

Texto para explicar:

“El README explica cómo configurar y ejecutar el proyecto.
El modelo de datos documenta las entidades y sus relaciones.
El registro de pruebas recoge las comprobaciones realizadas
y sus evidencias.

También comprobé la instalación en una copia separada del proyecto
con una base de datos nueva, conservando la base utilizada
durante el desarrollo.”

## 11. Cierre — 30 segundos

Texto para explicar:

“Con esta demostración he mostrado el flujo de creación, consulta,
edición y eliminación, las validaciones, los filtros y la persistencia.

El proyecto incluye documentación para su ejecución y evidencias
de las pruebas de aceptación.

La autenticación es una ampliación solicitada por el mentor
que todavía debe concretarse y no está implementada.
Los responsables registrados representan personas asignadas
a tareas, no cuentas de acceso.”

## Lista de control del ensayo

- [ ] La API y React permanecen funcionando.
- [ ] Identifico cada pantalla sin buscar durante mucho tiempo.
- [ ] Selecciono los responsables correctos de la demostración.
- [ ] Muestro la persistencia después de recargar.
- [ ] Muestro el rechazo de una fecha inválida.
- [ ] Los filtros producen los resultados esperados.
- [ ] Muestro el bloqueo de eliminación por tareas relacionadas.
- [ ] Elimino solamente los registros temporales del ensayo.
- [ ] Los documentos y sus enlaces abren correctamente.
- [ ] La explicación dura aproximadamente entre 10 y 15 minutos.