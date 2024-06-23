/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Login = () => {
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = async (values, { setErrors, setSubmitting }) => {
    try {
      const response = await axios.post(
        "http://localhost:5501/auth/login",
        values,
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      navigate("/home");
    } catch (err) {
      if (err.response && err.response.data) {
        const errorMessage = err.response.data.message;
        setErrors({ email: errorMessage });
      } else {
        setErrors({ email: "Login failed. Please try again later." });
      }
      setSubmitting(false);
    }
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
      <div style={glass} className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold text-center text-white">Login</h1>
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
                  className="block text-sm font-medium text-white"
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
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white"
                >
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-2 mt-1 border rounded"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 mt-4 font-semibold text-white bg-green-400 rounded hover:bg-green-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
        <div className="flex items-center justify-end">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-red-500"
          >
            Forgot Password
          </button>
        </div>
        <div className="mt-4 text-center">
          <span className="text-white">Dont have an account? </span>
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
