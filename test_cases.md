# CodeCraftHub Node.js API Test Cases

Run the server first:

npm start

The API should run at:

http://localhost:5000

## 1. Health Check

curl -i http://localhost:5000/

Expected:

HTTP/1.1 200 OK

## 2. Create a Course

curl -i -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Python Basics",
    "description": "Learn Python fundamentals",
    "target_date": "2026-12-31",
    "status": "Not Started"
  }'

Expected:

HTTP/1.1 201 Created
Course created successfully

## 3. Get All Courses

curl -i http://localhost:5000/api/courses

Expected:

HTTP/1.1 200 OK
Courses retrieved successfully

## 4. Get Course Statistics

curl -i http://localhost:5000/api/courses/stats

Expected:

HTTP/1.1 200 OK

## 5. Get One Course

curl -i http://localhost:5000/api/courses/1

Expected:

HTTP/1.1 200 OK
Course retrieved successfully

## 6. Update a Course

curl -i -X PUT http://localhost:5000/api/courses/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Python Basics",
    "description": "Learn Python and Express API fundamentals",
    "target_date": "2026-12-31",
    "status": "In Progress"
  }'

Expected:

HTTP/1.1 200 OK
Course updated successfully

## 7. Delete a Course

curl -i -X DELETE http://localhost:5000/api/courses/1

Expected:

HTTP/1.1 200 OK
Course deleted successfully

## 8. Missing Fields Error

curl -i -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Incomplete Course"
  }'

Expected:

HTTP/1.1 400 Bad Request
Missing field(s)

## 9. Invalid Status Error

curl -i -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bad Status Course",
    "description": "Testing invalid status",
    "target_date": "2026-12-31",
    "status": "Started"
  }'

Expected:

HTTP/1.1 400 Bad Request
Invalid status

## 10. Invalid Date Format Error

curl -i -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Date Test",
    "description": "Testing invalid date format",
    "target_date": "12-31-2026",
    "status": "Not Started"
  }'

Expected:

HTTP/1.1 400 Bad Request
Invalid target_date

## 11. CORS Check

curl -i -X OPTIONS http://localhost:5000/api/courses

Expected:

HTTP/1.1 204 No Content
Access-Control-Allow-Origin: *
