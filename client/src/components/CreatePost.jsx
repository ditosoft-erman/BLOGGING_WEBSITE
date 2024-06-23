/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useState } from "react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postContent, setPostContent] = useState(null);
  const [selectedTag, setSelectedTag] = useState(""); // State for the selected tag

  const availableTags = [
    "Technology",
    "Health",
    "Finance",
    "Education",
    "Travel",
    "gaming",
  ];

  const onPost = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("postDescription", postDescription);
    formData.append("postContent", postContent);
    formData.append("tags", selectedTag);

    try {
      const response = await axios.post(
        "http://localhost:5501/posts/createPost",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Post created successfully", response.data);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <div className="text-2xl font-bold mb-4">Create a Post</div>
      <div className="flex flex-col w-1/3 items-center justify-center">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mt-1 border rounded"
        />
        <input
          type="text"
          name="postDescription"
          placeholder="Post Description"
          value={postDescription}
          onChange={(e) => setPostDescription(e.target.value)}
          className="w-full p-2 mt-1 border rounded"
        />
        <input
          type="file"
          name="postContent"
          onChange={(e) => setPostContent(e.target.files[0])}
          className="w-full p-2 mt-1 border rounded"
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="w-full p-2 mt-1 border rounded"
        >
          <option value="" disabled>
            Select a tag
          </option>
          {availableTags.map((tag, index) => (
            <option key={index} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <button
          onClick={onPost}
          className="w-full py-2 mt-4 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CreatePost;
