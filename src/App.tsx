import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CompanySetup from "./pages/CompanySetup";
import InviteTeam from "./pages/InviteTeam";
import Dashboard from "./pages/Dashboard";
import Leave from "./pages/Leave";
import Attendance from "./pages/Attendance";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/company-setup" element={<CompanySetup />} />
          <Route path="/invite-team" element={<InviteTeam />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Home />} />
          <Route path="/leave" element={<Leave/>} />
          <Route path="/attendance" element= {<Attendance/>} />
        </Routes>
        <Toaster position="top-center" />
      </div>
    </BrowserRouter>
  );
}

export default App;
