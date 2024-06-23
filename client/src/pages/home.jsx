/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import CreatePost from "../components/CreatePost";
import GetAllPost from "../components/GetAllPost";
const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:5501/auth/me", {
          withCredentials: true,
        });
        console.log(response.data);
        setUser(response.data);
      } catch (err) {
        console.log(err);
        navigate("/login");
      }
    };
    getUser();
  }, []);

  const handleLogout = () => {
    axios
      .post("http://localhost:5501/auth/logout", {}, { withCredentials: true })
      .then((response) => {
        console.log(response.data.message);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      });
  };

  const profilePage = () => {
    navigate(`/posts/user/${user.sanitizedUser.id}`);
  };

  return (
    <div>
      <div className="flex items-center justify-end bg-blue-600 h-auto p-3 w-full fixed top-0">
        {user ? (
          <>
            <span onClick={profilePage} className="mr-10">
              Hi! {user.sanitizedUser.username}
            </span>
            {user.sanitizedUser.picturePath && (
              <img
                onClick={profilePage}
                className="mr-10 w-14 rounded-full"
                src={`http://localhost:5501/public/${user.sanitizedUser.picturePath}`}
                alt="Profile"
              />
            )}
          </>
        ) : (
          <span className="mr-10">Loading...</span>
        )}
        <button
          onClick={handleLogout}
          className="mr-5 bg-slate-50 w-20 h-auto rounded-md  hover:bg-slate-200"
        >
          Logout
        </button>
      </div>
      <CreatePost />
      <GetAllPost />
    </div>
  );
};

export default Home;
