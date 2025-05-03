"use client";
import Link from "next/link";
import React, { useState } from "react";

const SignIn = () => {
  const [credentials, setCredentials] = useState({
    identifier: "",
    pin: "",
  });
  const [errors, setErrors] = useState({
    identifier: "",
    pin: "",
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error for the specific field
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/verifyPin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      if (data.error === "User not found") {
        setErrors({ identifier: "User not found.", pin: "" });
      } else if (data.isMatch) {
        localStorage.setItem("userToken", data.token);
        window.location.href = "/dashboard";
      } else {
        setErrors({ identifier: "", pin: "Wrong Pin. Please try again." });
      }
    } catch (error) {
      console.error("Error during verification:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email or Phone Number
            </label>
            <input
              type="text"
              name="identifier"
              value={credentials.identifier}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email or phone"
            />
            {errors.identifier && (
              <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="pin"
              value={credentials.pin}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
            {errors.pin && (
              <p className="text-red-500 text-sm mt-1">{errors.pin}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Not registered?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
