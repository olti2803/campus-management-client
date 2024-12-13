import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AllCampuses from "./pages/AllCampuses";
import AllStudents from "./pages/AllStudents";
import SingleCampus from "./pages/SingleCampus";
import SingleStudent from "./pages/SingleStudent";
import EditCampus from "./pages/EditCampus";
import EditStudent from "./pages/EditStudent";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campuses" element={<AllCampuses />} />
        <Route path="/students" element={<AllStudents />} />
        <Route path="/campuses/:id" element={<SingleCampus />} /> {}
        <Route path="/students/:id" element={<SingleStudent />} />
        <Route path="/campuses/:id/edit" element={<EditCampus />} />
        <Route path="/students/:id/edit" element={<EditStudent />} />
      </Routes>
    </Router>
  );
};

export default App;
