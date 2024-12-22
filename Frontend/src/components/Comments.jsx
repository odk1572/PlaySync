import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaThumbsUp, FaTrash, FaEdit } from 'react-icons/fa';
import { UserContext } from '../../UserContextProvider'; // Adjust the import path as needed

const Comments = ({ videoId }) => {
  const { user } = useContext(UserContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [videoId, page]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/v1/comments/${videoId}?page=${page}&limit=10`, {
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
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to add a comment');
      return;
    }
    try {
      const response = await axios.post(`http://localhost:8000/api/v1/comments/${videoId}`, {
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
      const response = await axios.patch(`http://localhost:8000/api/v1/comments/c/${commentId}`, {
        content: editingComment.content
      }, {
        withCredentials: true,
      });
      setComments(comments.map(comment => 
        comment._id === commentId ? response.data.data : comment
      ));
      setEditingComment(null);
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error('Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/comments/c/${commentId}`, {
        withCredentials: true,
      });
      setComments(comments.filter(comment => comment._id !== commentId));
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
      await axios.post(`http://localhost:8000/api/v1/likes/toggle/c/${commentId}`, {}, {
        withCredentials: true,
      });
      setComments(comments.map(comment => 
        comment._id === commentId 
          ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 } 
          : comment
      ));
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      <form onSubmit={handleAddComment} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="w-full p-2 text-gray-900 rounded-lg"
          rows="3"
        />
        <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add Comment
        </button>
      </form>
      <div className="space-y-4">
      {comments.map(comment => (
  <div key={comment._id} className="bg-gray-800 p-4 rounded-lg">
    {editingComment && editingComment._id === comment._id ? (
      <form onSubmit={() => handleUpdateComment(comment._id)}>
        <textarea
          value={editingComment.content}
          onChange={(e) => setEditingComment({...editingComment, content: e.target.value})}
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
        <div className="flex items-center space-x-4 mb-2">
          {/* Check if comment.owner is defined */}
          {comment.owner ? (
            <>
              <img 
                src={comment.owner.avatar || '/default-avatar.png'} 
                alt={comment.owner.username} 
                className="w-10 h-10 rounded-full" 
              />
              <div>
                <p className="font-bold">{comment.owner.fullName || 'Unknown User'}</p>
                <p className="text-sm text-gray-400">@{comment.owner.username || 'unknown'}</p>
              </div>
            </>
          ) : (
            <div className="text-gray-400">Anonymous</div>
          )}
        </div>
        <p className="mb-2">{comment.content}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button onClick={() => handleLikeComment(comment._id)} className="text-gray-400 hover:text-blue-500">
              <FaThumbsUp className={comment.isLiked ? 'text-blue-500' : ''} />
            </button>
            <span>{comment.likes} likes</span>
          </div>
          {user && user._id === comment.owner._id && (
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
  </div>
))}

      </div>
      {hasMore && (
        <button 
          onClick={() => setPage(prevPage => prevPage + 1)} 
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          Load More Comments
        </button>
      )}
    </div>
  );
};

export default Comments;
