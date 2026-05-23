# practica7-cicd

API REST sencilla con Node.js y Express para una practica de CI/CD. No usa base de datos: las tareas se guardan en memoria mientras la aplicacion esta arrancada.

## Objetivo de la practica

El objetivo es demostrar un flujo CI/CD completo con GitHub Actions: analisis de codigo, tests con cobertura, escaneo de seguridad, construccion de imagenes Docker, publicacion en Docker Hub, despliegue por SSH, prueba post-despliegue y notificacion por email.

## Estructura del proyecto

```text
practica7-cicd/
├── src/
│   ├── app.js
│   └── server.js
├── tests/
│   └── app.test.js
├── Dockerfile.alpine
├── Dockerfile.debian
├── docker-compose.yml
├── package.json
├── eslint.config.js
├── README.md
├── docs/
│   └── evidencias.md
└── .github/
    └── workflows/
        └── pipeline.yml
```

## Endpoints

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/health` | Devuelve `{ "status": "ok" }`. |
| GET | `/tasks` | Devuelve la lista de tareas en memoria. |
| POST | `/tasks` | Crea una tarea. Recibe JSON con `title`. |
| PATCH | `/tasks/:id` | Marca la tarea indicada como `completed: true`. |

Ejemplo para crear una tarea:

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Crear pipeline"}'
```

## Ejecucion local

```bash
npm install
npm start
```

La API queda disponible en `http://localhost:3000`.

Comandos utiles:

```bash
npm test
npm run test:coverage
npm run lint
```

## Ejecucion con Docker

Con Docker Compose:

```bash
docker compose up --build
```

Construccion manual de la imagen Alpine:

```bash
docker build -f Dockerfile.alpine -t practica7-cicd:alpine .
docker run --rm -p 3000:3000 practica7-cicd:alpine
```

Construccion manual de la imagen Debian:

```bash
docker build -f Dockerfile.debian -t practica7-cicd:debian .
docker run --rm -p 3000:3000 practica7-cicd:debian
```

## Pipeline CI/CD

El workflow `.github/workflows/pipeline.yml` define jobs encadenados con `needs`:

1. `lint`: instala dependencias y ejecuta ESLint.
2. `test`: ejecuta Jest con cobertura y sube el informe como artefacto.
3. `security_scan`: escanea el repositorio con Trivy.
4. `build_and_push_docker`: construye las imagenes Alpine y Debian y las sube a Docker Hub.
5. `deploy`: se conecta por SSH al servidor, descarga la imagen, para el contenedor anterior y arranca uno nuevo en el puerto 3000.
6. `post_deploy_tests`: ejecuta un `curl` contra `/health`.
7. `notify`: envia un email tanto si el pipeline termina correctamente como si falla.

## Triggers del pipeline

El pipeline se puede ejecutar de cuatro formas:

- `push`: se lanza automaticamente al subir cambios al repositorio.
- `workflow_dispatch`: permite ejecucion manual desde GitHub Actions con el parametro `environment`.
- `schedule`: ejecuta el workflow de forma programada mediante cron.
- `repository_dispatch`: permite lanzar el workflow desde un webhook externo de tipo `deploy-webhook`.

## Imagenes Docker

El proyecto incluye dos Dockerfiles para el mismo software:

- `Dockerfile.alpine`: usa `node:20-alpine`, una base ligera basada en Alpine Linux.
- `Dockerfile.debian`: usa `node:20-bookworm-slim`, una base Debian reducida.

Ambas imagenes instalan dependencias de produccion con `npm ci --omit=dev`, copian el codigo de `src`, exponen el puerto 3000 y arrancan con `npm start`.

## Despliegue

El job `deploy` usa SSH para entrar en el servidor configurado en los secrets. En el servidor ejecuta:

- `docker pull` de la imagen publicada en Docker Hub.
- `docker stop` y `docker rm` del contenedor anterior si existe.
- `docker run -d` para arrancar el nuevo contenedor en `SERVER_HOST:3000`.

La imagen desplegada por defecto es la Alpine.

## Secrets necesarios

Configura estos secrets en GitHub:

| Secret | Uso |
| --- | --- |
| `DOCKERHUB_USERNAME` | Usuario de Docker Hub y namespace de las imagenes. |
| `DOCKERHUB_TOKEN` | Token para iniciar sesion y subir imagenes a Docker Hub. |
| `SERVER_HOST` | IP o dominio del servidor de despliegue. |
| `SERVER_USER` | Usuario SSH del servidor. |
| `SERVER_SSH_KEY` | Clave privada SSH para conectar al servidor. |
| `SMTP_SERVER` | Servidor SMTP para notificaciones. |
| `SMTP_PORT` | Puerto SMTP. |
| `SMTP_USERNAME` | Usuario SMTP y remitente del email. |
| `SMTP_PASSWORD` | Password o token SMTP. |
| `NOTIFY_EMAIL` | Email destinatario de la notificacion. |
