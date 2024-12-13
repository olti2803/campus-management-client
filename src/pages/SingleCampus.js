import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
            {unassignedStudents.map((student) => (
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
