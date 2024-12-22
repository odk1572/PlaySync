import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../UserContextProvider';
import VideoCard from '../components/VideoCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import { FaEdit, FaTrash, FaSpinner, FaUpload, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const UserVideosManagement = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      fetchUserVideos();
    }
  }, [user]);

  const fetchUserVideos = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/users/c/${user.username}/videos`, {
        withCredentials: true
      });
      setVideos(response.data.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch user videos');
      setLoading(false);
    }
  };

  const handleUpdateVideo = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/v1/videos/${editingVideo._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );
      setVideos(videos.map(v => v._id === editingVideo._id ? response.data.data : v));
      setEditingVideo(null);
      toast.success('Video updated successfully');
    } catch (error) {
      toast.error('Failed to update video');
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/videos/${videoId}`, {
          withCredentials: true
        });
        setVideos(videos.filter(v => v._id !== videoId));
        toast.success('Video deleted successfully');
      } catch (error) {
        toast.error('Failed to delete video');
      }
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

<h1 className="text-4xl font-bold text-center mb-12 flex items-center justify-center space-x-2">
  <FontAwesomeIcon icon={faVideo} className="text-gray-600 text-3xl" />
  <span>Manage Your Videos</span>
</h1>

        {videos.length === 0 ? (
          <div className="text-center">
          <p className="text-2xl font-semibold mb-4">You haven't uploaded any videos yet.</p>
          <Link
            to="/upload"
            className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition-colors duration-300 inline-flex items-center"
          >
            <FaUpload className="mr-2" />
            Upload Your First Video
          </Link>
        </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {videos.map((video) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <VideoCard video={video} />
                  <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => setEditingVideo(video)}
                      className="bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors duration-300"
                    >
                      <FaEdit className="text-white" />
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(video._id)}
                      className="bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors duration-300"
                    >
                      <FaTrash className="text-white" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 p-6 rounded-lg max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-4">Edit Video</h2>
            <form onSubmit={handleUpdateVideo}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={editingVideo.title}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={editingVideo.description}
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-300 mb-1">New Thumbnail (optional)</label>
                <input
                  type="file"
                  id="thumbnail"
                  name="thumbnail"
                  accept="image/*"
                  className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                  Update Video
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserVideosManagement;

