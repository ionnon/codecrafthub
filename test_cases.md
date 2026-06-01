# CodeCraftHub API Test Cases

Base URL:

```bash
http://127.0.0.1:5000
```

## 1. Health Check

```bash
curl -i http://127.0.0.1:5000/
```

Expected status: `200 OK`

## 2. Create a Course

```bash
curl -i -X POST http://127.0.0.1:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Python Basics",
    "description": "Learn Python fundamentals including variables, loops, and functions",
    "target_date": "2026-12-31",
    "status": "Not Started"
  }'
```

Expected status: `201 CREATED`

Expected response includes:

```json
{
  "id": "auto-generated number",
  "name": "Python Basics",
  "description": "Learn Python fundamentals including variables, loops, and functions",
  "target_date": "2026-12-31",
  "status": "Not Started",
  "created_at": "auto-generated timestamp"
}
```

## 3. Get All Courses

```bash
curl -i http://127.0.0.1:5000/api/courses
```

Expected status: `200 OK`

Expected response: a JSON array of courses.

## 4. Get One Course

## 4. Get Course Statistics

```bash
curl -i http://127.0.0.1:5000/api/courses/stats
```

Expected status: `200 OK`

Expected response includes:

```json
{
  "total_courses": 1,
  "by_status": {
    "Not Started": 1,
    "In Progress": 0,
    "Completed": 0
  }
}
```

## 5. Get One Course

```bash
curl -i http://127.0.0.1:5000/api/courses/1
```

Expected status: `200 OK`

Expected response: one course object.

Note: if the created course has a different ID, replace `1` with the ID returned by the POST request.

## 6. Update a Course

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

Expected status: `200 OK`

Expected response includes `"status": "In Progress"`.

Note: if the created course has a different ID, replace `1` with the ID returned by the POST request.

## 7. Delete a Course

```bash
curl -i -X DELETE http://127.0.0.1:5000/api/courses/1
```

Expected status: `204 NO CONTENT`

Note: if the created course has a different ID, replace `1` with the ID returned by the POST request.

## 8. Error: Missing Required Fields

```bash
curl -i -X POST http://127.0.0.1:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Incomplete Course"
  }'
```

Expected status: `400 BAD REQUEST`

Expected response includes:

```json
{
  "error": "Missing field(s): description, target_date, status"
}
```

## 9. Error: Invalid Status

```bash
curl -i -X POST http://127.0.0.1:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Course",
    "description": "Testing invalid status",
    "target_date": "2026-12-31",
    "status": "Invalid Status"
  }'
```

Expected status: `400 BAD REQUEST`

Expected response includes:

```json
{
  "error": "Invalid status. Use one of: Not Started, In Progress, Completed"
}
```

## 10. Error: Invalid Date Format

```bash
curl -i -X POST http://127.0.0.1:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Date Test",
    "description": "Testing invalid date",
    "target_date": "12-31-2026",
    "status": "Not Started"
  }'
```

Expected status: `400 BAD REQUEST`

Expected response includes:

```json
{
  "error": "Invalid target_date. Use format YYYY-MM-DD"
}
```

## 11. Error: Course Not Found

```bash
curl -i http://127.0.0.1:5000/api/courses/999
```

Expected status: `404 NOT FOUND`

Expected response includes:

```json
{
  "error": "Course not found"
}
```
