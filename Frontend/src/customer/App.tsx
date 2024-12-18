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
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import FindNearestShop from "./pages/findNearestShop";
import Appointment from "./pages/appointment";
import NotFound from "./components/NotFound";
import HairCut from "./components/HairCut";
import CurlHair from "./components/CurlHair";
import HairDying from "./components/HairDying";
import { ForgotPassword } from "./components/ForgotPassword";
import { ResetPassword } from "./components/ResetPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
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
              <Route path="/find-nearest-shop" element={<FindNearestShop />} />
              <Route path="/profile" element={<Profile />} />{" "}
              <Route path="/change-password" element={<ChangePassword />} />{" "}
              <Route path="/appointment" element={<Appointment />} />{" "}
              <Route path="*" element={<NotFound />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/servicesHairCut" element={<HairCut />} />
              <Route path="/servicesCurlHair" element={<CurlHair />} />
              <Route path="/servicesHairDying" element={<HairDying />} />
              {/* Thêm tuyến đường cho Profile */}
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </>
  );
};

export default App;
