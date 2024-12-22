import React, { useContext, useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './index.css'
import { UserContext } from '../UserContextProvider';
import UserContextProvider from '../UserContextProvider';
import axios from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import VideoUpload from './pages/VideoUpload';
import VideoPlayer from './pages/VideoPlayer';
import Home from './pages/Home';
import ChannelDetails from './pages/ChannelDetails';
import PlaylistList from './pages/PlaylistList';
import PlaylistItem from './pages/PlaylistItem';
import LikedVideos from './pages/LikedVideos';
import Navbar from './pages/Navbar';
import Footer from './components/Footer';
import SubscribedChannels from './pages/SubscribedChannels';
import UserVideosManagement from './pages/UserVideosManagement';

const App = () => {
  const { userAuth, setUserAuth, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;

  const getUserInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/v1/users/c`,
        null,
        {
          withCredentials: true,
        }
      );
      if (response?.data?.success) {
        setUser(response.data.user);
        setUserAuth(true);
      } else {
        setUser(null);
        setUserAuth(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    console.log(userAuth);
    setLoading(true);
    getUserInfo().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/channel/:username" element={<ChannelDetails />} />
        <Route path="/videos/:videoId" element={<VideoPlayer />} />
        <Route path="/liked-videos" 
        element={userAuth ? <LikedVideos /> : <Navigate to="/login" />} 
        />
        <Route
          path="/profile"
          element={userAuth ? <UserProfile /> : <Navigate to="/login" />}
        />
        <Route
          path="/upload"
          element={userAuth ? <VideoUpload /> : <Navigate to="/login" />}
        />
         <Route
          path="/manage-videos"
          element={userAuth ? <UserVideosManagement /> : <Navigate to="/login" />}
        />
        <>
          <Route
            path="/playlists"
            element={userAuth ? <PlaylistList /> : <Navigate to="/login" />}
          />
          <Route
            path="/playlist/:playlistId"
            element={userAuth ? <PlaylistItem /> : <Navigate to="/login" />}
          />
        </>
        <Route path="/subscribed" 
        element={userAuth ? <SubscribedChannels /> : <Navigate to="/login" />} />
      </Routes>
      <Footer/>
    </Router>
  );
};

export default App;
