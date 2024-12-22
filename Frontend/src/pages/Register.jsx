import React, { useState, useContext } from 'react';
import { UserContext } from '../../UserContextProvider';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaImage, FaCloudUploadAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const { setUser, setUserAuth } = useContext(UserContext);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    avatar: null,
    coverImage: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));

    if (name === 'avatar') {
      setAvatarPreview(URL.createObjectURL(files[0]));
    } else if (name === 'coverImage') {
      setCoverImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/register', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        setUser(response.data.data);
        setUserAuth(true);
        toast.success('Registration successful!');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-xl transform transition-all hover:scale-105">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 ">
            {/* Inline SVG Logo */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" className="w-full h-full">
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
          <h2 className="text-3xl font-extrabold">Join PlaySync</h2>
          <p className="mt-2 text-sm text-gray-400">
            Your gateway to endless streaming adventures
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
              <FaUser className="text-gray-400 mr-3" />
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                className="bg-transparent border-none text-white flex-grow focus:outline-none"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="bg-transparent border-none text-white flex-grow focus:outline-none"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
              <FaUser className="text-gray-400 mr-3" />
              <input
                id="username"
                name="username"
                type="text"
                required
                className="bg-transparent border-none text-white flex-grow focus:outline-none"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
              <FaLock className="text-gray-400 mr-3" />
              <input
                id="password"
                name="password"
                type="password"
                required
                className="bg-transparent border-none text-white flex-grow focus:outline-none"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
              <FaImage className="text-gray-400 mr-3" />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="bg-transparent text-white flex-grow file:hidden"
                onChange={handleFileChange}
              />
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-12 h-12 object-cover rounded-full border-2 border-gray-500"
                />
              )}
            </div>

            <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
              <FaCloudUploadAlt className="text-gray-400 mr-3" />
              <input
                type="file"
                name="coverImage"
                accept="image/*"
                className="bg-transparent text-white flex-grow file:hidden"
                onChange={handleFileChange}
              />
              {coverImagePreview && (
                <img
                  src={coverImagePreview}
                  alt="Cover Image Preview"
                  className="w-12 h-12 object-cover rounded-full border-2 border-gray-500"
                />
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-md font-bold hover:bg-blue-600"
            >
              Register
            </button>
          </div>
          <div className="text-center mt-4 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
