import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaPlay, FaHeart, FaCalendarAlt } from 'react-icons/fa';

// Utility function for formatting duration
const formatDuration = (duration) => {
  if (!duration || isNaN(duration)) return '0:00';
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Utility function for formatting date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const VideoCard = ({ video }) => {
  return (
    <Link to={`/videos/${video._id}`} className="block group">
      <div className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
        {/* Thumbnail with Hover Effect */}
        <div className="relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-48 object-cover group-hover:brightness-75 transition-all duration-300"
          />
          
          {/* Play Button on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-pink-500 p-3 rounded-full">
              <FaPlay className="text-white text-3xl" />
            </div>
          </div>
          
          {/* Like Icon */}
          <div className="absolute top-2 right-2 bg-pink-500 rounded-full p-2 hover:bg-pink-400 transition-colors duration-300">
            <FaHeart className="text-white text-lg" />
          </div>
          
          {/* Video Duration */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs font-semibold rounded-md px-2 py-1 shadow-md">
            {formatDuration(video.duration)}
          </div>
        </div>

        {/* Video Details */}
        <div className="p-4 bg-gray-900 group-hover:bg-gray-800 transition-colors duration-300">
          <h3 className="text-lg font-semibold mb-2 text-white truncate group-hover:text-pink-400 transition-colors duration-300">
            {video.title}
          </h3>
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">{video.description}</p>
          
          {/* Video Info Section */}
          <div className="flex items-center justify-between mb-2">
            {/* Video Owner */}
            <div className="flex items-center">
              <img
                src={video.owner?.avatar || 'https://via.placeholder.com/40'}
                alt={video.owner?.fullName || 'Unknown'}
                className="w-10 h-10 rounded-full border-2 border-pink-500"
              />
              <span className="ml-2 text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                {video.owner?.fullName || 'Unknown'}
              </span>
            </div>
            {/* Views */}
            <div className="flex items-center text-sm text-gray-400 group-hover:text-white transition-colors duration-300">
              <FaEye className="mr-1" />
              <span>{video.views} views</span>
            </div>
          </div>

          {/* Video Created At */}
          <div className="flex items-center text-sm text-gray-400 group-hover:text-white transition-colors duration-300">
            <FaCalendarAlt className="mr-1" />
            <span>{formatDate(video.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
