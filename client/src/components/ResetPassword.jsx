/* eslint-disable no-unused-vars */
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const initialValues = {
    newPassword: "",
    confirmNewPassword: "",
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters long")
      .required("New Password is required"),
    confirmNewPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm New Password is required"),
  });

  const onSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const response = await axios.post(
        "http://localhost:5501/auth/reset-password",
        {
          token,
          newPassword: values.newPassword,
        },
        {
          withCredentials: true,
        }
      );

      alert("Password reset successful");
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors({ newPassword: err.response.data.message });
      } else {
        setErrors({ newPassword: "Error resetting password" });
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-akane">
      <div style={glass} className="w-full max-w-md p-8 space-y-6  rounded shadow-md">
        <h1 className="text-2xl font-bold text-center">Reset Password</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <Field
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  className="w-full p-2 mt-1 border rounded"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              <div>
                <label
                  htmlFor="confirmNewPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm New Password
                </label>
                <Field
                  type="password"
                  name="confirmNewPassword"
                  placeholder="Confirm New Password"
                  className="w-full p-2 mt-1 border rounded"
                />
                <ErrorMessage
                  name="confirmNewPassword"
                  component="div"
                  className="mt-1 text-sm text-red-600"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 mt-4 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
