import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContextProvider';
import axios from 'axios';
import { FaHome, FaUpload, FaHeart, FaList, FaUser, FaSignOutAlt, FaBell, FaBars, FaTimes, FaEdit, FaHistory } from 'react-icons/fa';

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
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center">
            <div className="w-12 h-12 md:w-16 md:h-16">
              {/* SVG Logo */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" className="w-full h-full">
                {/* Add your SVG code here */}
              </svg>
            </div>
            <span className="text-3xl md:text-4xl font-extrabold text-white ml-3 tracking-wider" style={{ fontFamily: '"Dancing Script", cursive' }}>
              PlaySync
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {userAuth ? (
              <>
                <NavLink to="/" icon={<FaHome className="text-lg" />}>Home</NavLink>
                <NavLink to="/upload" icon={<FaUpload className="text-lg" />}>Upload Video</NavLink>
                <NavLink to="/manage-videos" icon={<FaEdit className="text-lg" />}>Edit Videos</NavLink>
                <NavLink to="/liked-videos" icon={<FaHeart className="text-lg" />}>Liked Videos</NavLink>
                <NavLink to="/playlists" icon={<FaList className="text-lg" />}>Playlists</NavLink>
                <NavLink to="/subscribed" icon={<FaBell className="text-lg" />}>Subscriptions</NavLink>
                <NavLink to="/watch-history" icon={<FaHistory className="text-lg" />}>Watch History</NavLink>
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {userAuth ? (
              <>
                <NavLink to="/" icon={<FaHome className="text-lg" />}>Home</NavLink>
                <NavLink to="/upload" icon={<FaUpload className="text-lg" />}>Upload Video</NavLink>
                <NavLink to="/manage-videos" icon={<FaEdit className="text-lg" />}>Edit Videos</NavLink>
                <NavLink to="/liked-videos" icon={<FaHeart className="text-lg" />}>Liked Videos</NavLink>
                <NavLink to="/playlists" icon={<FaList className="text-lg" />}>Playlists</NavLink>
                <NavLink to="/subscribed" icon={<FaBell className="text-lg" />}>Subscriptions</NavLink>
                <NavLink to="/watch-history" icon={<FaHistory className="text-lg" />}>Watch History</NavLink>
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
      )}
    </nav>
  );
};

export default Navbar;
