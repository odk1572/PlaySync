import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaThumbsUp, FaTrash, FaEdit, FaReply, FaTimes, FaSpinner } from 'react-icons/fa';
import { UserContext } from '../../UserContextProvider';
import { motion, AnimatePresence } from 'framer-motion';

const Comments = ({ videoId }) => {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [videoId, page]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://playsync-1-7xxc.onrender.com/api/v1/comments/${videoId}?page=${page}&limit=10`, {
        withCredentials: true,
      });
      if (page === 1) {
        setComments(response.data.data);
      } else {
        setComments(prevComments => [...prevComments, ...response.data.data]);
      }
      setHasMore(response.data.data.length === 10);
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to add a comment');
      return;
    }
    try {
      const response = await axios.post(`https://playsync-1-7xxc.onrender.com/api/v1/comments/${videoId}`, {
        content: newComment
      }, {
        withCredentials: true,
      });
      setComments([response.data.data, ...comments]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const response = await axios.patch(`https://playsync-1-7xxc.onrender.com/api/v1/comments/c/${commentId}`, {
        content: editingComment.content
      }, {
        withCredentials: true,
      });
      setComments(prevComments =>
        prevComments.map(comment =>
          comment._id === commentId ? response.data.data : comment
        )
      );
      setEditingComment(null);
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`https://playsync-1-7xxc.onrender.com/api/v1/comments/c/${commentId}`, {
        withCredentials: true,
      });
      setComments(prevComments =>
        prevComments.filter(comment => comment._id !== commentId)
      );
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      toast.error('Please log in to like a comment');
      return;
    }
    try {
      await axios.post(`https://playsync-1-7xxc.onrender.com/api/v1/likes/toggle/c/${commentId}`, {}, {
        withCredentials: true,
      });
      setComments(prevComments =>
        prevComments.map(comment =>
          comment._id === commentId
            ? {
                ...comment,
                isLiked: !comment.isLiked,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              }
            : comment
        )
      );
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const CommentItem = ({ comment }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 p-4 rounded-lg mb-4"
    >
      {editingComment && editingComment._id === comment._id ? (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdateComment(comment._id); }}>
          <textarea
            value={editingComment.content}
            onChange={(e) => setEditingComment({ ...editingComment, content: e.target.value })}
            className="w-full p-2 text-gray-900 rounded-lg mb-2"
            rows="3"
          />
          <div className="flex justify-end space-x-2">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Save
            </button>
            <button onClick={() => setEditingComment(null)} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-start mb-2">
            <img 
              src={comment.owner?.avatar || '/placeholder.svg?height=40&width=40'} 
              alt={comment.owner?.username || 'Anonymous'} 
              className="w-10 h-10 rounded-full mr-3" 
            />
            <div>
              <p className="font-semibold">{comment.owner?.username || 'Anonymous'}</p>
              <p className="text-gray-400 text-sm">{new Date(comment.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <p className="mb-2">{comment.content}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button onClick={() => handleLikeComment(comment._id)} className="flex items-center space-x-1 text-gray-400 hover:text-blue-500">
                <FaThumbsUp className={comment.isLiked ? 'text-blue-500' : ''} />
                <span>{comment.likes} likes</span>
              </button>
            </div>
            {user && user._id === comment.owner?._id && (
              <div className="flex space-x-2">
                <button onClick={() => setEditingComment(comment)} className="text-gray-400 hover:text-yellow-500">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteComment(comment._id)} className="text-gray-400 hover:text-red-500">
                  <FaTrash />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );

  return (
    <div className="mb-8">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-center">Comments</h2>
      <form onSubmit={handleAddComment} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-4 text-gray-900 rounded-lg bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 transition duration-300"
          rows="3"
        />
        <button
          type="submit"
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center w-full sm:w-auto"
        >
          <FaReply className="mr-2" />
          Add Comment
        </button>
      </form>
      <div className="space-y-6">
        <AnimatePresence>
          {comments.map(comment => (
            <CommentItem key={comment._id} comment={comment} />
          ))}
        </AnimatePresence>
      </div>
      {loading && (
        <div className="flex justify-center items-center my-4">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      )}
      {hasMore && !loading && (
        <button
          onClick={() => setPage(prevPage => prevPage + 1)}
          className="mt-8 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition duration-300 flex items-center justify-center w-full sm:w-auto mx-auto"
        >
          Load More Comments
        </button>
      )}
    </div>
  );
};

export default Comments;

