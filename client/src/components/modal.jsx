/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
const Modal = ({ isOpen, onClose, onSubmit, initialComment }) => {
  const [commentBody, setCommentBody] = useState(initialComment);

  useEffect(() => {
    setCommentBody(initialComment);
  }, [initialComment]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-1/3">
        <h2 className="text-1xl font-medium mb-4">Edit Comment</h2>
        <textarea
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(commentBody)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
export default Modal;
