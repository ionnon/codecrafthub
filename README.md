# CodeCraftHub Learning Management System

CodeCraftHub is a simple personalized learning platform for developers. It helps learners track courses they want to complete using a beginner-friendly Node.js and Express REST API.

The project stores course data in a JSON file, so no database setup is required. It is designed for practicing REST API basics such as creating, reading, updating, and deleting resources.

## Features

- Add new courses with a target completion date
- View all saved courses
- View one course by ID
- View course statistics grouped by status
- Update course details and learning status
- Delete courses
- Store course data in courses.json
- Automatically create courses.json if it does not exist
- Validate required fields
- Validate allowed course status values
- Validate target dates in YYYY-MM-DD format
- Return helpful JSON error messages
- Enable CORS for browser-based frontend access

## Project Structure

codecrafthub/
├── app.js
├── package.json
├── package-lock.json
├── courses.json
├── test_cases.md
├── dashboard.html
└── README.md

## Installation

Install dependencies:

npm install

## Running the Application

Start the Express server:

npm start

The API will be available at:

http://localhost:5000

You can verify the server is running by opening:

http://localhost:5000/

## Course Data Format

Each course has these fields:

{
  "id": 1,
  "name": "Python Basics",
  "description": "Learn Python fundamentals",
  "target_date": "2026-12-31",
  "status": "Not Started",
  "created_at": "2026-07-07T17:34:57.043Z"
}

Allowed status values:

- Not Started
- In Progress
- Completed

The target_date field must use this format:

YYYY-MM-DD

## API Endpoints

### Health Check

GET /

Example:

curl -i http://localhost:5000/

### Add a Course

POST /api/courses

Example:

curl -i -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Python Basics",
    "description": "Learn Python fundamentals",
    "target_date": "2026-12-31",
    "status": "Not Started"
  }'

Expected successful status:

201 Created

### Get All Courses

GET /api/courses

Example:

curl -i http://localhost:5000/api/courses

Expected successful status:

200 OK

### Get Course Statistics

GET /api/courses/stats

Example:

curl -i http://localhost:5000/api/courses/stats

Expected successful status:

200 OK

### Get One Course

GET /api/courses/:id

Example:

curl -i http://localhost:5000/api/courses/1

Expected successful status:

200 OK

### Update a Course

PUT /api/courses/:id

Example:

curl -i -X PUT http://localhost:5000/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
5000/api/courses/1

Expected successful status:

200 OK

### Update a Course

PUT /api/courses/:id

Example:

curl -i -X PUT http://localhost:    "name": "Python Basics",
    "description": "Learn Python and Express API fundamentals",
    "target_date": "2026-12-31",
    "status": "In Progress"
  }'

Expected successful status:

200 OK

### Delete a Course

DELETE /api/courses/:id

Example:

curl -i -X DELETE http://localhost:5000/api/courses/1

Expected successful status:

200 OK

## Error Examples

### Missing Required Fields

curl -i -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Incomplete Course"
  }'

Expected:

400 Bad Request

### Invalid Status

curl -i -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bad Status Course",
    "description": "Testing invalid status",
    "target_date": "2026-12-31",
    "status": "Started"
  }'

Expected:

400 Bad Request

### Invalid Date Format

curl -i -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Date Test",
    "description": "Testing invalid date format",
    "target_date": "12-31-2026",
    "status": "Not Started"
  }'

Expected:

400 Bad Request

## CORS Check

curl -i -X OPTIONS http://localhost:5000/api/courses

Expected:

204 No Content
Access-Control-Allow-Origin: *

## Troubleshooting

If Express is not installed, run:

npm install

If port 5000 is already in use, stop the other process or change the port in app.js.

If courses.json contains invalid JSON, reset it to:

[]

If the API returns an invalid status error, use exactly one of:

- Not Started
- In Progress
- Completed

If the API returns an invalid date error, use the YYYY-MM-DD format, for example:

2026-12-31
