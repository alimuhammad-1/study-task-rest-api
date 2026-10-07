const request = require("supertest");
const app = require("../src/server");

describe("Study Task REST API", () => {
  test("GET / returns API information", async () => {
    const r = await request(app).get("/");
    expect(r.statusCode).toBe(200);
    expect(r.body.name).toBe("Study Task REST API");
  });
  test("GET /tasks returns all tasks", async () => {
    const r = await request(app).get("/tasks");
    expect(r.statusCode).toBe(200);
    expect(Array.isArray(r.body.data)).toBe(true);
    expect(r.body.count).toBe(r.body.data.length);
  });
  test("GET /tasks/:id returns one task", async () => {
    const r = await request(app).get("/tasks/1");
    expect(r.statusCode).toBe(200);
    expect(r.body.data.id).toBe(1);
  });
  test("GET /tasks/:id returns 404 for a missing task", async () => {
    const r = await request(app).get("/tasks/99999");
    expect(r.statusCode).toBe(404);
    expect(r.body.error.message).toBe("Task not found.");
  });
  test("POST /tasks creates a task", async () => {
    const r = await request(app).post("/tasks").send({ title: "Learn API testing", description: "Write automated tests.", completed: false });
    expect(r.statusCode).toBe(201);
    expect(r.body.data.title).toBe("Learn API testing");
    expect(r.body.data.id).toEqual(expect.any(Number));
  });
  test("POST /tasks rejects invalid input", async () => {
    const r = await request(app).post("/tasks").send({ title: "Hi", completed: "no" });
    expect(r.statusCode).toBe(400);
    expect(r.body.error.message).toBe("Validation failed.");
    expect(r.body.error.details.length).toBeGreaterThan(0);
  });
  test("PUT /tasks/:id updates a task", async () => {
    const r = await request(app).put("/tasks/1").send({ completed: true });
    expect(r.statusCode).toBe(200);
    expect(r.body.data.completed).toBe(true);
  });
  test("DELETE /tasks/:id deletes a task", async () => {
    const r = await request(app).delete("/tasks/3");
    expect(r.statusCode).toBe(200);
    expect(r.body.message).toBe("Task deleted successfully.");
  });
  test("Unknown routes return a consistent 404 error", async () => {
    const r = await request(app).get("/unknown-route");
    expect(r.statusCode).toBe(404);
    expect(r.body.error.status).toBe(404);
    expect(r.body.error.message).toBe("Route not found.");
  });
  test("Invalid JSON returns a 400 error", async () => {
    const r = await request(app).post("/tasks").set("Content-Type", "application/json").send('{"title":');
    expect(r.statusCode).toBe(400);
    expect(r.body.error.message).toBe("Invalid JSON.");
  });
});
