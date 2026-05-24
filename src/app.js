const express = require("express");

const app = express();

app.use(express.json());

let tasks = [
  {
    id: 1,
    title: "Preparar practica CI/CD",
    completed: false
  }
];
let nextId = 2;

app.get("/", (req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>practica7-cicd</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: #f4f7fb;
        color: #172033;
      }

      main {
        max-width: 760px;
        margin: 0 auto;
        padding: 48px 20px;
      }

      h1 {
        margin-bottom: 8px;
      }

      .status {
        display: inline-block;
        margin: 16px 0 24px;
        padding: 8px 12px;
        border-radius: 6px;
        background: #dff7e8;
        color: #12662f;
        font-weight: 700;
      }

      ul {
        padding-left: 20px;
      }

      code {
        background: #e9eef7;
        padding: 2px 6px;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>practica7-cicd</h1>
      <p>API REST desplegada automaticamente con GitHub Actions, Docker Hub y un VPS.</p>
      <span class="status">Servidor funcionando</span>
      <h2>Endpoints disponibles</h2>
      <ul>
        <li><code>GET /health</code> comprueba el estado del servicio.</li>
        <li><code>GET /tasks</code> devuelve la lista de tareas.</li>
        <li><code>POST /tasks</code> crea una tarea con <code>title</code>.</li>
        <li><code>PATCH /tasks/:id</code> marca una tarea como completada.</li>
      </ul>
    </main>
  </body>
</html>`);
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/tasks", (req, res) => {
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "El campo title es obligatorio" });
  }

  const task = {
    id: nextId,
    title,
    completed: false
  };

  nextId += 1;
  tasks.push(task);

  return res.status(201).json(task);
});

app.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  task.completed = true;

  return res.json(task);
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

function resetTasksForTests() {
  tasks = [
    {
      id: 1,
      title: "Preparar practica CI/CD",
      completed: false
    }
  ];
  nextId = 2;
}

module.exports = {
  app,
  resetTasksForTests
};
