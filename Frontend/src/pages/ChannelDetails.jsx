import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUserCircle, FaPlay, FaUsers, FaVideo, FaBell } from 'react-icons/fa';
import { UserContext } from '../../UserContextProvider';
import VideoCard from '../components/VideoCard';

const ChannelDetails = () => {
  const { username } = useParams();
  const { user } = useContext(UserContext);
  const [channelData, setChannelData] = useState(null);
  const [videos, setVideos] = useState([]); // Store the videos here
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChannelData();
    fetchChannelVideos();
  }, [username]);

  const fetchChannelData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/users/c/${username}`, {
        withCredentials: true,
      });
      console.log(response.data.data);  // Check the structure of the response
      setChannelData(response.data.data);
      setIsSubscribed(response.data.data.isSubscribed);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch channel data');
      setLoading(false);
      toast.error('Error loading channel data');
    }
  };
  

  const fetchChannelVideos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/users/c/${username}/videos`,
        {
          withCredentials: true,
        }
      );
      setVideos(response.data.data); // Store videos in state
    } catch (err) {
      console.error('Error fetching channel videos:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Error loading channel videos');
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please log in to subscribe');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/subscriptions/c/${channelData._id}`,
        {},
        { withCredentials: true }
      );
      setIsSubscribed(!isSubscribed);
      toast.success(isSubscribed ? 'Unsubscribed successfully' : 'Subscribed successfully');
    } catch (err) {
      toast.error('Failed to update subscription');
    }
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="relative h-48 sm:h-64 md:h-80">
            <img
              src={channelData.coverImage || '/placeholder.svg?height=300&width=1200'}
              alt="Channel Cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
              <div className="p-6">
                <h1 className="text-4xl font-bold">{channelData.fullName}</h1>
                <p className="text-xl text-gray-300">@{channelData.username}</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img
                  src={channelData.avatar || '/placeholder.svg?height=100&width=100'}
                  alt="Channel Avatar"
                  className="w-24 h-24 rounded-full border-4 border-blue-500"
                />
                <div>
                  <p className="text-2xl font-semibold">{channelData.fullName}</p>
                  <p className="text-gray-400">@{channelData.username}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{channelData.subscribersCount}</p>
                  <p className="text-sm text-gray-400">Subscribers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{channelData.videosCount}</p>
                  <p className="text-sm text-gray-400">Videos</p>
                </div>
                <button
                  onClick={handleSubscribe}
                  className={`px-6 py-2 rounded-full text-white font-semibold flex items-center ${
                    isSubscribed ? 'bg-gray-600 hover:bg-gray-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isSubscribed ? <FaBell className="mr-2" /> : <FaUsers className="mr-2" />}
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Videos</h2>
              {/* Use the VideoCard component here */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelDetails;
