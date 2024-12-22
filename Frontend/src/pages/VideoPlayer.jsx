import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPlay, FaPause, FaExpand, FaCompress, FaVolumeUp, FaVolumeMute, FaThumbsUp, FaList, FaForward, FaBackward } from 'react-icons/fa';
import Comments from '../components/Comments';
import RelatedVideos from '../components/RelatedVideos';
import { UserContext } from '../../UserContextProvider';
import PlaylistModal from '../components/PlaylistModal';

const VideoPlayer = () => {
  const { videoId } = useParams();
  const { user, userAuth } = useContext(UserContext);
  const [video, setVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    fetchVideo();
    incrementViewCount();
  }, [videoId]);

  const fetchVideo = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/videos/${videoId}`);
      console.log(response.data.data.videoFile);  // Log the video file URL
      setVideo(response.data.data);
      setIsLiked(response.data.data.isLikedByUser);
    } catch (error) {
      toast.error('Failed to load video');
    }
  };

  const incrementViewCount = async () => {
    try {
      await axios.patch(`http://localhost:8000/api/v1/videos/view/${videoId}`);
    } catch (error) {
      console.error('Failed to increment view count', error);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().catch(err => {
        toast.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleLike = async () => {
    if (!userAuth) {
      toast.error('Please log in to like this video');
      return;
    }
    try {
      await axios.post(`http://localhost:8000/api/v1/likes/toggle/v/${videoId}`);
      setIsLiked(!isLiked);
      toast.success(isLiked ? 'Video unliked' : 'Video liked');
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const openPlaylistModal = () => {
    if (!userAuth) {
      toast.error('Please log in to add to playlist');
      return;
    }
    setShowPlaylistModal(true);
  };

  const skipForward = () => {
    videoRef.current.currentTime += 10; // Skip forward by 10 seconds
  };

  const skipBackward = () => {
    videoRef.current.currentTime -= 10; // Skip backward by 10 seconds
  };

  const changePlaybackSpeed = (speed) => {
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!video) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-6xl mx-auto">
        <div className="mb-8" ref={playerRef}>
          <div className="relative rounded-xl overflow-hidden border-4 border-gray-800 shadow-lg">
            <video
              ref={videoRef}
              src={video.videoFile}
              className="w-full rounded-t-xl shadow-lg"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 rounded-b-xl">
              <div className="flex items-center justify-between mb-2">
                <button onClick={handlePlayPause} className="text-white focus:outline-none text-xl hover:text-gray-400 transition-colors duration-200">
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full mx-4 rounded-md bg-gray-700"
                />
                <div className="flex items-center">
                  <button onClick={() => setVolume(volume === 0 ? 1 : 0)} className="text-white focus:outline-none mr-2 hover:text-gray-400 transition-colors duration-200">
                    {volume === 0 ? <FaVolumeMute /> : <FaVolumeUp />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 rounded-md bg-gray-700"
                  />
                </div>
                <button onClick={toggleFullscreen} className="text-white focus:outline-none text-xl hover:text-gray-400 transition-colors duration-200">
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={skipBackward} className="text-white focus:outline-none text-xl hover:text-gray-400 transition-colors duration-200">
                  <FaBackward />
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => changePlaybackSpeed(0.5)}
                    className={`text-white focus:outline-none text-lg ${playbackSpeed === 0.5 ? 'font-bold' : ''} hover:text-gray-400 transition-colors duration-200`}
                  >
                    0.5x
                  </button>
                  <button
                    onClick={() => changePlaybackSpeed(1)}
                    className={`text-white focus:outline-none text-lg ${playbackSpeed === 1 ? 'font-bold' : ''} hover:text-gray-400 transition-colors duration-200`}
                  >
                    1x
                  </button>
                  <button
                    onClick={() => changePlaybackSpeed(1.5)}
                    className={`text-white focus:outline-none text-lg ${playbackSpeed === 1.5 ? 'font-bold' : ''} hover:text-gray-400 transition-colors duration-200`}
                  >
                    1.5x
                  </button>
                  <button
                    onClick={() => changePlaybackSpeed(2)}
                    className={`text-white focus:outline-none text-lg ${playbackSpeed === 2 ? 'font-bold' : ''} hover:text-gray-400 transition-colors duration-200`}
                  >
                    2x
                  </button>
                </div>
                <button onClick={skipForward} className="text-white focus:outline-none text-xl hover:text-gray-400 transition-colors duration-200">
                  <FaForward />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8 border-4 border-gray-800 rounded-lg p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">{video.title}</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${isLiked ? 'bg-blue-600' : 'bg-gray-700'} hover:bg-blue-700 transition-colors duration-200`}
              >
                <FaThumbsUp />
                <span>{isLiked ? 'Liked' : 'Like'}</span>
              </button>
              <button
                onClick={openPlaylistModal}
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
              >
                <FaList />
                <span>Add to Playlist</span>
              </button>
            </div>
          </div>
          <p className="text-gray-400 mb-4">{video.views} views</p>
          <p className="text-lg">{video.description}</p>
        </div>
        <div className="mb-8">
          <Link to={`/channel/${video.owner.username}`} className="flex items-center border-2 border-gray-700 p-4 rounded-lg hover:bg-gray-800 transition-all">
            <img src={video.owner.avatar} alt={video.owner.fullName} className="w-12 h-12 rounded-full mr-4" />
            <div>
              <h2 className="text-xl font-semibold">{video.owner.fullName}</h2>
              <p className="text-gray-400">@{video.owner.username}</p>
            </div>
          </Link>
        </div>
        <Comments videoId={videoId} />
        <RelatedVideos videoId={videoId} />
      </div>
      {showPlaylistModal && (
        <PlaylistModal videoId={videoId} onClose={() => setShowPlaylistModal(false)} />
      )}
    </div>
  );
};

export default VideoPlayer;
