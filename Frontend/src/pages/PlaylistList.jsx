import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaPlayCircle, FaTrash } from 'react-icons/fa';
import { UserContext } from '../../UserContextProvider';

const PlaylistList = () => {
  const [playlists, setPlaylists] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user && user._id) {
      fetchPlaylists();
    }
  }, [user]);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/playlist/user/${user._id}`);
      console.log(response.data); // Check the structure of the response data
      if (response.data && response.data.data) {
        setPlaylists(response.data.data);
      } else {
        toast.error('No playlists found for this user');
      }
    } catch (error) {
      toast.error('Failed to fetch playlists');
      console.error(error); // Log the error to debug
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/playlist/${playlistId}`);
      toast.success('Playlist deleted successfully');
      fetchPlaylists();
    } catch (error) {
      toast.error('Failed to delete playlist');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🎵 Your Playlists</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <div
                key={playlist._id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="p-4">
                  <h3 className="text-2xl font-bold mb-2 truncate">{playlist.name}</h3>
                  <p className="text-gray-400 mb-4">{playlist.videos.length} videos</p>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/playlist/${playlist._id}`}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      <FaPlayCircle className="text-2xl" />
                      <span>Play</span>
                    </Link>
                    <button
                      onClick={() => handleDeletePlaylist(playlist._id)}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <FaTrash className="text-2xl" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-blue-400 to-purple-500"></div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 text-lg">
              No playlists available. Create your first playlist now! 🎧
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistList;
