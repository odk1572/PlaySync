import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContextProvider';
import axios from 'axios';
import { FaHome, FaUpload, FaHeart, FaList, FaUser, FaSignOutAlt, FaBell, FaBars, FaTimes, FaEdit } from 'react-icons/fa';

const Navbar = () => {
  const { user, userAuth, setUserAuth, setUser } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('https://playsync-1-7xxc.onrender.com/api/v1/users/logout');
      setUserAuth(false);
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const NavLink = ({ to, icon, children }) => (
    <Link
      to={to}
      className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200"
      onClick={() => setIsOpen(false)}
    >
      {icon}
      <span className="ml-2">{children}</span>
    </Link>
  );

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              {/* Logo with PlaySync text */}
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-1">
                {/* Inline SVG Logo */}
                {/* ... (Your SVG logo code) ... */}
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

              <span className="text-3xl md:text-4xl font-extrabold text-white ml-3 tracking-wider shadow-lg" style={{ fontFamily: '"Dancing Script", cursive' }}>
                PlaySync
              </span>

            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {userAuth ? (
                <>
                  <NavLink to="/" icon={<FaHome className="text-lg" />}>Home</NavLink>
                  <NavLink to="/upload" icon={<FaUpload className="text-lg" />}>Upload Video</NavLink>
                  <NavLink to="/manage-videos" icon={<FaEdit className="text-lg" />}>Edit Videos</NavLink>
                  <NavLink to="/liked-videos" icon={<FaHeart className="text-lg" />}>Liked Videos</NavLink>
                  <NavLink to="/playlists" icon={<FaList className="text-lg" />}>Playlists</NavLink>
                  <NavLink to="/subscribed" icon={<FaBell className="text-lg" />}>Subscriptions</NavLink> {/* Added Subscriptions */}
                  <NavLink to="/profile" icon={<FaUser className="text-lg" />}>Your Profile</NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200"
                  >
                    <FaSignOutAlt className="text-lg" />
                    <span className="ml-2">Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/" icon={<FaHome className="text-lg" />}>Home</NavLink>
                  <NavLink to="/register" icon={<FaUser className="text-lg" />}>Sign Up</NavLink>
                  <NavLink to="/login" icon={<FaSignOutAlt className="text-lg" />}>Login</NavLink>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {userAuth ? (
            <>
              <NavLink to="/" icon={<FaHome className="text-lg" />}>Home</NavLink>
              <NavLink to="/upload" icon={<FaUpload className="text-lg" />}>Upload Video</NavLink>
              <NavLink to="/manage-videos" icon={<FaEdit className="text-lg" />}>Edit Videos</NavLink>
              <NavLink to="/liked-videos" icon={<FaHeart className="text-lg" />}>Liked Videos</NavLink>
              <NavLink to="/playlists" icon={<FaList className="text-lg" />}>Playlists</NavLink>
              <NavLink to="/subscribed" icon={<FaBell className="text-lg" />}>Subscriptions</NavLink> {/* Added Subscriptions */}
              <NavLink to="/profile" icon={<FaUser className="text-lg" />}>Your Profile</NavLink>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200"
              >
                <FaSignOutAlt className="text-lg" />
                <span className="ml-2">Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/" icon={<FaHome className="text-lg" />}>Home</NavLink>
              <NavLink to="/register" icon={<FaUser className="text-lg" />}>Sign Up</NavLink>
              <NavLink to="/login" icon={<FaSignOutAlt className="text-lg" />}>Login</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
