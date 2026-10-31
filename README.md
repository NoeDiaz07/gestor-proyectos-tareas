# Gestor de proyectos y tareas

Aplicación de aprendizaje desarrollada con React, ASP.NET Core y SQL Server para organizar proyectos, responsables y tareas.

Cada tarea pertenece a un proyecto y tiene un responsable asignado.

## Funcionalidades

- Crear, listar, consultar, editar y eliminar proyectos.
- Crear, listar, consultar, editar y eliminar responsables.
- Crear, listar, consultar, editar y eliminar tareas.
- Mostrar las tareas relacionadas en el detalle de proyectos y responsables.
- Filtrar tareas por proyecto, responsable y estado.
- Combinar filtros y limpiar la selección.
- Mostrar estados de carga, errores y confirmaciones.
- Actualizar los listados después de guardar o eliminar.
- Conservar los datos del formulario cuando falla el guardado.
- Navegar entre las secciones mediante un menú.
- Adaptar formularios y navegación a ventanas estrechas.

## Herramientas utilizadas

- Backend: C# y ASP.NET Core Web API, con destino net10.0.
- Persistencia: Entity Framework Core 10.0.13 y SQL Server.
- Frontend: React con Vite 8.3.4 y JavaScript.
- Estilos: CSS.
- Análisis del frontend: Oxlint.
- Pruebas: Swagger UI, navegador, SSMS y bloques de comprobación en PowerShell.
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
- `frontend/src/App.jsx`: integración de las secciones y menú de navegación.
- [docs/MODELO_DATOS.md](docs/MODELO_DATOS.md): campos, restricciones y relaciones.
- [docs/PRUEBAS.md](docs/PRUEBAS.md): resultados de las pruebas de aceptación.
- [docs/evidencias](docs/evidencias): capturas de las comprobaciones.
- [backend/AVANCES.md](backend/AVANCES.md): registro de avances.

## Requisitos para ejecutar

- SDK de .NET compatible con net10.0.
- Node.js y npm.
- SQL Server instalado y en ejecución.
- Git, si se descargará el repositorio mediante clonación.
- Herramienta dotnet-ef compatible con EF Core 10.0.13.

Visual Studio, Visual Studio Code y SSMS son las herramientas utilizadas durante el desarrollo.

Los comandos siguientes se ejecutan desde la carpeta principal del repositorio, `gestor-proyectos-tareas`, salvo que se indique otra ubicación.

## Preparación

Descargar o clonar el repositorio y abrir una terminal en su carpeta principal.

Restaurar las dependencias del backend:

```powershell
dotnet restore backend
```

Instalar las dependencias del frontend:

```powershell
npm.cmd --prefix frontend install
```

Los comandos del frontend se muestran con `npm.cmd` para PowerShell en Windows. En otros entornos puede utilizarse `npm`.

## Configuración de SQL Server

Revisar `ConnectionStrings:DefaultConnection` en `backend/appsettings.json` y, si existe una configuración específica de desarrollo, en `backend/appsettings.Development.json`.

En el entorno Development, los valores de `appsettings.Development.json` pueden reemplazar los del archivo general.

Ejemplo para SQL Server local con autenticación de Windows:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=GestorProyectosDb;Trusted_Connection=True;Encrypt=True;TrustServerCertificate=True;"
  }
}
```

Integrar esta sección en el archivo de configuración correspondiente; no reemplazar las demás opciones.

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

Desde la carpeta principal, crear o actualizar la base configurada:

```powershell
dotnet ef database update --project backend --startup-project backend
```

Este comando aplica las migraciones; no carga los datos de demostración.

También puede utilizarse `Update-Database` desde la Consola del Administrador de paquetes de Visual Studio, seleccionando GestorProyectos.Api como proyecto predeterminado.

### Verificación con una base separada

La instalación se comprobó utilizando una copia del repositorio y la base `GestorProyectosDb_Verificacion`, sin modificar la base original.

Para aplicar las migraciones a una base de verificación local:

```powershell
dotnet ef database update --project backend --startup-project backend --connection "Server=localhost;Database=GestorProyectosDb_Verificacion;Trusted_Connection=True;Encrypt=True;TrustServerCertificate=True;"
```

El argumento `--connection` afecta a ese comando de migración. Para ejecutar posteriormente la API contra la base de verificación, también debe configurarse esa conexión en la copia utilizada para la prueba.

## Iniciar la API

En Visual Studio:

1. Abrir `backend/GestorProyectos.Api.slnx`.
2. Seleccionar el perfil `http`.
3. Iniciar con el botón de ejecución.

Alternativa desde una terminal en la carpeta principal:

```powershell
dotnet run --project backend --launch-profile http
```

Para ejecutar mediante el runtime de .NET sin generar un ejecutable apphost:

```powershell
dotnet run --project backend --launch-profile http --property:UseAppHost=false
```

En el equipo de desarrollo se utilizó esta última alternativa tras un bloqueo del ejecutable por Control de aplicaciones de Windows. El inicio directo desde Visual Studio quedó pendiente de resolver.

Esperar a que aparezca:

```text
Now listening on: http://localhost:5008
```

Mantener esa terminal abierta mientras se utiliza la aplicación.

Direcciones locales:

- API: http://localhost:5008
- Swagger: http://localhost:5008/swagger
- Proyectos: http://localhost:5008/api/projects
- Responsables: http://localhost:5008/api/assignees
- Tareas: http://localhost:5008/api/tasks

Swagger está disponible en desarrollo.

Si el puerto 5008 está ocupado, detener la otra instancia de la API antes de iniciar una nueva.

## Iniciar React

En otra terminal, desde la carpeta principal:

```powershell
npm.cmd --prefix frontend run dev -- --port 5173 --strictPort
```

Abrir http://localhost:5173 y mantener la API ejecutándose.

La API y React necesitan ejecutarse simultáneamente, cada uno en su terminal.

La URL base de la API está definida en `frontend/src/services/api.js`.

CORS permite el origen `http://localhost:5173` en desarrollo. Si cambia el puerto del frontend, revisar esa configuración en `backend/Program.cs`.

La opción `--strictPort` hace que el inicio falle si 5173 está ocupado, en lugar de seleccionar automáticamente otro puerto.

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

Ejecutar estos comandos en una terminal diferente de las que mantienen la API y React en funcionamiento.

Build y lint no sustituyen las pruebas funcionales.

## Reglas principales

- Nombres y títulos obligatorios; no se aceptan valores vacíos ni compuestos solo por espacios.
- Se eliminan los espacios exteriores de nombres, títulos y descripciones.
- Nombre de proyecto o responsable: máximo 100 caracteres.
- Título de tarea: máximo 150 caracteres.
- Descripción: opcional, máximo 1000 caracteres.
- Correo obligatorio, válido y único, máximo 254 caracteres.
- El correo se normaliza eliminando espacios exteriores y convirtiéndolo a minúsculas.
- Una tarea nueva comienza en `Pending`.
- Al editar se permiten `Pending`, `InProgress` y `Completed`.
- Se permite reabrir una tarea completada.
- El proyecto y el responsable de una tarea deben existir.
- La fecha de inicio del proyecto y el vencimiento de la tarea son obligatorios.
- El vencimiento debe ser igual o posterior al inicio del proyecto.
- No puede cambiarse el inicio de un proyecto si deja tareas con vencimiento anterior.
- No se eliminan proyectos ni responsables con tareas asociadas, incluso si están completadas.
- Las fechas se intercambian sin hora, como `YYYY-MM-DD`.

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

- 400: datos inválidos o reglas de validación incumplidas.
- 404: registro inexistente.
- 409: correo duplicado o eliminación bloqueada por dependencias.

Ejemplo de filtros combinados:

```text
GET /api/tasks?projectId=17&assigneeId=12&status=Pending
```

Los filtros son opcionales y se combinan mediante AND.

Un estado desconocido devuelve 400. Una consulta válida sin coincidencias devuelve 200 con una lista vacía:

```json
[]
```

Los IDs del ejemplo corresponden a la base utilizada para la demostración y pueden variar en otra instalación.

## Pruebas y estado de entrega

Los casos de aceptación P01 a P12 están registrados como completados en [docs/PRUEBAS.md](docs/PRUEBAS.md), con sus resultados y referencias a evidencias.

Comprobaciones realizadas:

- CRUD de proyectos, responsables y tareas.
- Campos obligatorios, espacios, longitudes y formato del correo.
- Unicidad del correo electrónico.
- Validación de relaciones y fechas.
- Protección del borrado de proyectos y responsables con tareas.
- Estados de tareas, finalización y reapertura.
- Filtros individuales y combinados con los datos de demostración.
- Respuestas para registros inexistentes y fallos de conexión.
- Conservación de los formularios cuando falla el guardado.
- Persistencia tras recargar y reiniciar la API.
- Instalación en una copia separada con una base nueva y migraciones.

La instalación se verificó en el mismo equipo de desarrollo, sin modificar la base original. No representa una comprobación en otro equipo sin herramientas previamente instaladas.

El modelo de datos se documenta en [docs/MODELO_DATOS.md](docs/MODELO_DATOS.md).

Las capturas se encuentran en [docs/evidencias](docs/evidencias).

### Datos de demostración

Proyectos:

- Sitio corporativo.
- Portal interno.

Ambos tienen fecha de inicio `2026-10-01`.

Responsables:

- Ana: `ana@example.com`.
- Luis: `luis@example.com`.

| Tarea | Proyecto | Responsable | Estado | Vencimiento |
|---|---|---|---|---|
| Diseñar portada | Sitio corporativo | Ana | Pending | 2026-10-15 |
| Crear formulario | Sitio corporativo | Luis | InProgress | 2026-10-20 |
| Revisar textos | Sitio corporativo | Ana | Completed | 2026-10-12 |
| Listar proyectos | Portal interno | Luis | Pending | 2026-10-18 |
| Probar filtros | Portal interno | Ana | Pending | 2026-10-22 |

Estos datos se prepararon manualmente en la base de desarrollo.

Las migraciones no los insertan y sus IDs pueden variar entre instalaciones.

La base de desarrollo también puede contener registros de pruebas anteriores.

### Pendientes de cierre

- Revisar que los enlaces de documentación y evidencias funcionen.
- Preparar y ensayar la demostración final.
- Realizar la revisión final del repositorio y de la entrega.

### Autenticación adicional

El alcance original del PDF no incluye inicio de sesión.

La autenticación solicitada adicionalmente por el mentor todavía no está implementada y su alcance debe concretarse.

Los responsables son registros de personas, no cuentas de acceso.

## Detener la aplicación

- API desde Visual Studio: botón Detener.
- API o React desde una terminal: Ctrl + C en la terminal correspondiente.

Los registros guardados permanecen en SQL Server al detener la aplicación.
## Preparación de entrega completada

Se grabó la demostración final con una duración de 13 minutos
y 55 segundos.

Se confirmó la revisión del repositorio, documentación,
diagrama de datos, registro de pruebas y enlaces de evidencias.

El alcance original queda preparado para evaluación del mentor.

Observaciones:
- La API se ejecuta desde terminal con UseAppHost=false.
- Sigue pendiente resolver el inconveniente de inicio desde Visual Studio.
- La autenticación adicional requiere concretar su alcance con el mentor.