'use client'
import Link from 'next/link';
import React, { useState } from 'react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    pin: '',
    mobile: '',   
    email: '',
    accountType: '',
    nid: 0,  
    balance:0
});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'pin' && value.length > 5) return;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // First check if any of the unique fields already exist
      const checkResponse = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: formData.mobile,
          email: formData.email,
          nid: formData.nid
        }),
      });

      const checkData = await checkResponse.json();

      if (!checkResponse.ok) {
        if (checkData.exists) {
          // Set specific errors for each field that already exists
          if (checkData.mobile) {
            setErrors(prev => ({ ...prev, mobile: 'This mobile number is already registered' }));
          }
          if (checkData.email) {
            setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
          }
          if (checkData.nid) {
            setErrors(prev => ({ ...prev, nid: 'This NID is already registered' }));
          }
          setIsSubmitting(false);
          return;
        }
      }

      // If no existing data found, proceed with signup
      if (formData.accountType === "Agent") {
        formData.balance = 100000;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(prev => ({ ...prev, general: data.error || 'Failed to create account' }));
        return;
      }
      window.location.href = '/login';
    } catch (error) {
      setErrors(prev => ({ ...prev, general: 'An error occurred. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errors.general}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">5-digit PIN</label>
            <input
              type="password"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              required
              pattern="\d{5}"
              title="Enter exactly 5 digits"
              className="w-full px-3 py-2 border rounded-md"
              placeholder="e.g. 12345"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile Number</label>
            <input
              type="string"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md ${errors.mobile ? 'border-red-500' : ''}`}
              placeholder="Enter mobile number"
            />
            {errors.mobile && (
              <p className="mt-1 text-sm text-red-600">{errors.mobile}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Account Type</label>
            <select
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select type</option>
              <option value="Agent">Agent</option>
              <option value="User">User</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">NID</label>
            <input
              type="number"
              name="nid"
              value={formData.nid}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 border rounded-md ${errors.nid ? 'border-red-500' : ''}`}
              placeholder="Enter NID"
            />
            {errors.nid && (
              <p className="mt-1 text-sm text-red-600">{errors.nid}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Already registered? <Link href="/login" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
