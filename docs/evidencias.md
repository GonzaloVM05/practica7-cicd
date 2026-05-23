# Evidencias de la practica

Este documento indica las capturas recomendadas para justificar la practica de CI/CD.

## Repositorio GitHub

Captura la pagina principal del repositorio mostrando el nombre `practica7-cicd`, los archivos principales y la carpeta `.github/workflows`.

## Commits y ramas

Captura el historial de commits y, si se han usado ramas, la lista de branches o un pull request donde se vea el flujo de trabajo.

## Ejecucion por push

Captura una ejecucion del workflow iniciada automaticamente por un `push`. Debe verse el evento `push` en GitHub Actions.

## Ejecucion manual

Captura la ejecucion manual desde `workflow_dispatch`, incluyendo el parametro `environment` seleccionado.

## Ejecucion cron

Captura una ejecucion programada por `schedule` o la configuracion del cron en el workflow si aun no se ha ejecutado.

## Webhook repository_dispatch

Captura la peticion usada para lanzar `repository_dispatch` o la ejecucion del workflow donde aparezca ese evento. El tipo configurado es `deploy-webhook`.

## Jobs encadenados

Captura el grafo del workflow mostrando los jobs encadenados con `needs`: `lint`, `test`, `security_scan`, `build_and_push_docker`, `deploy`, `post_deploy_tests` y `notify`.

## Lint

Captura el job `lint` completado correctamente y el log donde aparezca `npm run lint`.

## Tests y cobertura

Captura el job `test` completado correctamente, el log de `npm run test:coverage` y el artefacto de cobertura generado.

## Build Docker

Captura el job `build_and_push_docker` mostrando la construccion de la imagen Alpine y la imagen Debian.

## Push Docker Hub

Captura los pasos `docker push` del workflow y la pagina de Docker Hub donde se vean las etiquetas `alpine` y `debian`.

## Despliegue por SSH

Captura el job `deploy` mostrando la conexion SSH y los comandos de despliegue: `docker pull`, parada del contenedor anterior y arranque del contenedor nuevo.

## Prueba post-despliegue

Captura el job `post_deploy_tests` con el `curl http://SERVER_HOST:3000/health` ejecutado correctamente.

## Notificacion email

Captura el job `notify` y el email recibido indicando el resultado del pipeline.

## Servidor funcionando

Captura el navegador o terminal accediendo a:

```text
http://SERVER_HOST:3000/health
```

La respuesta esperada es:

```json
{
  "status": "ok"
}
```
