import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../UserContextProvider';
import { FaUserCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const SubscribedChannels = () => {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchSubscribedChannels();
    }
  }, [user]);

  const fetchSubscribedChannels = async () => {
    try {
      const response = await axios.get(`https://playsync-1-7xxc.onrender.com/api/v1/subscriptions/c/${user._id}`, {
        withCredentials: true
      });
      setChannels(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch subscribed channels');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <FaSpinner className="animate-spin text-6xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Your Subscribed Channels</h1>
        {channels.length === 0 ? (
          <div className="text-center">
            <FaExclamationTriangle className="text-6xl text-yellow-500 mx-auto mb-4" />
            <p className="text-2xl font-semibold">You haven't subscribed to any channels yet.</p>
            <p className="mt-2 text-gray-400">Explore and subscribe to channels to see them here!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {channels.map((subscription) => (
              <Link
                key={subscription._id}
                to={`/channel/${subscription.channel.username}`}
                className="transform hover:scale-105 transition-all duration-300"
              >
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    {subscription.channel.avatar ? (
                      <img
                        src={subscription.channel.avatar}
                        alt={subscription.channel.fullname}
                        className="w-24 h-24 rounded-full border-4 border-white object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-24 h-24 text-white" />
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2 truncate">{subscription.channel.fullname}</h2>
                    <p className="text-gray-400 mb-4">@{subscription.channel.username}</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Subscribed on: {new Date(subscription.createdAt).toLocaleDateString()}</span>
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                        Subscribed
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribedChannels;

