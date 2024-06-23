/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GetAllPost = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5501/posts", {
          withCredentials: true,
        });
        console.log(response.data);
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5501/posts?search=${searchTerm}`,
        {
          withCredentials: true,
        }
      );
      setPosts(response.data);
    } catch (err) {
      console.error("Error searching posts:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-2xl font-bold my-4">All Posts</div>
      <div className=" flex w-96">
        <input
          type="text"
          placeholder="Search by title, description, or tags"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="shadow appearance-none border rounded h-10  w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Search
        </button>
      </div>
      <div className="w-auto flex flex-col items-center justify-center">
        {posts.length > 0 ? (
          posts.map((post) => {
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
                className="mb-4 p-4 border rounded w-96 flex flex-col justify-center items-start gap-1"
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className="text-gray-600 underline cursor-pointer font-bold"
                    onClick={() => navigate(`/user/${post.userId}`)}
                  >
                    {post.username}
                  </span>
                  <span>{formattedDate}</span>
                </div>
                <h2 className=" font-semibold text-lg">Title: {post.title}</h2>
                <p
                  className=" w-full hover:cursor-pointer"
                  onClick={() => navigate(`/post/${post.postId}`)}
                >
                  Description: {post.postDescription}
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
  );
};

export default GetAllPost;
