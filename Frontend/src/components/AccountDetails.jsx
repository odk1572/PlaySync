import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope } from 'react-icons/fa';

const AccountDetails = ({ user }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch('http://localhost:8000/api/v1/users/update-account', formData, {
        withCredentials: true
      });
      toast.success('Account details updated successfully');
    } catch (error) {
      toast.error('Failed to update account details');
    }
  };

  return (
    <div className="bg-gray-700 p-6 rounded-lg mb-8">
      <h3 className="text-2xl font-semibold mb-4">Account Details</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center bg-gray-600 rounded-lg px-3 py-2">
          <FaUser className="text-gray-400 mr-3" />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="bg-transparent border-none text-white flex-grow focus:outline-none"
            placeholder="Full Name"
          />
        </div>
        <div className="flex items-center bg-gray-600 rounded-lg px-3 py-2">
          <FaEnvelope className="text-gray-400 mr-3" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="bg-transparent border-none text-white flex-grow focus:outline-none"
            placeholder="Email"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
          Update Details
        </button>
      </form>
    </div>
  );
};

export default AccountDetails;

