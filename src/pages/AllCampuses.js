import React, { useEffect, useState } from "react";
import axios from "axios";

const AllCampuses = () => {
  const [campuses, setCampuses] = useState([]);

  useEffect(() => {
    // Fetch campuses from the API
    axios
      .get("http://localhost:3001/api/campuses")
      .then((response) => {
        console.log("Fetched campuses:", response.data); // Log the fetched data
        setCampuses(response.data); // Save data to state
      })
      .catch((error) => {
        console.error("Error fetching campuses:", error);
      });
  }, []);

  return (
    <div>
      <h1>All Campuses</h1>
      <ul>
        {campuses.map((campus) => (
          <li key={campus.id}>
            <h2>{campus.name}</h2>
            <p>{campus.address}</p>
            <p>{campus.description}</p>
            <img
              src={campus.imageUrl}
              alt={campus.name}
              style={{ width: "200px" }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllCampuses;
