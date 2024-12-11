import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
      <Link to="/" style={{ margin: "0 10px" }}>
        Home
      </Link>
      <Link to="/campuses" style={{ margin: "0 10px" }}>
        Campuses
      </Link>
      <Link to="/students" style={{ margin: "0 10px" }}>
        Students
      </Link>
    </nav>
  );
};

export default Navbar;
