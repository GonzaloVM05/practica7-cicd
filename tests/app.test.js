const request = require("supertest");
const { app, resetTasksForTests } = require("../src/app");

beforeEach(() => {
  resetTasksForTests();
});

describe("API de tareas", () => {
  test("GET / devuelve una pagina de estado", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toContain("text/html");
    expect(response.text).toContain("practica7-cicd");
    expect(response.text).toContain("Servidor funcionando");
  });

  test("GET /health devuelve status ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  test("GET /tasks devuelve una lista de tareas", async () => {
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
  });

  test("POST /tasks crea una tarea con title", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ title: "Crear pipeline" });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      id: 2,
      title: "Crear pipeline",
      completed: false
    });
  });

  test("POST /tasks valida que title sea obligatorio", async () => {
    const response = await request(app).post("/tasks").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "El campo title es obligatorio" });
  });

  test("PATCH /tasks/:id marca una tarea como completada", async () => {
    const response = await request(app).patch("/tasks/1");

    expect(response.status).toBe(200);
    expect(response.body.completed).toBe(true);
  });

  test("PATCH /tasks/:id devuelve 404 si la tarea no existe", async () => {
    const response = await request(app).patch("/tasks/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Tarea no encontrada" });
  });
});
