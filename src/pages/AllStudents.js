import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gpa: "",
    campusId: null, // Initialize as null
  });
  const [campuses, setCampuses] = useState([]); // For dropdown
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Fetch students
    axios
      .get("http://localhost:3001/api/students")
      .then((response) => setStudents(response.data))
      .catch((error) => console.error("Error fetching students:", error));

    // Fetch campuses for dropdown
    axios
      .get("http://localhost:3001/api/campuses")
      .then((response) => setCampuses(response.data))
      .catch((error) => console.error("Error fetching campuses:", error));
  }, []);

  const handleAddStudent = () => {
    const studentToAdd = {
      ...newStudent,
      campusId: newStudent.campusId || null, // Ensure campusId is null if not selected
    };

    axios
      .post("http://localhost:3001/api/students", studentToAdd)
      .then((response) => {
        setStudents([...students, response.data]);
        setNewStudent({
          firstName: "",
          lastName: "",
          email: "",
          gpa: "",
          campusId: null, // Reset to null
        });
        setShowForm(false);
      })
      .catch((error) => console.error("Error adding student:", error));
  };

  const handleDeleteStudent = (id) => {
    axios
      .delete(`http://localhost:3001/api/students/${id}`)
      .then(() => setStudents(students.filter((student) => student.id !== id)))
      .catch((error) => console.error("Error deleting student:", error));
  };

  return (
    <div>
      <h1>All Students</h1>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add Student"}
      </button>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddStudent();
          }}
        >
          <label>
            First Name:
            <input
              type="text"
              value={newStudent.firstName}
              onChange={(e) =>
                setNewStudent({ ...newStudent, firstName: e.target.value })
              }
              required
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              value={newStudent.lastName}
              onChange={(e) =>
                setNewStudent({ ...newStudent, lastName: e.target.value })
              }
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              value={newStudent.email}
              onChange={(e) =>
                setNewStudent({ ...newStudent, email: e.target.value })
              }
              required
            />
          </label>
          <label>
            GPA:
            <input
              type="number"
              step="0.1"
              min="0"
              max="4"
              value={newStudent.gpa}
              onChange={(e) =>
                setNewStudent({ ...newStudent, gpa: e.target.value })
              }
            />
          </label>
          <label>
            Campus:
            <select
              value={newStudent.campusId || ""}
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  campusId: e.target.value ? parseInt(e.target.value) : null,
                })
              }
            >
              <option value="">-- None --</option>
              {campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Add Student</button>
        </form>
      )}

      <ul>
        {students.length === 0 ? (
          <p>No students available</p>
        ) : (
          students.map((student) => (
            <li key={student.id}>
              <Link to={`/students/${student.id}`}>
                {student.firstName} {student.lastName}
              </Link>
              <button onClick={() => handleDeleteStudent(student.id)}>
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AllStudents;
