import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaTimes } from 'react-icons/fa';
import VideoCard from '../components/VideoCard';

const Home = () => {
  const [videos, setVideos] = useState([]); // Default as an empty array
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortType, setSortType] = useState('desc');
  const [isSearching, setIsSearching] = useState(false);

  const searchTimeoutRef = useRef(null);

  const fetchVideos = useCallback(async (isNewSearch = false) => {
    if (loading || (!hasMore && !isNewSearch)) return;
    setLoading(true);
    try {
      let endpoint = 'https://playsync-1-7xxc.onrender.com/api/v1/videos/';
      let params = {
        page: isNewSearch ? 1 : page,
        limit: 12,
        sortBy,
        sortType,
      };

      if (searchQuery.trim()) {
        endpoint = 'https://playsync-1-7xxc.onrender.com/api/v1/videos/search';
        params.q = searchQuery;
        setIsSearching(true);
      } else {
        setIsSearching(false);
      }

      const response = await axios.get(endpoint, {
        params,
        withCredentials: true,
      });

      console.log(response.data);

      const newVideos = response.data.data.docs || []; // Updated to fetch docs from data
      if (isNewSearch) {
        setVideos(newVideos);
        setPage(2);
      } else {
        setVideos(prevVideos => [...prevVideos, ...newVideos]);
        setPage(prevPage => prevPage + 1);
      }
      setHasMore(newVideos.length === params.limit); // Updated condition for hasMore
    } catch (error) {
      console.error('Failed to load videos:', error);
      toast.error('Failed to load videos');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [page, searchQuery, sortBy, sortType, loading, hasMore]);

  useEffect(() => {
    fetchVideos(true);
  }, [sortBy, sortType]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchVideos(true);
    }, 500);

    return () => clearTimeout(searchTimeoutRef.current);
  }, [searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !loading) {
        fetchVideos();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchVideos, loading]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    fetchVideos(true);
  };

  const handleSortChange = (e) => {
    const [newSortBy, newSortType] = e.target.value.split('-');
    setSortBy(newSortBy);
    setSortType(newSortType);
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Discover Videos</h1>
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="w-full sm:w-auto mb-4 sm:mb-0 relative">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full sm:w-64 px-4 py-2 pr-10 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            )}
            {!searchQuery && (
              <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            )}
          </div>
          <select
            onChange={handleSortChange}
            className="px-4 py-2 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt-desc">Newest</option>
            <option value="createdAt-asc">Oldest</option>
            <option value="views-desc">Most Viewed</option>
            <option value="views-asc">Least Viewed</option>
          </select>
        </div>
        {isSearching && (
          <p className="text-center mb-4 text-gray-400">
            Showing results for: <span className="font-semibold">{searchQuery}</span>
          </p>
        )}
        {videos.length === 0 ? (
          <p className="text-center text-gray-400">No videos found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {videos.map(video => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
        {loading && (
          <div className="text-center mt-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {!hasMore && videos.length > 0 && (
          <p className="text-center mt-8 text-gray-400">No more videos to display</p>
        )}
      </div>
    </div>
  );
};

export default Home;