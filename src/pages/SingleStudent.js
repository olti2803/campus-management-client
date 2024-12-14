import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/SingleStudent.css";

const SingleStudent = () => {
  const { id } = useParams(); // Get student ID from URL
  const [student, setStudent] = useState(null); // Store student details
  const [error, setError] = useState(null); // Handle fetch errors
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Fetch student details
    axios
      .get(`http://localhost:3001/api/students/${id}`)
      .then((response) => setStudent(response.data))
      .catch((error) => {
        console.error("Error fetching student details:", error);
        setError("Failed to load student details.");
      });
  }, [id]);

  const handleDeleteStudent = () => {
    // Delete student
    axios
      .delete(`http://localhost:3001/api/students/${id}`)
      .then(() => navigate("/students")) // Redirect to All Students view
      .catch((error) => {
        console.error("Error deleting student:", error);
        setError("Failed to delete student.");
      });
  };

  if (error) {
    return (
      <div className="single-student-container">
        <p>{error}</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="single-student-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="single-student-container">
      <div className="student-header">
        <h1 className="student-name">
          {student.firstName} {student.lastName}
        </h1>
        <div className="student-actions">
          <button className="delete-btn" onClick={handleDeleteStudent}>
            Delete Student
          </button>
          <Link to={`/students/${id}/edit`} className="edit-btn">
            Edit Student
          </Link>
        </div>
      </div>
      <div className="student-details">
        <p className="student-email">Email: {student.email}</p>
        <p className="student-gpa">GPA: {student.gpa}</p>
        {student.Campus ? (
          <p className="student-campus">
            Enrolled in:{" "}
            <Link to={`/campuses/${student.Campus.id}`}>
              {student.Campus.name}
            </Link>
          </p>
        ) : (
          <p className="student-campus">
            This student is not enrolled in any campus.
          </p>
        )}
      </div>
    </div>
  );
};

export default SingleStudent;
