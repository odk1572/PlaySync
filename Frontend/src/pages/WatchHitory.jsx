import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTrash, FaHistory } from 'react-icons/fa';
import { UserContext } from '../../UserContextProvider';
import { motion, AnimatePresence } from 'framer-motion';
import VideoCard from '../components/VideoCard';

const WatchHistory = () => {
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchWatchHistory();
    }
  }, [user]);

  const fetchWatchHistory = async () => {
    try {
      const response = await axios.get('https://playsync-1-7xxc.onrender.com/api/v1/users/history', {
        withCredentials: true,
      });
      setWatchHistory(response.data.data.filter((video) => video)); // Filter out null or undefined items
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch watch history');
      setLoading(false);
    }
  };

  const handleDeleteHistoryItem = async (videoId) => {
    try {
      await axios.delete('https://playsync-1-7xxc.onrender.com/api/v1/users/delete-watch-history', {
        data: { videoId },
        withCredentials: true,
      });
      setWatchHistory(watchHistory.filter((item) => item?._id !== videoId)); // Safely filter out the video
      toast.success('Video removed from watch history');
    } catch (error) {
      toast.error('Failed to remove video from watch history');
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear your entire watch history?')) {
      try {
        await axios.delete('https://playsync-1-7xxc.onrender.com/api/v1/users/delete-watch-history', {
          withCredentials: true,
        });
        setWatchHistory([]); // Clear all items
        toast.success('Watch history cleared');
      } catch (error) {
        toast.error('Failed to clear watch history');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <ToastContainer theme="dark" />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold flex items-center">
            <FaHistory className="mr-4 text-blue-500" />
            Your Watch History
          </h1>
          <button
            onClick={handleClearHistory}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center"
          >
            <FaTrash className="mr-2" />
            Clear History
          </button>
        </div>
        {watchHistory.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl font-semibold mb-4">Your watch history is empty</p>
            <p className="text-gray-400">Videos you watch will appear here</p>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {watchHistory.map((video) =>
                video ? ( // Safely check if video exists
                  <motion.div
                    key={video._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative group"
                  >
                    <VideoCard video={video} />
                    <button
                      onClick={() => handleDeleteHistoryItem(video._id)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      aria-label="Remove from history"
                    >
                      <FaTrash />
                    </button>
                  </motion.div>
                ) : null // Skip null/undefined videos
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default WatchHistory;
