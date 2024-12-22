// PlaylistItem.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import VideoCard from '../components/VideoCard';

const PlaylistItem = () => {
  const [playlist, setPlaylist] = useState(null);
  const { playlistId } = useParams();

  useEffect(() => {
    fetchPlaylist();
  }, [playlistId]);

  const fetchPlaylist = async () => {
    try {
      const response = await axios.get(`https://playsync-1-7xxc.onrender.com/api/v1/playlist/${playlistId}`);
      setPlaylist(response.data.data);
    } catch (error) {
      console.error(error); // Log error for debugging
      toast.error(error.response?.data?.message || 'Failed to fetch playlist');
    }
  };

  const handleRemoveVideo = async (videoId) => {
    try {
      await axios.delete(`https://playsync-1-7xxc.onrender.com/api/v1/playlist/remove/${videoId}/${playlistId}`);
      toast.success('Video removed from playlist');
      fetchPlaylist();
    } catch (error) {
      toast.error('Failed to remove video from playlist');
    }
  };

  if (!playlist) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">{playlist.name}</h1>
        <p className="text-gray-400 mb-8 text-center">{playlist.description}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlist.videos && playlist.videos.length > 0 ? (
            playlist.videos.map((video) => (
              <VideoCard 
                key={video._id} 
                video={video} 
                onRemove={handleRemoveVideo} // Pass remove function
              />
            ))
          ) : (
            <div className="text-white text-center">No videos found in this playlist.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;
