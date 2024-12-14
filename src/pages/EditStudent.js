import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditStudent.css";

const EditStudent = () => {
  const { id } = useParams(); // Get student ID from URL
  const navigate = useNavigate(); // For navigation
  const [student, setStudent] = useState(null); // Store student details
  const [campuses, setCampuses] = useState([]); // For dropdown
  const [error, setError] = useState(null); // Handle errors
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gpa: "",
    campusId: "",
  });

  useEffect(() => {
    // Fetch student details
    axios
      .get(`http://localhost:3001/api/students/${id}`)
      .then((response) => {
        setStudent(response.data);
        setFormState({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          gpa: response.data.gpa,
          campusId: response.data.campusId || "", // Allow null for unassigned
        });
      })
      .catch((error) => {
        console.error("Error fetching student details:", error);
        setError("Failed to load student details.");
      });

    // Fetch campuses for dropdown
    axios
      .get("http://localhost:3001/api/campuses")
      .then((response) => setCampuses(response.data))
      .catch((error) => console.error("Error fetching campuses:", error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update student details
    axios
      .put(`http://localhost:3001/api/students/${id}`, formState)
      .then(() => navigate(`/students/${id}`)) // Redirect to Single Student View
      .catch((error) => {
        console.error("Error updating student:", error);
        setError("Failed to update student.");
      });
  };

  if (error) {
    return (
      <div className="edit-student-container">
        <p>{error}</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="edit-student-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="edit-student-container">
      <h1 className="edit-student-title">Edit Student</h1>
      <form className="edit-student-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={formState.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={formState.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formState.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="gpa">GPA:</label>
          <input
            id="gpa"
            type="number"
            name="gpa"
            step="0.1"
            min="0"
            max="4"
            value={formState.gpa}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="campusId">Campus:</label>
          <select
            id="campusId"
            name="campusId"
            value={formState.campusId}
            onChange={handleInputChange}
          >
            <option value="">-- None --</option>
            {campuses.map((campus) => (
              <option key={campus.id} value={campus.id}>
                {campus.name}
              </option>
            ))}
          </select>
        </div>
        <button className="submit-btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditStudent;
