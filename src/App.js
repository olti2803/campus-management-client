import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AllCampuses from "./pages/AllCampuses";
import AllStudents from "./pages/AllStudents";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campuses" element={<AllCampuses />} />
        <Route path="/students" element={<AllStudents />} />
      </Routes>
    </Router>
  );
};

export default App;
