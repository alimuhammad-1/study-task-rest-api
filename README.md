# Study Task REST API

A small REST API for managing study tasks. Built for the ORBIT Software Engineering task.

## Features

- Create, read, update, and delete study tasks
- Local in-memory data only
- Input validation
- Consistent JSON error responses
- Automated tests
- No real personal data

## Technology

- Node.js
- Express
- Jest
- Supertest

## Requirements

Node.js and npm.

Check with:

```bash
node --version
npm --version
```

## Installation

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd study-task-rest-api
npm install
```

## Run

```bash
npm start
```

API URL: http://localhost:3000

Data is stored in memory. Restarting the server resets the data.

## Tests

Run all tests with one command:

```bash
npm test
```

## API Endpoints

| Method | Endpoint | Purpose | Success |
|---|---|---|---|
| GET | `/` | API information | 200 |
| GET | `/tasks` | Get all tasks | 200 |
| GET | `/tasks/:id` | Get one task | 200 |
| POST | `/tasks` | Create a task | 201 |
| PUT | `/tasks/:id` | Update a task | 200 |
| DELETE | `/tasks/:id` | Delete a task | 200 |

## Request Examples

### Create

```http
POST /tasks
Content-Type: application/json
```

```json
{
  "title": "Study Node.js",
  "description": "Practice Express routes",
  "completed": false
}
```

Response: `201 Created`

```json
{
  "data": {
    "id": 4,
    "title": "Study Node.js",
    "description": "Practice Express routes",
    "completed": false
  }
}
```

### Update

```http
PUT /tasks/1
Content-Type: application/json
```

```json
{
  "completed": true
}
```

Response: `200 OK`

### Delete

```http
DELETE /tasks/1
```

Response: `200 OK`

```json
{
  "message": "Task deleted successfully.",
  "data": {
    "id": 1,
    "title": "Review REST API concepts",
    "description": "Read about HTTP methods and status codes.",
    "completed": true
  }
}
```

## Validation

For POST requests:

- `title` is required and must contain at least 3 characters.
- `description` is optional and must contain at most 500 characters.
- `completed` is optional and must be a boolean.
- Unknown fields are rejected.

For PUT requests:

- At least one field is required.
- The same field rules apply.
- Unknown fields are rejected.

Example invalid request:

```json
{
  "title": "Hi",
  "completed": "yes"
}
```

Response: `400 Bad Request`

```json
{
  "error": {
    "status": 400,
    "message": "Validation failed.",
    "details": [
      "title must be a string with at least 3 characters.",
      "completed must be a boolean."
    ]
  }
}
```

## Error Format

All API errors use this structure:

```json
{
  "error": {
    "status": 400,
    "message": "Validation failed.",
    "details": []
  }
}
```

## Status Code Choices

- `200 OK`: successful read, update, delete, or general request
- `201 Created`: a new task was created
- `400 Bad Request`: invalid JSON, invalid ID, or invalid input
- `404 Not Found`: route or task does not exist
- `500 Internal Server Error`: unexpected server error

## Why These HTTP Methods?

GET retrieves data.

POST creates a resource.

PUT updates an existing resource.

DELETE removes a resource.

## Testing

The test suite checks successful requests and failures for the main API operations. It uses Jest and Supertest.

```bash
npm test
```

## Five-Minute Setup

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd study-task-rest-api
npm install
npm test
npm start
```

Then open `http://localhost:3000`.

## Project Structure

```text
study-task-rest-api/
├── src/
│   └── server.js
├── tests/
│   └── tasks.test.js
├── .gitignore
├── package.json
└── README.md
```

## Example curl Requests

```bash
curl http://localhost:3000/tasks
```

```bash
curl http://localhost:3000/tasks/1
```

```bash
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d "{\"title\":\"Study Node.js\",\"description\":\"Practice Express routes\",\"completed\":false}"
```

```bash
curl -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d "{\"completed\":true}"
```

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## Author

Ali Muhammad Omonaziogbe
