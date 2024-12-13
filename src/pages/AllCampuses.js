import React, { useEffect, useState } from "react";
import axios from "axios";

const AllCampuses = () => {
  const [campuses, setCampuses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newCampus, setNewCampus] = useState({
    name: "",
    address: "",
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    // Fetch campuses from the API
    axios
      .get("http://localhost:3001/api/campuses")
      .then((response) => {
        setCampuses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching campuses:", error);
      });
  }, []);

  const handleAddCampus = () => {
    axios
      .post("http://localhost:3001/api/campuses", newCampus)
      .then((response) => {
        setCampuses([...campuses, response.data]); // Update UI with the new campus
        setNewCampus({ name: "", address: "", description: "", imageUrl: "" }); // Reset form
        setShowForm(false); // Hide form
      })
      .catch((error) => {
        console.error("Error adding campus:", error);
      });
  };

  const handleDeleteCampus = (id) => {
    axios
      .delete(`http://localhost:3001/api/campuses/${id}`)
      .then(() => {
        setCampuses(campuses.filter((campus) => campus.id !== id)); // Update the UI
      })
      .catch((error) => {
        console.error("Error deleting campus:", error);
      });
  };

  return (
    <div>
      <h1>All Campuses</h1>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "Add Campus"}
      </button>

      {showForm && (
        <div>
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
            <br />
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
            <br />
            <label>
              Description:
              <textarea
                value={newCampus.description}
                onChange={(e) =>
                  setNewCampus({ ...newCampus, description: e.target.value })
                }
              ></textarea>
            </label>
            <br />
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
            <br />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      <ul>
        {campuses.length === 0 ? (
          <p>No campuses available</p>
        ) : (
          campuses.map((campus) => (
            <li key={campus.id}>
              <h2>{campus.name}</h2>
              <p>{campus.address}</p>
              <p>{campus.description}</p>
              <img
                src={campus.imageUrl}
                alt={campus.name}
                style={{ width: "200px" }}
              />
              <button onClick={() => handleDeleteCampus(campus.id)}>
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
