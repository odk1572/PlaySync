import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../UserContextProvider';
import VideoCard from '../components/VideoCard';

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userAuth } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userAuth) {
      navigate('/login');
      return;
    }

    const fetchLikedVideos = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/likes/videos/', {
          withCredentials: true,
        });
        console.log(response); // Add this line to see the full response object
        

        const likedVideoIds = response.data?.data || []; // Fallback to an empty array if data is undefined

        if (!Array.isArray(likedVideoIds)) {
          throw new Error('Invalid response format for liked videos');
        }

        // Fetch details for each video by its ID
        const videoRequests = likedVideoIds.map((like) =>
          axios.get(`http://localhost:8000/api/v1/videos/${like.video}`).catch((err) => {
            console.error('Error fetching video:', err);
            return null; // Return null if the request fails
          })
        );
        

        const videoResponses = await Promise.all(videoRequests);
        const videos = videoResponses.filter((res) => res !== null).map((res) => res.data?.data || {});
        
        setLikedVideos(videos);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch liked videos');
        setLoading(false);
        toast.error('Failed to fetch liked videos');
      }
    };

    fetchLikedVideos();
  }, [userAuth, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center text-white">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Your Liked Videos</h1>
        {likedVideos.length === 0 ? (
          <div className="text-center">
            <p className="text-xl mb-4">You haven't liked any videos yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {likedVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedVideos;
