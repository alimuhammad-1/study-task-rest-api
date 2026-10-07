const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "10kb" }));

let nextId = 4;
let tasks = [
  { id: 1, title: "Review REST API concepts", description: "Read about HTTP methods and status codes.", completed: false },
  { id: 2, title: "Practice Express routing", description: "Create GET and POST routes.", completed: true },
  { id: 3, title: "Write API tests", description: "Test successful and invalid requests.", completed: false }
];

function errorResponse(res, status, message, details = []) {
  return res.status(status).json({ error: { status, message, details } });
}

function validateTask(body) {
  const errors = [];
  if (typeof body !== "object" || body === null || Array.isArray(body)) return ["Request body must be a JSON object."];
  if (typeof body.title !== "string" || body.title.trim().length < 3) errors.push("title must be a string with at least 3 characters.");
  if (body.description !== undefined && (typeof body.description !== "string" || body.description.trim().length > 500)) errors.push("description must be a string with a maximum of 500 characters.");
  if (body.completed !== undefined && typeof body.completed !== "boolean") errors.push("completed must be a boolean.");
  const unknownFields = Object.keys(body).filter(k => !["title", "description", "completed"].includes(k));
  if (unknownFields.length) errors.push(`Unknown field(s): ${unknownFields.join(", ")}.`);
  return errors;
}

function validateUpdate(body) {
  const errors = [];
  if (typeof body !== "object" || body === null || Array.isArray(body)) return ["Request body must be a JSON object."];
  const allowed = ["title", "description", "completed"];
  const fields = Object.keys(body);
  if (!fields.length) errors.push("At least one field is required for an update.");
  const unknown = fields.filter(k => !allowed.includes(k));
  if (unknown.length) errors.push(`Unknown field(s): ${unknown.join(", ")}.`);
  if ("title" in body && (typeof body.title !== "string" || body.title.trim().length < 3)) errors.push("title must be a string with at least 3 characters.");
  if ("description" in body && (typeof body.description !== "string" || body.description.trim().length > 500)) errors.push("description must be a string with a maximum of 500 characters.");
  if ("completed" in body && typeof body.completed !== "boolean") errors.push("completed must be a boolean.");
  return errors;
}

function getTaskId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

app.get("/", (req, res) => res.json({ name: "Study Task REST API", version: "1.0.0", message: "API is running.", documentation: "See README.md for the API specification." }));

app.get("/tasks", (req, res) => res.status(200).json({ data: tasks, count: tasks.length }));

app.get("/tasks/:id", (req, res) => {
  const id = getTaskId(req.params.id);
  if (id === null) return errorResponse(res, 400, "Invalid task ID.", ["The task ID must be a positive integer."]);
  const task = tasks.find(item => item.id === id);
  if (!task) return errorResponse(res, 404, "Task not found.");
  return res.status(200).json({ data: task });
});

app.post("/tasks", (req, res) => {
  const errors = validateTask(req.body);
  if (errors.length) return errorResponse(res, 400, "Validation failed.", errors);
  const task = {
    id: nextId++,
    title: req.body.title.trim(),
    description: req.body.description === undefined ? "" : req.body.description.trim(),
    completed: req.body.completed === undefined ? false : req.body.completed
  };
  tasks.push(task);
  return res.status(201).json({ data: task });
});

app.put("/tasks/:id", (req, res) => {
  const id = getTaskId(req.params.id);
  if (id === null) return errorResponse(res, 400, "Invalid task ID.", ["The task ID must be a positive integer."]);
  const index = tasks.findIndex(item => item.id === id);
  if (index === -1) return errorResponse(res, 404, "Task not found.");
  const errors = validateUpdate(req.body);
  if (errors.length) return errorResponse(res, 400, "Validation failed.", errors);
  tasks[index] = {
    ...tasks[index],
    ...(req.body.title !== undefined ? { title: req.body.title.trim() } : {}),
    ...(req.body.description !== undefined ? { description: req.body.description.trim() } : {}),
    ...(req.body.completed !== undefined ? { completed: req.body.completed } : {})
  };
  return res.status(200).json({ data: tasks[index] });
});

app.delete("/tasks/:id", (req, res) => {
  const id = getTaskId(req.params.id);
  if (id === null) return errorResponse(res, 400, "Invalid task ID.", ["The task ID must be a positive integer."]);
  const index = tasks.findIndex(item => item.id === id);
  if (index === -1) return errorResponse(res, 404, "Task not found.");
  const deleted = tasks.splice(index, 1)[0];
  return res.status(200).json({ message: "Task deleted successfully.", data: deleted });
});

app.use((req, res) => errorResponse(res, 404, "Route not found.", [`No route exists for ${req.method} ${req.originalUrl}.`]));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) return errorResponse(res, 400, "Invalid JSON.", ["Request body must contain valid JSON."]);
  console.error(err);
  return errorResponse(res, 500, "Internal server error.");
});

if (require.main === module) app.listen(PORT, () => console.log(`Study Task REST API running at http://localhost:${PORT}`));
module.exports = app;
