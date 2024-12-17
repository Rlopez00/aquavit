import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Ciudadano from "./pages/Ciudadano";
import Admin from "./pages/Admin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Ciudadano />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
