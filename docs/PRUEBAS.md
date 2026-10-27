# Pruebas de aceptación

## Forma de registro

Cada caso debe incluir:
- Datos utilizados e identificadores reales.
- Resultado esperado.
- Resultado observado.
- Evidencia: captura o respuesta HTTP.
- Estado: pendiente, parcial o completado.

Las comprobaciones previas se registran como parciales cuando
todavía falta cubrir algún escenario o adjuntar evidencia.

## Seguimiento

| Caso | Comprobaciones realizadas | Pendiente |
|---|---|---|
| P01 — Proyectos | Creación, listado, detalle, edición y eliminación desde React; persistencia comprobada en avances anteriores. | Reunir evidencias de las cinco operaciones y su verificación en SQL Server. |
| P02 — Responsables | CRUD desde API y React comprobado en avances anteriores. | Reunir evidencias y verificar el caso completo con un responsable temporal sin tareas. |
| P03 — Tareas | CRUD desde API y React; edición de estado, responsable, descripción y vencimiento comprobada durante el desarrollo. | Probar el cambio de proyecto y completar evidencias. |
| P04 — Obligatorios | Rechazos por nombre inválido y algunas longitudes comprobados durante el desarrollo. | Completar vacíos, espacios y límites de longitud en los recursos; verificar mensajes en React. |
| P05 — Correo | Completado: duplicado con espacios y mayúsculas devuelve 409; edición con correo ajeno devuelve 409; correo propio devuelve 200. Permanecen los tres responsables. | Ninguno. |
- Estado de P05: completado.
- Edición con el correo de Luis en Ana: 409.
- Edición de Ana conservando su correo propio: 200.
- Listado verificado: permanecen Ana, Luis y María,
  sin registros adicionales.

| P06 — Relaciones | Crear y editar tareas con proyecto y responsable inexistentes devuelve 400. | Reunir evidencias y confirmar que no se guardaron cambios. |
| P07 — Fechas | Rechazados vencimientos anteriores al inicio y cambios incompatibles del inicio del proyecto. | Completar evidencias, incluida la igualdad entre ambas fechas. |
| P08 — Borrado | Bloqueo 409 por tareas comprobado en la API para proyecto y responsable. | Confirmar bloqueo desde React y probar 204 después de reasignar o eliminar tareas temporales. |
| P09 — Estados | Estado inválido rechazado; creación limitada a Pending. | Completar y reabrir una tarea; recargar y comprobar persistencia. |
| P10 — Filtros | Filtros individuales, combinados, sin coincidencias y limpieza comprobados. | Preparar los datos de demostración y ejecutar el caso exacto solicitado. |
| P11 — Errores | Varios 404 y errores con API detenida comprobados durante el desarrollo. | Completar consulta, edición y borrado inexistentes por recurso; conservación del formulario ante fallo. |
| P12 — Persistencia | Datos conservados después de recargar y reiniciar la API. | Verificar montaje en una base nueva con migraciones, sin borrar la base actual. |

## Registro detallado

Se agregará una sección por cada prueba ejecutada, indicando
resultado esperado, observado y ubicación de la evidencia.
### P09 — Completar y reabrir una tarea

- Tarea utilizada: ID 4, Tarea editada desde React.
- Resultado esperado: permitir cambiar de Completada a En progreso
  y conservar cada estado después de recargar el navegador.
- Resultado observado: la tarea conservó Completada después de
  recargar y, al reabrirla, conservó En progreso.
- Estado: cambio de estados y persistencia comprobados.
- Estado inválido: rechazo 400 comprobado y evidencia adjunta.
- Estado de P09: completado.
| P09 — Estados | Completado: completar y reabrir la tarea ID 4, comprobar persistencia al recargar y rechazar estado inválido con 400. Evidencias adjuntas en el registro detallado. | Ninguno. |

#### Evidencia de reapertura

![Tarea reabierta en En progreso](evidencias/P09-tarea-reabierta.png)
#### Evidencia de tarea completada

![Tarea completada después de recargar](evidencias/P09-tarea-completada.png)
#### Evidencia de estado inválido

- Solicitud: GET /api/tasks?status=Invalid.
- Resultado esperado: 400 y mensaje de estado no permitido.
- Resultado observado: 400 con el mensaje
  "El estado debe ser Pending, InProgress o Completed.".
- La consulta no modifica datos.

![Estado inválido rechazado con 400](evidencias/P09-estado-invalido.png)
### P08 — Borrado y reasignación

- Proyecto temporal: ID 8.
- Responsable: Responsable temporal P08.
- Tarea temporal: ID 7.
- Resultado esperado: bloquear el borrado mientras existan tareas
  asociadas y permitirlo después de reasignarlas.
- Resultado observado:
  - React mostró el bloqueo al intentar eliminar el proyecto
    y el responsable con la tarea asociada.
  - La tarea ID 7 se reasignó a Prueba de cancelación y Luis Gómez.
  - Después se eliminaron el proyecto y el responsable temporales.
  - La tarea permaneció con sus nuevas relaciones.
  - Finalmente se eliminó la tarea temporal ID 7.
  - Al recargar, permanecieron las tres tareas originales.
- Estado: recorrido de borrado y reasignación comprobado.
- Códigos HTTP: el bloqueo 409 se verificó anteriormente en la API;
  no se capturó el código HTTP de las eliminaciones de esta sesión.
  #### P08 — Bloqueo con una única tarea completada

- Registros utilizados: tarea ID 8, proyecto ID 9 y responsable ID 8.
- La tarea estaba Completada y era la única asociada a ambos.
- DELETE del proyecto 9: 409.
- DELETE del responsable 8: 409.
- Después de eliminar la tarea 8 con respuesta 204:
  - DELETE del proyecto 9: 204.
  - DELETE del responsable 8: 204.
- Al recargar React, los registros temporales desaparecieron
  y permanecieron las tres tareas originales.
- Estado de P08: completado.

![Proyecto bloqueado con 409](evidencias/P08-proyecto-completada-409.png)

![Responsable bloqueado con 409](evidencias/P08-responsable-completada-409.png)

![Proyecto eliminado con 204](evidencias/P08-proyecto-sin-tareas-204.png)

![Responsable eliminado con 204](evidencias/P08-responsable-sin-tareas-204.png)