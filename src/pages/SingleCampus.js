import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SingleCampus = () => {
  const { id } = useParams(); // Get campus ID from the URL
  const [campus, setCampus] = useState(null); // Store campus details
  const [students, setStudents] = useState([]); // Store students enrolled at this campus
  const [error, setError] = useState(null); // Handle fetch errors
  const navigate = useNavigate(); // For navigation

  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gpa: "",
  }); // State for adding a new student
  const [existingStudents, setExistingStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  useEffect(() => {
    // Fetch campus details and students
    axios
      .get(`http://localhost:3001/api/campuses/${id}`)
      .then((response) => {
        setCampus(response.data);
        setStudents(response.data.Students || []); // Set enrolled students
      })
      .catch((error) => {
        console.error("Error fetching campus details:", error);
        setError("Failed to load campus details.");
      });

    // Fetch all existing students (for dropdown)
    axios
      .get("http://localhost:3001/api/students")
      .then((response) => {
        setExistingStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  }, [id]);

  const handleAddNewStudent = () => {
    // Create a new student and assign to the campus
    axios
      .post("http://localhost:3001/api/students", {
        ...newStudent,
        campusId: id,
      })
      .then((response) => {
        setStudents([...students, response.data]);
        setNewStudent({ firstName: "", lastName: "", email: "", gpa: "" }); // Reset form
      })
      .catch((error) => {
        console.error("Error adding student:", error);
      });
  };

  const handleAddExistingStudent = () => {
    // Update the selected student to assign to the campus
    axios
      .put(`http://localhost:3001/api/students/${selectedStudent}`, {
        campusId: id,
      })
      .then((response) => {
        setStudents([...students, response.data]);
        setSelectedStudent(""); // Reset dropdown
      })
      .catch((error) => {
        console.error("Error assigning student:", error);
      });
  };

  const handleDeleteCampus = () => {
    // Delete campus
    axios
      .delete(`http://localhost:3001/api/campuses/${id}`)
      .then(() => {
        navigate("/campuses"); // Redirect to All Campuses view
      })
      .catch((error) => {
        console.error("Error deleting campus:", error);
        setError("Failed to delete campus.");
      });
  };

  const handleRemoveStudent = (studentId) => {
    // Remove student from the campus
    axios
      .put(`http://localhost:3001/api/students/${studentId}`, {
        campusId: null,
      })
      .then(() => {
        setStudents(students.filter((student) => student.id !== studentId)); // Update local state
      })
      .catch((error) => {
        console.error("Error removing student:", error);
        setError("Failed to remove student.");
      });
  };

  if (error) {
    return <p>{error}</p>;
  }

  if (!campus) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{campus.name}</h1>
      <p>Address: {campus.address}</p>
      <p>Description: {campus.description}</p>
      <img src={campus.imageUrl} alt={campus.name} style={{ width: "300px" }} />

      <button onClick={handleDeleteCampus}>Delete Campus</button>
      <Link to={`/campuses/${id}/edit`}>Edit Campus</Link>

      <h2>Enrolled Students</h2>
      {students.length === 0 ? (
        <p>No students enrolled at this campus.</p>
      ) : (
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              <Link to={`/students/${student.id}`}>
                {student.firstName} {student.lastName}
              </Link>
              <button
                onClick={() => handleRemoveStudent(student.id)}
                style={{ marginLeft: "10px" }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <h3>Add a New Student</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddNewStudent();
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
        <button type="submit">Add Student</button>
      </form>

      <h3>Assign an Existing Student</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddExistingStudent();
        }}
      >
        <label>
          Select Student:
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">-- Select --</option>
            {existingStudents
              .filter((student) => !student.campusId) // Ensure only unassigned students are shown
              .map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
          </select>
        </label>
        <button type="submit">Assign Student</button>
      </form>
    </div>
  );
};

export default SingleCampus;
