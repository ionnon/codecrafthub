from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import os
import json
import datetime

app = Flask(__name__)
CORS(app)

COURSES_FILE = 'courses.json'
REQUIRED_FIELDS = ['name', 'description', 'target_date', 'status']
VALID_STATUSES = ['Not Started', 'In Progress', 'Completed']


def load_courses():
    """Load courses from the JSON file and create the file if needed."""
    if not os.path.exists(COURSES_FILE):
        save_courses([])
        return []

    try:
        with open(COURSES_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if isinstance(data, list):
                return data
            return []
    except json.JSONDecodeError as exc:
        raise ValueError('courses.json contains invalid JSON') from exc
    except IOError as exc:
        raise IOError('Unable to read courses.json') from exc


def save_courses(courses):
    """Save the list of courses to the JSON file."""
    try:
        with open(COURSES_FILE, 'w', encoding='utf-8') as f:
            json.dump(courses, f, indent=4)
    except IOError as exc:
        raise IOError('Unable to write courses.json') from exc


def generate_id(courses):
    """Generate a new integer ID based on existing data."""
    if not courses:
        return 1

    max_id = max((course.get('id', 0) for course in courses))
    return int(max_id) + 1


def current_iso():
    """Return current UTC time in ISO format."""
    return datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')


def find_course(courses, course_id):
    """Find a course by id."""
    for course in courses:
        if str(course.get('id')) == str(course_id):
            return course
    return None


def error_response(message, status_code=400):
    """Standard JSON error response."""
    response = jsonify({'error': message})
    return response, status_code


def safe_load_courses():
    """Load courses and convert file errors into API responses."""
    try:
        return load_courses(), None
    except (IOError, ValueError) as exc:
        return None, error_response(str(exc), 500)


def safe_save_courses(courses):
    """Save courses and convert file errors into API responses."""
    try:
        save_courses(courses)
        return None
    except IOError as exc:
        return error_response(str(exc), 500)


def validate_course_payload(payload):
    """Validate required course fields and status value."""
    if not payload:
        return 'Request body must be JSON'

    missing = [field for field in REQUIRED_FIELDS if field not in payload]
    if missing:
        return f"Missing field(s): {', '.join(missing)}"

    if payload['status'] not in VALID_STATUSES:
        return f"Invalid status. Use one of: {', '.join(VALID_STATUSES)}"

    try:
        datetime.datetime.strptime(payload['target_date'], '%Y-%m-%d')
    except (TypeError, ValueError):
        return 'Invalid target_date. Use format YYYY-MM-DD'

    return None


@app.route('/', methods=['GET'])
def home():
    """Simple health check for browser testing."""
    return jsonify({
        'message': 'CodeCraftHub API is running',
        'endpoints': [
            'POST /api/courses',
            'GET /api/courses',
            'GET /api/courses/stats',
            'GET /api/courses/<id>',
            'PUT /api/courses/<id>',
            'DELETE /api/courses/<id>'
        ]
    })


@app.route('/api/courses', methods=['POST'])
def create_course():
    """Create a new course."""
    payload = request.get_json(silent=True)
    validation_error = validate_course_payload(payload)
    if validation_error:
        return error_response(validation_error, 400)

    courses, load_error = safe_load_courses()
    if load_error:
        return load_error

    course = {
        'id': generate_id(courses),
        'name': payload['name'],
        'description': payload['description'],
        'target_date': payload['target_date'],
        'status': payload['status'],
        'created_at': current_iso()
    }

    courses.append(course)
    save_error = safe_save_courses(courses)
    if save_error:
        return save_error

    return make_response(jsonify(course), 201)


@app.route('/api/courses', methods=['GET'])
def get_courses():
    """Get all courses."""
    courses, load_error = safe_load_courses()
    if load_error:
        return load_error

    return jsonify(courses)


@app.route('/api/courses/stats', methods=['GET'])
def get_course_stats():
    """Get course counts grouped by status."""
    courses, load_error = safe_load_courses()
    if load_error:
        return load_error

    status_counts = {status: 0 for status in VALID_STATUSES}
    for course in courses:
        status = course.get('status')
        if status in status_counts:
            status_counts[status] += 1

    return jsonify({
        'total_courses': len(courses),
        'by_status': status_counts
    })


@app.route('/api/courses/<course_id>', methods=['GET'])
def get_course(course_id):
    """Get a single course by ID."""
    courses, load_error = safe_load_courses()
    if load_error:
        return load_error

    course = find_course(courses, course_id)
    if not course:
        return error_response('Course not found', 404)

    return jsonify(course)


@app.route('/api/courses/<course_id>', methods=['PUT'])
def update_course(course_id):
    """Update an existing course by ID."""
    payload = request.get_json(silent=True)
    validation_error = validate_course_payload(payload)
    if validation_error:
        return error_response(validation_error, 400)

    courses, load_error = safe_load_courses()
    if load_error:
        return load_error

    course = find_course(courses, course_id)
    if not course:
        return error_response('Course not found', 404)

    updated_course = {
        'id': course['id'],
        'name': payload['name'],
        'description': payload['description'],
        'target_date': payload['target_date'],
        'status': payload['status'],
        'created_at': course.get('created_at', current_iso())
    }

    index = courses.index(course)
    courses[index] = updated_course
    save_error = safe_save_courses(courses)
    if save_error:
        return save_error

    return jsonify(updated_course)


@app.route('/api/courses/<course_id>', methods=['DELETE'])
def delete_course(course_id):
    """Delete a course by ID."""
    courses, load_error = safe_load_courses()
    if load_error:
        return load_error

    course = find_course(courses, course_id)
    if not course:
        return error_response('Course not found', 404)

    courses = [c for c in courses if str(c.get('id')) != str(course_id)]
    save_error = safe_save_courses(courses)
    if save_error:
        return save_error

    return '', 204


if __name__ == '__main__':
    app.run(debug=True)
