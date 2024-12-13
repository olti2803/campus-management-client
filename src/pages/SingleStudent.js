import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
    return <p>{error}</p>;
  }

  if (!student) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>
        {student.firstName} {student.lastName}
      </h1>
      <p>Email: {student.email}</p>
      <p>GPA: {student.gpa}</p>
      {student.Campus ? (
        <p>
          Enrolled in:{" "}
          <Link to={`/campuses/${student.Campus.id}`}>
            {student.Campus.name}
          </Link>
        </p>
      ) : (
        <p>This student is not enrolled in any campus.</p>
      )}
      <button onClick={handleDeleteStudent}>Delete Student</button>
      <Link to={`/students/${id}/edit`}>Edit Student</Link>
    </div>
  );
};

export default SingleStudent;
