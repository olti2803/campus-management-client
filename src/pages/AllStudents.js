import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudents } from "../redux/studentsSlice"; // Redux action for fetching students
import axios from "axios";
import "../styles/AllStudents.css";

const AllStudents = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.students.items); // Students from Redux state
  const studentsStatus = useSelector((state) => state.students.status); // Fetching status from Redux

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
    if (studentsStatus === "idle") {
      dispatch(fetchStudents());
    }
    axios
      .get("http://localhost:3001/api/campuses")
      .then((response) => setCampuses(response.data))
      .catch((error) => console.error("Error fetching campuses:", error));
  }, [dispatch, studentsStatus]);

  const handleAddStudent = () => {
    const studentToAdd = {
      ...newStudent,
      campusId: newStudent.campusId || null,
    };

    axios
      .post("http://localhost:3001/api/students", studentToAdd)
      .then(() => {
        setNewStudent({
          firstName: "",
          lastName: "",
          email: "",
          gpa: "",
          campusId: null,
        });
        setShowForm(false);
        dispatch(fetchStudents());
      })
      .catch((error) => console.error("Error adding student:", error));
  };

  const handleDeleteStudent = (id) => {
    axios
      .delete(`http://localhost:3001/api/students/${id}`)
      .then(() => dispatch(fetchStudents()))
      .catch((error) => console.error("Error deleting student:", error));
  };

  return (
    <div className="all-students-container">
      <div className="all-students-header">
        <h1 className="all-students-title">All Students</h1>
        <button
          className="add-student-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add Student"}
        </button>
      </div>

      {showForm && (
        <form
          className="add-student-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddStudent();
          }}
        >
          <label>First Name:</label>
          <input
            type="text"
            value={newStudent.firstName}
            onChange={(e) =>
              setNewStudent({ ...newStudent, firstName: e.target.value })
            }
            required
          />
          <label>Last Name:</label>
          <input
            type="text"
            value={newStudent.lastName}
            onChange={(e) =>
              setNewStudent({ ...newStudent, lastName: e.target.value })
            }
            required
          />
          <label>Email:</label>
          <input
            type="email"
            value={newStudent.email}
            onChange={(e) =>
              setNewStudent({ ...newStudent, email: e.target.value })
            }
            required
          />
          <label>GPA:</label>
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
          <label>Campus:</label>
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
          <button type="submit">Add Student</button>
        </form>
      )}

      <ul className="student-list">
        {studentsStatus === "loading" ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No students available</p>
        ) : (
          students.map((student) => (
            <li className="student-item" key={student.id}>
              <h2 className="student-name">
                <Link to={`/students/${student.id}`}>
                  {student.firstName} {student.lastName}
                </Link>
              </h2>
              <p className="student-email">{student.email}</p>
              <div className="student-actions">
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteStudent(student.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AllStudents;
