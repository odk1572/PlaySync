import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaLock } from 'react-icons/fa';

const PasswordChange = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: ''
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://playsync-1-7xxc.onrender.com/api/v1/users/change-password', passwords, {
        withCredentials: true
      });
      toast.success('Password changed successfully');
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  return (
    <div className="bg-gray-700 p-6 rounded-lg mb-8">
      <h3 className="text-2xl font-semibold mb-4">Change Password</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center bg-gray-600 rounded-lg px-3 py-2">
          <FaLock className="text-gray-400 mr-3" />
          <input
            type="password"
            name="oldPassword"
            value={passwords.oldPassword}
            onChange={handleChange}
            className="bg-transparent border-none text-white flex-grow focus:outline-none"
            placeholder="Old Password"
          />
        </div>
        <div className="flex items-center bg-gray-600 rounded-lg px-3 py-2">
          <FaLock className="text-gray-400 mr-3" />
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            className="bg-transparent border-none text-white flex-grow focus:outline-none"
            placeholder="New Password"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default PasswordChange;

