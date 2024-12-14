import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">Campus Management</h1>
      <div className="navbar-links">
        <NavLink exact to="/" activeClassName="active">
          Home
        </NavLink>
        <NavLink to="/campuses" activeClassName="active">
          All Campuses
        </NavLink>
        <NavLink to="/students" activeClassName="active">
          All Students
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
