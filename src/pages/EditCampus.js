import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
    return <p>{error}</p>;
  }

  if (!campus) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Edit Campus</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={campus.name}
            onChange={(e) => setCampus({ ...campus, name: e.target.value })}
            required
          />
        </label>
        <br />
        <label>
          Address:
          <input
            type="text"
            value={campus.address}
            onChange={(e) => setCampus({ ...campus, address: e.target.value })}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            value={campus.description}
            onChange={(e) =>
              setCampus({ ...campus, description: e.target.value })
            }
          ></textarea>
        </label>
        <br />
        <label>
          Image URL:
          <input
            type="url"
            value={campus.imageUrl}
            onChange={(e) => setCampus({ ...campus, imageUrl: e.target.value })}
          />
        </label>
        <br />
        <button type="submit">Update Campus</button>
      </form>
    </div>
  );
};

export default EditCampus;
