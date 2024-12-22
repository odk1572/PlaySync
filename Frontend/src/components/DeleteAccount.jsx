import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';

const DeleteAccount = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('http://localhost:8000/api/v1/users/delete-account', {
        withCredentials: true
      });
      toast.success('Account deleted successfully');
      navigate('/register');
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="bg-gray-700 p-6 rounded-lg">
      <h3 className="text-2xl font-semibold mb-4">Delete Account</h3>
      {!showConfirmation ? (
        <button
          onClick={() => setShowConfirmation(true)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 flex items-center"
        >
          <FaTrash className="mr-2" /> Delete Account
        </button>
      ) : (
        <div className="space-y-4">
          <p className="text-red-500">Are you sure you want to delete your account? This action cannot be undone.</p>
          <div className="flex space-x-4">
            <button
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setShowConfirmation(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;

