const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, "courses.json");
const VALID_STATUSES = ["Not Started", "In Progress", "Completed"];

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

function ensureDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]");
  }
}

function readCourses() {
  try {
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, "utf8");
    if (!data.trim()) return [];

    const courses = JSON.parse(data);
    return Array.isArray(courses) ? courses : [];
  } catch (error) {
    throw new Error("Unable to read courses.json");
  }
}

function writeCourses(courses) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(courses, null, 2));
  } catch (error) {
    throw new Error("Unable to write courses.json");
  }
}

function nextId(courses) {
  if (courses.length === 0) return 1;
  return Math.max(...courses.map(course => Number(course.id) || 0)) + 1;
}

function missingFields(data) {
  const required = ["name", "description", "target_date", "status"];
  return required.filter(field => !data[field] || String(data[field]).trim() === "");
}

function validDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function validateCourse(data) {
  const missing = missingFields(data);

  if (missing.length > 0) {
    return `Missing field(s): ${missing.join(", ")}`;
  }

  if (!VALID_STATUSES.includes(data.status)) {
    return "Invalid status. Use one of: Not Started, In Progress, Completed";
  }

  if (!validDate(data.target_date)) {
    return "Invalid target_date. Use format YYYY-MM-DD";
  }

  return null;
}

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to CodeCraftHub API",
    description: "Personalized learning platform for developers",
    endpoints: {
      create_course: "POST /api/courses",
      get_all_courses: "GET /api/courses",
      get_one_course: "GET /api/courses/:id",
      update_course: "PUT /api/courses/:id",
      delete_course: "DELETE /api/courses/:id",
      get_stats: "GET /api/courses/stats"
    }
  });
});

app.get("/api/courses/stats", (req, res) => {
  try {
    const courses = readCourses();

    res.status(200).json({
      total_courses: courses.length,
      by_status: {
        "Not Started": courses.filter(course => course.status === "Not Started").length,
        "In Progress": courses.filter(course => course.status === "In Progress").length,
        "Completed": courses.filter(course => course.status === "Completed").length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/courses", (req, res) => {
  try {
    const courses = readCourses();

    res.status(200).json({
      message: "Courses retrieved successfully",
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/courses/:id", (req, res) => {
  try {
    const courses = readCourses();
    const courseId = Number(req.params.id);
    const course = courses.find(item => Number(item.id) === courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({
      message: "Course retrieved successfully",
      course
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/courses", (req, res) => {
  try {
    const courses = readCourses();
    const error = validateCourse(req.body);

    if (error) {
      return res.status(400).json({ error });
    }

    const course = {
      id: nextId(courses),
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      target_date: req.body.target_date.trim(),
      status: req.body.status.trim(),
      created_at: new Date().toISOString()
    };

    courses.push(course);
    writeCourses(courses);

    res.status(201).json({
      message: "Course created successfully",
      course
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/courses/:id", (req, res) => {
  try {
    const courses = readCourses();
    const courseId = Number(req.params.id);
    const index = courses.findIndex(item => Number(item.id) === courseId);

    if (index === -1) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updatedCourse = {
      ...courses[index],
      ...req.body,
      id: courses[index].id,
      created_at: courses[index].created_at
    };

    const error = validateCourse(updatedCourse);

    if (error) {
      return res.status(400).json({ error });
    }

    courses[index] = updatedCourse;
    writeCourses(courses);

    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/courses/:id", (req, res) => {
  try {
    const courses = readCourses();
    const courseId = Number(req.params.id);
    const deleteIndex = courses.findIndex(course => Number(course.id) === courseId);

    if (deleteIndex === -1) {
      return res.status(404).json({
        error: "Course not found"
      });
    }

    const deletedCourse = courses.splice(deleteIndex, 1)[0];
    writeCourses(courses);

    return res.status(200).json({
      message: "Course deleted successfully",
      course: deletedCourse
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `The route ${req.method} ${req.originalUrl} does not exist`
  });
});

ensureDataFile();

app.listen(PORT, () => {
  console.log("CodeCraftHub API is starting...");
  console.log(`Data will be stored in: ${DATA_FILE}`);
  console.log(`API is available at: http://localhost:${PORT}`);
});
