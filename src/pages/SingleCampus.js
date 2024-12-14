import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../styles/SingleCampus.css";

import {
  fetchSingleCampus,
  selectCampus,
  selectCampusStudents,
  deleteCampus,
  addStudentToCampus,
  removeStudentFromCampus,
} from "../redux/campusesSlice";
import {
  fetchStudents,
  selectUnassignedStudents,
  addStudent,
} from "../redux/studentsSlice";

const SingleCampus = () => {
  const { id } = useParams(); // Get campus ID from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const campus = useSelector(selectCampus);
  const students = useSelector(selectCampusStudents);
  const unassignedStudents = useSelector(selectUnassignedStudents);

  // Local state for adding students
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gpa: "",
  });
  const [selectedStudent, setSelectedStudent] = useState("");

  useEffect(() => {
    dispatch(fetchSingleCampus(id)); // Fetch campus details
    dispatch(fetchStudents()); // Fetch all students for dropdown
  }, [dispatch, id]);

  const handleDeleteCampus = () => {
    dispatch(deleteCampus(id))
      .unwrap()
      .then(() => navigate("/campuses"))
      .catch((error) => console.error("Error deleting campus:", error));
  };

  const handleAddNewStudent = () => {
    dispatch(addStudent({ ...newStudent, campusId: id }))
      .unwrap()
      .then(() => {
        setNewStudent({ firstName: "", lastName: "", email: "", gpa: "" }); // Reset form
        dispatch(fetchSingleCampus(id)); // Refresh campus details
      })
      .catch((error) => console.error("Error adding student:", error));
  };

  const handleAddExistingStudent = () => {
    if (selectedStudent) {
      dispatch(addStudentToCampus({ id: selectedStudent, campusId: id }))
        .unwrap()
        .then(() => {
          setSelectedStudent(""); // Reset dropdown
          dispatch(fetchSingleCampus(id)); // Refresh campus details
        })
        .catch((error) => console.error("Error assigning student:", error));
    }
  };

  const handleRemoveStudent = (studentId) => {
    dispatch(removeStudentFromCampus({ studentId, campusId: null }))
      .unwrap()
      .then(() => dispatch(fetchSingleCampus(id))) // Refresh campus details
      .catch((error) => console.error("Error removing student:", error));
  };

  if (!campus) {
    return <p>Loading...</p>;
  }

  return (
    <div className="single-campus-container">
      <div className="campus-header">
        <h1 className="campus-title">{campus.name}</h1>
        <div className="campus-actions">
          <button className="delete-btn" onClick={handleDeleteCampus}>
            Delete Campus
          </button>
          <Link to={`/campuses/${id}/edit`} className="edit-btn">
            Edit Campus
          </Link>
        </div>
      </div>
      <img src={campus.imageUrl} alt={campus.name} className="campus-image" />
      <div className="campus-details">
        <p className="campus-address">Address: {campus.address}</p>
        <p className="campus-description">Description: {campus.description}</p>
      </div>

      <div className="enrolled-students">
        <h2>Enrolled Students</h2>
        {students.length === 0 ? (
          <p>No students enrolled at this campus.</p>
        ) : (
          <div className="student-list">
            {students.map((student) => (
              <div key={student.id} className="student-item">
                <Link to={`/students/${student.id}`} className="student-name">
                  {student.firstName} {student.lastName}
                </Link>
                <button
                  className="remove-student-btn"
                  onClick={() => handleRemoveStudent(student.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <h3 className="form-section-title">Add a New Student</h3>
      <form
        className="new-student-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddNewStudent();
        }}
      >
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            value={newStudent.firstName}
            onChange={(e) =>
              setNewStudent({ ...newStudent, firstName: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={newStudent.lastName}
            onChange={(e) =>
              setNewStudent({ ...newStudent, lastName: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={newStudent.email}
            onChange={(e) =>
              setNewStudent({ ...newStudent, email: e.target.value })
            }
            required
          />
        </div>
        <div className="form-group">
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
        </div>
        <button className="form-btn" type="submit">
          Add Student
        </button>
      </form>

      <h3 className="form-section-title">Assign an Existing Student</h3>
      <form
        className="existing-student-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddExistingStudent();
        }}
      >
        <div className="form-group">
          <label>Select Student:</label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
          >
            <option value="">-- Select --</option>
            {unassignedStudents.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
        </div>
        <button className="form-btn" type="submit">
          Assign Student
        </button>
      </form>
    </div>
  );
};

export default SingleCampus;
