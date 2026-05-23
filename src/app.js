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
