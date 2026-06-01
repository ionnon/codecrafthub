# CodeCraftHub Learning Management System

CodeCraftHub is a simple personalized learning platform for developers. It helps learners track courses they want to complete using a beginner-friendly Flask REST API.

The project stores data in a JSON file, so no database setup is required. It is designed for practicing REST API basics such as creating, reading, updating, and deleting resources.

## Features

- Add new courses with a target completion date
- View all saved courses
- View one course by ID
- View course statistics grouped by status
- Update course details and learning status
- Delete courses
- Store course data in `courses.json`
- Automatically create `courses.json` if it does not exist
- Validate required fields
- Validate allowed course status values
- Validate target dates in `YYYY-MM-DD` format
- Return helpful JSON error messages

## Project Structure

```text
codecrafthub/
├── app.py             # Main Flask REST API application
├── courses.json       # JSON data storage file, created automatically
├── requirements.txt   # Python package dependencies
├── test_cases.md      # Manual curl test cases
└── README.md          # Project documentation
```

## Installation

1. Open a terminal in the project folder.

2. Create a virtual environment:

```bash
python3 -m venv venv
```

3. Activate the virtual environment:

```bash
source venv/bin/activate
```

On Windows, use:

```bash
venv\Scripts\activate
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

## Running the Application

Start the Flask server:

```bash
python3 app.py
```

The API will be available at:

```text
http://127.0.0.1:5000
```

You can verify the server is running by opening:

```text
http://127.0.0.1:5000/
```

## Course Data Format

Each course has these fields:

```json
{
  "id": 1,
  "name": "Python Basics",
  "description": "Learn Python fundamentals",
  "target_date": "2026-12-31",
  "status": "Not Started",
  "created_at": "2026-06-01T10:30:00Z"
}
```

Allowed status values:

```text
Not Started
In Progress
Completed
```

The `target_date` field must use this format:

```text
YYYY-MM-DD
```

## API Endpoints

### 1. Health Check

```text
GET /
```

Example:

```bash
curl -i http://127.0.0.1:5000/
```

### 2. Add a Course

```text
POST /api/courses
```

Example:

```bash
curl -i -X POST http://127.0.0.1:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Python Basics",
    "description": "Learn Python fundamentals",
    "target_date": "2026-12-31",
    "status": "Not Started"
  }'
```

Expected successful status:

```text
201 CREATED
```

### 3. Get All Courses

```text
GET /api/courses
```

Example:

```bash
curl -i http://127.0.0.1:5000/api/courses
```

Expected successful status:

```text
200 OK
```

### 4. Get Course Statistics

```text
GET /api/courses/stats
```

Example:

```bash
curl -i http://127.0.0.1:5000/api/courses/stats
```

Expected successful status:

```text
200 OK
```

Example response:

```json
{
  "total_courses": 3,
  "by_status": {
    "Not Started": 1,
    "In Progress": 1,
    "Completed": 1
  }
}
```

### 5. Get One Course

```text
GET /api/courses/<id>
```

Example:

```bash
curl -i http://127.0.0.1:5000/api/courses/1
```

Expected successful status:

```text
200 OK
```

If the course does not exist, the API returns:

```json
{
  "error": "Course not found"
}
```

### 6. Update a Course

```text
PUT /api/courses/<id>
```

This API expects all required fields in the PUT request: `name`, `description`, `target_date`, and `status`.

Example:

```bash
curl -i -X PUT http://127.0.0.1:5000/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Python Basics",
    "description": "Learn Python and Flask API fundamentals",
    "target_date": "2026-12-31",
    "status": "In Progress"
  }'
```

Expected successful status:

```text
200 OK
```

### 7. Delete a Course

```text
DELETE /api/courses/<id>
```

Example:

```bash
curl -i -X DELETE http://127.0.0.1:5000/api/courses/1
```

Expected successful status:

```text
204 NO CONTENT
```

## Error Examples

### Missing Required Fields

```bash
curl -i -X POST http://127.0.0.1:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Incomplete Course"
  }'
```

Example response:

```json
{
  "error": "Missing field(s): description, target_date, status"
}
```

### Invalid Status

```bash
curl -i -X POST http://127.0.0.1:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bad Status Course",
    "description": "Testing invalid status",
    "target_date": "2026-12-31",
    "status": "Started"
  }'
```

Example response:

```json
{
  "error": "Invalid status. Use one of: Not Started, In Progress, Completed"
}
```

### Invalid Date Format

```bash
curl -i -X POST http://127.0.0.1:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Date Test",
    "description": "Testing invalid date format",
    "target_date": "12-31-2026",
    "status": "Not Started"
  }'
```

Example response:

```json
{
  "error": "Invalid target_date. Use format YYYY-MM-DD"
}
```

## Testing Instructions

Manual test cases are available in:

```text
test_cases.md
```

Run the application first:

```bash
python3 app.py
```

Then copy and paste the `curl` commands from `test_cases.md`.

Recommended testing order:

1. Create a course with `POST /api/courses`
2. Copy the returned `id`
3. Test `GET /api/courses/stats`
4. Use that `id` to test `GET /api/courses/<id>`
5. Use that `id` to test `PUT /api/courses/<id>`
6. Use that `id` to test `DELETE /api/courses/<id>`
7. Run the error test cases

## Troubleshooting

### Problem: Flask is not installed

Error example:

```text
ModuleNotFoundError: No module named 'flask'
```

Solution:

```bash
pip install -r requirements.txt
```

### Problem: Port 5000 is already in use

Solution: stop the other process using port 5000, or change the port in `app.py`.

Example:

```python
app.run(debug=True, port=5001)
```

### Problem: courses.json contains invalid JSON

Solution: open `courses.json` and make sure it contains valid JSON. For a clean empty file, use:

```json
[]
```

### Problem: API returns invalid status error

Solution: use exactly one of the allowed values:

```text
Not Started
In Progress
Completed
```

### Problem: API returns invalid date error

Solution: use the `YYYY-MM-DD` format, for example:

```text
2026-12-31
```
