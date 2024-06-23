/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const OwnerPost = () => {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
  });
  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [picturePath, setPicturePath] = useState(null);
  const [postFormData, setPostFormData] = useState({
    title: "",
    postDescription: "",
    tags: "",
    postContent: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:5501/user/${userId}`,
          {
            withCredentials: true,
          }
        );
        setUser(userResponse.data);
        setFormData({
          firstname: userResponse.data.firstname,
          lastname: userResponse.data.lastname,
          username: userResponse.data.username,
          email: userResponse.data.email,
        });
        setPicturePath(userResponse.data.picturePath);

        const postsResponse = await axios.get(
          `http://localhost:5501/posts/user/${userId}`,
          {
            withCredentials: true,
          }
        );
        setPosts(postsResponse.data);
      } catch (err) {
        console.log("Error fetching data:", err);
      }
    };
    if (userId) {
      getUser();
    }
  }, [userId]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5501/user/${userId}`,
        formData,
        {
          withCredentials: true,
        }
      );
      console.log("User updated successfully:", response.data);
      setUser(response.data.user);
      setIsEditing(false);
    } catch (err) {
      console.log("Error updating user details:", err);
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData({
      ...passwordFormData,
      [name]: value,
    });
  };

  const handlePasswordFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5501/user/${userId}/password`,
        passwordFormData,
        {
          withCredentials: true,
        }
      );
      if (response.data.message !== "Password updated successfully") {
        setPasswordError(response.data.message);
      } else {
        setIsPasswordModalOpen(false);
        setPasswordError("");
      }
    } catch (err) {
      console.log("Error updating password:", err);
    }
  };

  const handlePictureChange = async (e) => {
    const file = e.target.files[0];
    const updateFormData = new FormData();
    updateFormData.append("picturePath", file);
    try {
      const response = await axios.put(
        `http://localhost:5501/user/${userId}/picture`,
        updateFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("Profile picture updated successfully:", response.data);
      setPicturePath(response.data.picturePath);
    } catch (err) {
      console.log("Error updating profile picture:", err);
    }
  };

  const handlePostEditClick = (post) => {
    setCurrentPost(post);
    setPostFormData({
      title: post.title,
      postDescription: post.postDescription,
      tags: post.tags,
      postContent: null,
    });
    setIsModalOpen(true);
  };

  const handlePostInputChange = (e) => {
    const { name, value, files } = e.target;
    setPostFormData({
      ...postFormData,
      [name]: files ? files[0] : value,
    });
  };

  const handlePostFormSubmit = async (e) => {
    e.preventDefault();
    const updatePostFormData = new FormData();
    for (const key in postFormData) {
      updatePostFormData.append(key, postFormData[key]);
    }
    try {
      const response = await axios.put(
        `http://localhost:5501/posts/${currentPost.postId}`,
        updatePostFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("Post updated successfully:", response.data);
      setPosts(
        posts.map((post) =>
          post.postId === currentPost.postId ? response.data.post : post
        )
      );
      setIsModalOpen(false);
    } catch (err) {
      console.log("Error updating post:", err);
    }
  };

  const handlePostDelete = async (postId) => {
    try {
      await axios.delete(`http://localhost:5501/posts/${postId}`, {
        withCredentials: true,
      });

      setPosts(posts.filter((post) => post.id !== postId));
      console.log("Post deleted successfully");
    } catch (err) {
      console.log("Error deleting post:", err);
    }
  };

  const handlePostPublishToggle = async (postId, currentStatus) => {
    try {
      const url = currentStatus
        ? `http://localhost:5501/posts/${postId}/unpublish`
        : `http://localhost:5501/posts/${postId}/publish`;

      const response = await axios.put(url, {}, { withCredentials: true });

      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, published: !currentStatus } : post
        )
      );
      console.log(
        `Post ${currentStatus ? "unpublished" : "published"} successfully`,
        response.data
      );
    } catch (err) {
      console.log(
        `Error ${currentStatus ? "unpublishing" : "publishing"} post:`,
        err
      );
    }
  };

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
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        {user ? (
          <div className="w-auto mb-8 p-4 border rounded">
            <div className=" flex justify-center gap-10">
              <div className="flex items-start justify-between">
                <img
                  className="w-40 h-40 rounded-full"
                  src={`http://localhost:5501/public/${picturePath}`}
                  alt="Profile Picture"
                />
              </div>

              <div className=" flex flex-col justify-center gap-2">
                <h2 className="text-3xl font-semibold flex">
                  Firstname: {user.firstname}
                </h2>
                <h2 className="text-3xl font-semibold flex">
                  Lastname: {user.lastname}
                </h2>
                <p className="text-gray-600">Username: {user.username}</p>
                <p className="text-gray-600">Email: {user.email}</p>
              </div>
            </div>
            <div className="flex justify-end gap-5">
              <button
                className="text-blue-500 hover:cursor-pointer"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button
                className="text-blue-500 hover:cursor-pointer"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Update Password
              </button>
            </div>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}

        {isEditing && (
          <div className="w-2/3 mb-8 p-4 border rounded">
            <h2 className="text-2xl font-bold mb-4">Edit User Details</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="firstname"
                >
                  Firstname
                </label>
                <input
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="lastname"
                >
                  Lastname
                </label>
                <input
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Save
              </button>
            </form>

            <h2 className="text-2xl font-bold mb-4 mt-8">
              Edit Profile Picture
            </h2>
            <input
              type="file"
              name="picturePath"
              onChange={handlePictureChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}

        <h1 className="text-2xl font-bold mb-4">Your Posts</h1>
        <div className="w-2/3">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.postId} className="mb-4 p-4 border rounded">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{post.postId}</span>
                  <span className="text-gray-600">{post.username}</span>
                  <div className="flex gap-5">
                    <button
                      className="bg-blue-200"
                      onClick={() => handlePostDelete(post.postId)}
                    >
                      Delete Post
                    </button>
                    <button
                      className="bg-blue-200"
                      onClick={() => handlePostEditClick(post)}
                    >
                      Edit Post
                    </button>
                    <button
                      className="bg-blue-200"
                      onClick={() =>
                        handlePostPublishToggle(post.postId, post.published)
                      }
                    >
                      {post.published ? "Unpublish" : "Publish"}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  <span>{post.createdAt}</span>
                </div>

                <span className="mt-2">{post.postDescription}</span>

                {post.postContent && (
                  <img
                    src={`http://localhost:5501/public/${post.postContent}`}
                    alt={post.title}
                    className="mt-2 w-full h-auto"
                  />
                )}
                {post.tags && (
                  <div className="mt-2">
                    <span className="font-semibold">Tags:</span> {post.tags}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </div>
      </div>

      {isPasswordModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Update Password</h2>
            <form onSubmit={handlePasswordFormSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="oldPassword"
                >
                  Old Password
                </label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordFormData.oldPassword}
                  onChange={handlePasswordInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="newPassword"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordFormData.newPassword}
                  onChange={handlePasswordInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmNewPassword"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordFormData.confirmNewPassword}
                  onChange={handlePasswordInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {passwordError && (
                <div className="mb-4 text-red-500 text-sm">{passwordError}</div>
              )}
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update
              </button>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default OwnerPost;
