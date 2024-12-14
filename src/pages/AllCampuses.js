import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCampuses } from "../redux/campusesSlice";
import axios from "axios";
import "../Global.css";
import "../styles/AllCampuses.css";

const AllCampuses = () => {
  const dispatch = useDispatch();
  const campuses = useSelector((state) => state.campuses.items); // Redux state
  const campusesStatus = useSelector((state) => state.campuses.status); // Loading status

  const [showForm, setShowForm] = useState(false);
  const [newCampus, setNewCampus] = useState({
    name: "",
    address: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    // Dispatch Redux action to fetch campuses
    if (campusesStatus === "idle") {
      dispatch(fetchCampuses());
    }
  }, [dispatch, campusesStatus]);

  const handleAddCampus = () => {
    axios
      .post("http://localhost:3001/api/campuses", newCampus)
      .then((response) => {
        setNewCampus({ name: "", address: "", description: "", imageUrl: "" }); // Reset form
        setShowForm(false); // Hide form
        dispatch(fetchCampuses()); // Refresh Redux state
      })
      .catch((error) => {
        console.error("Error adding campus:", error);
      });
  };

  const handleDeleteCampus = (id) => {
    axios
      .delete(`http://localhost:3001/api/campuses/${id}`)
      .then(() => {
        dispatch(fetchCampuses()); // Refresh Redux state
      })
      .catch((error) => {
        console.error("Error deleting campus:", error);
      });
  };

  return (
    <div className="all-campuses-container">
      <h1 className="all-campuses-title">All Campuses</h1>
      <button
        className="add-campus-toggle"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add Campus"}
      </button>

      {showForm && (
        <div className="add-campus-form">
          <h2>Add a New Campus</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCampus();
            }}
          >
            <label>
              Name:
              <input
                type="text"
                value={newCampus.name}
                onChange={(e) =>
                  setNewCampus({ ...newCampus, name: e.target.value })
                }
                required
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                value={newCampus.address}
                onChange={(e) =>
                  setNewCampus({ ...newCampus, address: e.target.value })
                }
                required
              />
            </label>
            <label>
              Description:
              <textarea
                value={newCampus.description}
                onChange={(e) =>
                  setNewCampus({ ...newCampus, description: e.target.value })
                }
              ></textarea>
            </label>
            <label>
              Image URL:
              <input
                type="url"
                value={newCampus.imageUrl}
                onChange={(e) =>
                  setNewCampus({ ...newCampus, imageUrl: e.target.value })
                }
              />
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      <ul className="all-campuses-grid">
        {campusesStatus === "loading" ? (
          <p>Loading campuses...</p>
        ) : campuses.length === 0 ? (
          <p>No campuses available</p>
        ) : (
          campuses.map((campus) => (
            <li key={campus.id} className="all-campuses-card">
              <h2>
                <Link to={`/campuses/${campus.id}`} className="campus-link">
                  {campus.name}
                </Link>
              </h2>
              <p className="campus-address">{campus.address}</p>
              <p className="campus-description">{campus.description}</p>
              <Link to={`/campuses/${campus.id}`}>
                <img
                  src={campus.imageUrl}
                  alt={campus.name}
                  className="campus-image"
                />
              </Link>
              <button
                className="delete-campus-button"
                onClick={() => handleDeleteCampus(campus.id)}
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AllCampuses;
