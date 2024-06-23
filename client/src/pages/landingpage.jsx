/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";

const Landingpage = () => {
  const glass = {
    backdropFilter: 'blur(10px)',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

 
  return (
    <>
      <div className="">
        <div className="flex items-center justify-center gap-10 text-3xl h-screen bg-panther bg-cover">
          <div style={glass} className="flex flex-col justify-center items-center text-white p-24 gap-6 max-w-sm mx-auto text-center">

          <Link to="/login" className="px-4 py-2 rounded hover:bg-yellow-300 hover:text-black hover:rounded-full"
              style={{ borderRadius: '2px' }}>Login</Link>
          <Link to="/register"className="px-4 py-2 rounded hover:bg-yellow-300 hover:text-black  hover:rounded-full"
              style={{ borderRadius: '2px' }}>Register</Link>
          </div>
        
        </div>
      </div>
    </>
  );
};

export default Landingpage;
