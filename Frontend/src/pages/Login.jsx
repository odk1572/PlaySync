import React, { useState, useContext } from 'react';
import { UserContext } from '../../UserContextProvider';
import axios from 'axios';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa'; // Add FaEnvelope for the email icon
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const { setUser, setUserAuth } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '', // Add email to the state
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://playsync-1-7xxc.onrender.com/api/v1/users/login', formData, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUser(response.data.data.user);
        setUserAuth(true);
        toast.success('Login successful!');
        navigate('/'); // Redirect to the profile page after login
      }
    } catch (err) {
      console.error('Login error details:', err.response?.data || err.message);

      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
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
          <h2 className="text-3xl font-extrabold">Login to PlaySync</h2>
          <p className="mt-2 text-sm text-gray-400">
            Continue your streaming adventure
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Input */}
            <div className="flex items-center bg-gray-700 rounded-lg px-3 py-2">
              <FaEnvelope className="text-gray-400 mr-3" />
              <input
                id="email"
                name="email"
                type="email"
                required
                className="bg-transparent border-none text-white flex-grow focus:outline-none"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Username Input */}
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

            {/* Password Input */}
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

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-md font-bold hover:bg-blue-600"
            >
              Login
            </button>
          </div>
          <div className="text-center mt-4 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
