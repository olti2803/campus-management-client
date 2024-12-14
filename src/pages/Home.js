import React from "react";
import { Link } from "react-router-dom";
import { FaUniversity, FaUsers, FaHome } from "react-icons/fa";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="container">
      <header className="home-header">
        <h1>
          <FaHome className="icon" /> Welcome to the Campus Management System
        </h1>
        <p>Manage your campuses and students seamlessly.</p>
      </header>

      <div className="home-actions">
        <Link to="/campuses" className="card">
          <h2>
            <FaUniversity className="icon" /> View All Campuses
          </h2>
          <p>Explore and manage all registered campuses in the system.</p>
        </Link>
        <Link to="/students" className="card">
          <h2>
            <FaUsers className="icon" /> View All Students
          </h2>
          <p>Access and manage student information across all campuses.</p>
        </Link>
      </div>
    </div>
  );
};

export default Home;
