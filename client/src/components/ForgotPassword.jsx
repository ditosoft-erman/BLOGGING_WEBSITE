/* eslint-disable no-unused-vars */
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { arrowBack } from "../assets/img/image";

const ForgotPassword = () => {
  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await axios.post("http://localhost:5501/auth/forgot-password", values, {
        withCredentials: true,
      });
      alert("Password reset email sent");
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors({ email: err.response.data.message });
      } else {
        setErrors({ email: "Error sending password reset email" });
      }
    }
    setSubmitting(false);
  };

  const glass = {
    backdropFilter: 'blur(10px)',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-panther bg-cover">
      <div style={glass} className="w-full max-w-md p-8 space-y-6 rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Forgot Password</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full p-2 mt-1 border rounded"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 mt-4 font-semibold text-white bg-green-400 rounded hover:bg-green-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Email"}
              </button>
            </Form>
          )}
        </Formik>
        <div className=" flex justify-center items-center">
          <img src={arrowBack} alt=""/>
        <Link to='/login'>
          Back</Link>
        </div>
      
      </div>
    </div>
  );
};

export default ForgotPassword;
