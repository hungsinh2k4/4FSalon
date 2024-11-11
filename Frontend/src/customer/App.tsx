import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Vechungtoi from "./pages/aboutUs";
import Booking from "./pages/Booking";
import Register from "./pages/register";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/Profile"; // Thêm tuyến đường cho Profile
import ChangePassword from "./pages/ChangePassword"; // Thêm tuyến đường cho ChangePassword

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about-us" element={<Vechungtoi />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/find-nearest-shop" element={<Booking />} />
            <Route path="/profile" element={<Profile />} />{" "}
            <Route path="/change-password" element={<ChangePassword />} />{" "}
            {/* Thêm tuyến đường cho Profile */}
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
