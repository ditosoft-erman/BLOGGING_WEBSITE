/* eslint-disable no-unused-vars */
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import Landingpage from "./pages/landingpage";
import Home from "./pages/home";
import Post from "./components/Post";
import OwnerPost from "./components/OwnerPost";
import UserProfile from "./components/UserProfile";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/post/:id" element={<Post />} />
          <Route path="/posts/user/:userId" element={<OwnerPost />} />
          <Route path="/user/:userId" element={<UserProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
