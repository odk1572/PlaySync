import React, { useState, useRef, useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCloudUploadAlt, FaFileVideo, FaImage, FaInfoCircle } from 'react-icons/fa';
import { UserContext } from '../../UserContextProvider'; // Adjust the import path as needed

const VideoUpload = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedVideoId, setUploadedVideoId] = useState(null);
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (type === 'video') {
      setVideoFile(file);
    } else {
      setThumbnail(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile || !thumbnail) {
      toast.error('Please select both video and thumbnail files');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('videoFile', videoFile);
    uploadData.append('thumbnail', thumbnail);
    uploadData.append('title', formData.title);
    uploadData.append('description', formData.description);
    uploadData.append('duration', formData.duration);

    setUploading(true);
    setProgress(0);

    try {
      const response = await axios.post('https://playsync-1-7xxc.onrender.com/api/v1/videos', uploadData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Assuming you store the token in localStorage
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        setUploadedVideoId(response.data.data.videoId);
        toast.success('Video uploaded successfully!');
        setFormData({ title: '', description: '', duration: '' });
        setVideoFile(null);
        setThumbnail(null);
        if (videoInputRef.current) videoInputRef.current.value = '';
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Error uploading video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Upload Your Video</h1>
          <p className="mt-2 text-xl text-gray-400">Share your creativity with the world</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-8 rounded-xl shadow-2xl">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter video title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows="4"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your video"
            ></textarea>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-400 mb-1">
              Duration (in seconds)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter video duration in seconds"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="videoFile" className="block text-sm font-medium text-gray-400 mb-1">
                Video File
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="videoFile"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-all duration-300"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaFileVideo className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">MP4, WebM, AVI, MKV, FLV, or MOV (MAX. 500MB)</p>
                  </div>
                  <input
                    id="videoFile"
                    type="file"
                    accept="video/mp4,video/x-msvideo,video/x-matroska,video/x-flv,video/webm,video/quicktime"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'video')}
                    ref={videoInputRef}
                  />
                </label>
              </div>
              {videoFile && <p className="mt-2 text-sm text-gray-400">Selected: {videoFile.name}</p>}
            </div>

            <div>
              <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-400 mb-1">
                Thumbnail
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="thumbnail"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-all duration-300"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaImage className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">JPEG, PNG, GIF, or WebP (MAX. 5MB)</p>
                  </div>
                  <input
                    id="thumbnail"
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'thumbnail')}
                    ref={thumbnailInputRef}
                  />
                </label>
              </div>
              {thumbnail && <p className="mt-2 text-sm text-gray-400">Selected: {thumbnail.name}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={uploading}
              className={`w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? (
                <>
                  <FaCloudUploadAlt className="animate-bounce mr-2" />
                  Uploading... {progress}%
                </>
              ) : (
                <>
                  <FaCloudUploadAlt className="mr-2" />
                  Upload Video
                </>
              )}
            </button>
          </div>

          {uploading && (
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Upload Progress
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${progress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                ></div>
              </div>
            </div>
          )}

          {uploadedVideoId && (
            <div className="mt-4 p-4 bg-green-800 rounded-md">
              <p className="text-green-200">
                Video uploaded successfully! Video ID: {uploadedVideoId}
              </p>
            </div>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            <FaInfoCircle className="inline-block mr-2" />
            Make sure your video complies with our community guidelines
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;

