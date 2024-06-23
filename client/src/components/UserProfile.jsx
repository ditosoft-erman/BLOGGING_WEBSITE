/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5501/user/${userId}`,
          {
            withCredentials: true,
          }
        );
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5501/posts/user/${userId}`,
          {
            withCredentials: true,
          }
        );
        setUserPosts(response.data);
      } catch (err) {
        console.error("Error fetching user posts:", err);
        navigate("/");
      }
    };

    fetchUser();
    fetchUserPosts();
  }, [userId]);

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <div className="ml-2 text-xl text-white font-semibold">
        <button
          className=" bg-blue-700 px-5 py-1 mt-1 rounded-md"
          onClick={() => {
            navigate("/home");
          }}
        >
          Back
        </button>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-2xl font-bold mb-4">User Profile</div>
        <div className="mb-4 p-4 border rounded w-96 flex flex-col items-start">
          <div className="flex items-center justify-between w-full">
            {user.picturePath && (
              <img
                src={`http://localhost:5501/public/${user.picturePath}`}
                alt="Profile"
                className="w-24 h-24 rounded-full"
              />
            )}
          </div>
          <h2 className="text-xl font-semibold">
            {user.firstname} {user.lastname}
          </h2>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
        <div className="text-2xl font-bold mb-4">User Posts</div>
        <div className="w-auto flex flex-col items-center justify-center">
          {userPosts.length > 0 ? (
            userPosts.map((post) => {
              const formattedDate = new Date(post.createdAt).toLocaleDateString(
                "en-US",
                {
                  year: "2-digit",
                  month: "2-digit",
                  day: "2-digit",
                }
              );

              return (
                <div
                  key={post.postId}
                  className="mb-4 p-4 border rounded w-96 flex flex-col justify-center items-start"
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className="text-gray-600 underline cursor-pointer"
                      onClick={() => navigate(`/post/${post.postId}`)}
                    >
                      {post.username}
                    </span>
                    <span>{formattedDate}</span>
                  </div>
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <p
                    className="mt-2 w-full hover:cursor-pointer"
                    onClick={() => navigate(`/post/${post.postId}`)}
                  >
                    {post.postDescription}
                  </p>
                  {post.postContent && (
                    <img
                      onClick={() => navigate(`/post/${post.postId}`)}
                      src={`http://localhost:5501/public/${post.postContent}`}
                      alt={post.title}
                      className="mt-2 w-96 h-auto hover:cursor-pointer"
                    />
                  )}
                  {post.tags && (
                    <div className="mt-2">
                      <span className="font-semibold">Tags:</span> {post.tags}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;
