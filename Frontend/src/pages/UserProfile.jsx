import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContextProvider';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaSignOutAlt, FaTrash, FaUpload } from 'react-icons/fa';
import AccountDetails from '../components/AccountDetails';
import PasswordChange from '../components/PasswordChange';
import UserVideos from '../components/UserVideos';
import DeleteAccount from '../components/DeleteAccount';

const UserProfile = () => {
  const { user, loading, setUser, setUserAuth } = useContext(UserContext);
  const [channelData, setChannelData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else if (!loading) {
      navigate('/login');  // Redirect if no user and authentication is not loading
    }
  }, [user, loading]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`https://playsync-1-7xxc.onrender.com/api/v1/users/c/${user.username}`, {
        withCredentials: true
      });
      setChannelData(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch user profile');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://playsync-1-7xxc.onrender.com/api/v1/users/logout', {}, {
        withCredentials: true
      });
      setUser(null);
      setUserAuth(false);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(type, file);

    try {
      const response = await axios.patch(
        `https://playsync-1-7xxc.onrender.com/api/v1/users/${type === 'avatar' ? 'avatar' : 'cover-image'}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );
      setUser(response.data.data);
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${type}`);
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-white text-center">
        <p>Please log in to view your profile.</p>
        <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
        {' or '}
        <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
      </div>
    );
  }

  // Conditional rendering to handle cases where `channelData` is null or undefined
  if (!channelData) {
    return <div className="text-white text-center">Loading profile data...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8 flex justify-center items-center">
  {/* Inline SVG Logo */}
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" className="w-32 h-32">
    <defs>
      {/* Rainbow Gradient */}
      <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF0080">
          <animate
            attributeName="stop-color"
            values="#FF0080;#FF8C00;#FFD700;#FF0080"
            dur="8s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="25%" stopColor="#FF8C00">
          <animate
            attributeName="stop-color"
            values="#FF8C00;#FFD700;#7CFF00;#FF8C00"
            dur="8s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="50%" stopColor="#7CFF00">
          <animate
            attributeName="stop-color"
            values="#7CFF00;#00FFD1;#0080FF;#7CFF00"
            dur="8s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="75%" stopColor="#0080FF">
          <animate
            attributeName="stop-color"
            values="#0080FF;#8000FF;#FF0080;#0080FF"
            dur="8s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" stopColor="#8000FF">
          <animate
            attributeName="stop-color"
            values="#8000FF;#FF0080;#FF8C00;#8000FF"
            dur="8s"
            repeatCount="indefinite"
          />
        </stop>
      </linearGradient>

      {/* Neon Glow */}
      <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feFlood result="flood" floodColor="#FF00FF" floodOpacity=".3" />
        <feComposite
          in="flood"
          result="mask"
          in2="SourceGraphic"
          operator="in"
        />
        <feGaussianBlur in="mask" result="blurred" stdDeviation="3" />
        <feMerge>
          <feMergeNode in="blurred" />
          <feMergeNode in="blurred" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      {/* Sparkle Effect */}
      <radialGradient id="sparkle" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFF" stopOpacity="1">
          <animate
            attributeName="stopOpacity"
            values="1;0;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" stopColor="#FFF" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background Circle */}
    <circle
      cx="200"
      cy="200"
      r="190"
      fill="url(#rainbowGradient)"
      opacity="0.15"
    >
      <animate
        attributeName="r"
        values="185;195;185"
        dur="3s"
        repeatCount="indefinite"
      />
    </circle>

    {/* Dynamic Play Symbol */}
    <path
      d="M160 120 L160 280 L280 200 Z"
      fill="url(#rainbowGradient)"
      filter="url(#neonGlow)"
    >
      <animate
        attributeName="d"
        values="M160 120 L160 280 L280 200 Z;M165 125 L165 275 L275 200 Z;M160 120 L160 280 L280 200 Z"
        dur="2s"
        repeatCount="indefinite"
      />
    </path>

    {/* Rotating Orbit Rings */}
    <g transform="translate(200, 200)">
      <circle
        cx="0"
        cy="0"
        r="150"
        fill="none"
        stroke="url(#rainbowGradient)"
        strokeWidth="3"
        strokeDasharray="20 10"
        opacity="0.7"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0"
          to="360"
          dur="15s"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx="0"
        cy="0"
        r="130"
        fill="none"
        stroke="url(#rainbowGradient)"
        strokeWidth="3"
        strokeDasharray="15 15"
        opacity="0.5"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="360"
          to="0"
          dur="10s"
          repeatCount="indefinite"
        />
      </circle>
    </g>

    {/* Sparkle Elements */}
    {[...Array(5)].map((_, i) => (
      <circle
        key={i}
        cx={Math.random() * 400}
        cy={Math.random() * 400}
        r="3"
        fill="url(#sparkle)"
      >
        <animate
          attributeName="opacity"
          values="0;1;0"
          dur={`${1 + Math.random()}s`}
          repeatCount="indefinite"
          begin={`${Math.random()}s`}
        />
      </circle>
    ))}
  </svg>
</div>

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Your PlaySync Profile</h1>
          <p className="text-xl text-gray-400">Manage your account and content</p>
        </div>
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
          <div className="relative mb-8">
            <img
              src={channelData.coverImage || '/placeholder.svg?height=200&width=800'}
              alt="Cover"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <label htmlFor="coverImage" className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full cursor-pointer">
              <FaUpload />
              <input
                type="file"
                id="coverImage"
                className="hidden"
                onChange={(e) => handleImageUpload(e, 'coverImage')}
                accept="image/*"
              />
            </label>
          </div>

          {/* Logo SVG Integration */}

          <div className="flex items-center space-x-4 mb-8">
            <div className="relative">
              <img
                src={channelData.avatar || '/placeholder.svg?height=100&width=100'}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
              <label htmlFor="avatar" className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full cursor-pointer">
                <FaUpload />
                <input
                  type="file"
                  id="avatar"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'avatar')}
                  accept="image/*"
                />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{channelData.fullName}</h2>
              <p className="text-gray-400">@{channelData.username}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Channel Stats</h3>
              <p>Subscribers: {channelData.subscribersCount}</p>
              <p>Subscribed To: {channelData.channelsSubscribedToCount}</p>
              <p>Videos: {channelData.videos?.length || 0}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Account Actions</h3>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 flex items-center"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          </div>

          <AccountDetails user={channelData} />
          <PasswordChange />
          <UserVideos username={channelData.username} />
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
