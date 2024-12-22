import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import VideoCard from './VideoCard'; // Import the VideoCard component

const RelatedVideos = ({ videoId }) => {
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    fetchRelatedVideos();
  }, [videoId]);

  const fetchRelatedVideos = async () => {
    try {
      const response = await axios.get(`https://playsync-1-7xxc.onrender.com/api/v1/videos/related/${videoId}`, {
        withCredentials: true,
      });
      setRelatedVideos(response.data.data);
    } catch (error) {
      toast.error('Failed to load related videos');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Related Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedVideos.map((video) => {
          console.log(video);  // Add logging to check the structure of video object
          return <VideoCard key={video._id} video={video} />;  // Use VideoCard here
        })}
      </div>
    </div>
  );
};

export default RelatedVideos;
