import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import VideoCard from './VideoCard';
const UserVideos = ({ username }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setError("Username is missing.");
      setLoading(false);
      return;
    }

    fetchUserVideos();
  }, [username]);

  const fetchUserVideos = async () => {
    setLoading(true);
    try {
      // Assuming you have `username` available in your component
      const response = await axios.get(
        `http://localhost:8000/api/v1/users/c/${username}/videos`,  // Ensure this endpoint matches your backend
        { withCredentials: true }
      );
      setVideos(response.data.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      if (error.response) {
        toast.error('Failed to fetch user videos');
      } else {
        console.error('Error message:', error.message);
      }
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div>Loading videos...</div>;
  }

  return (
    <div className="bg-gray-700 p-6 rounded-lg mb-8">
      <h3 className="text-2xl font-semibold mb-4">Your Videos</h3>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : videos.length === 0 ? (
        <p>You haven't uploaded any videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserVideos;
