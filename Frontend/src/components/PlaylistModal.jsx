import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { UserContext } from '../../UserContextProvider';

const PlaylistModal = ({ videoId, onClose }) => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDescription, setNewPlaylistDescription] = useState('');
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    if (!user || !user._id) {
      toast.error('User not found');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/playlist/user/${user._id}`);
      setPlaylists(response.data.data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to fetch playlists');
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/v1/playlist', {
        name: newPlaylistName,
        description: newPlaylistDescription
      });
      toast.success('Playlist created successfully');
      setNewPlaylistName('');
      setNewPlaylistDescription('');
      fetchPlaylists();
    } catch (error) {
      toast.error('Failed to create playlist');
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await axios.patch(`http://localhost:8000/api/v1/playlist/add/${videoId}/${playlistId}`);
      toast.success('Video added to playlist');
    } catch (error) {
      toast.error('Failed to add video to playlist');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add to Playlist</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleCreatePlaylist} className="mb-6">
          <input
            type="text"
            placeholder="New Playlist Name"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />
          <input
            type="text"
            placeholder="Playlist Description"
            value={newPlaylistDescription}
            onChange={(e) => setNewPlaylistDescription(e.target.value)}
            className="w-full p-2 mb-2 bg-gray-700 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors duration-200"
            disabled={!newPlaylistName || !newPlaylistDescription}
          >
            <FaPlus className="inline mr-2" /> Create New Playlist
          </button>
        </form>
        <div className="max-h-60 overflow-y-auto">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="flex justify-between items-center mb-2 p-2 bg-gray-700 rounded">
              <span>{playlist.name}</span>
              <button
                onClick={() => handleAddToPlaylist(playlist._id)}
                className="bg-green-600 text-white p-1 rounded hover:bg-green-700 transition-colors duration-200"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;
