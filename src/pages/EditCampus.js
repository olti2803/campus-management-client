import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/EditCampus.css";

const EditCampus = () => {
  const { id } = useParams(); // Campus ID from URL
  const [campus, setCampus] = useState(null); // Store campus data
  const [error, setError] = useState(null); // Handle errors
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    // Fetch campus data
    axios
      .get(`http://localhost:3001/api/campuses/${id}`)
      .then((response) => setCampus(response.data))
      .catch((error) => {
        console.error("Error fetching campus data:", error);
        setError("Failed to load campus data.");
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update campus
    axios
      .put(`http://localhost:3001/api/campuses/${id}`, campus)
      .then(() => navigate(`/campuses/${id}`)) // Navigate back to Single Campus View
      .catch((error) => {
        console.error("Error updating campus:", error);
        setError("Failed to update campus.");
      });
  };

  if (error) {
    return (
      <div className="edit-campus-container">
        <p>{error}</p>
      </div>
    );
  }

  if (!campus) {
    return (
      <div className="edit-campus-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="edit-campus-container">
      <h1 className="edit-campus-title">Edit Campus</h1>
      <form className="edit-campus-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            value={campus.name}
            onChange={(e) => setCampus({ ...campus, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <input
            id="address"
            type="text"
            value={campus.address}
            onChange={(e) => setCampus({ ...campus, address: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={campus.description}
            onChange={(e) =>
              setCampus({ ...campus, description: e.target.value })
            }
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL:</label>
          <input
            id="imageUrl"
            type="url"
            value={campus.imageUrl}
            onChange={(e) => setCampus({ ...campus, imageUrl: e.target.value })}
          />
        </div>
        <button className="submit-btn" type="submit">
          Update Campus
        </button>
      </form>
    </div>
  );
};

export default EditCampus;
