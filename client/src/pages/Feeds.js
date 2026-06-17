import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Feeds() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [newComments, setNewComments] = useState({});
  const currentUserId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/feeds');
      setPosts(response.data || []);
      setError('');
    } catch (err) {
      console.error('Fetch posts error:', err);
      setError('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      await axios.post('http://localhost:5000/api/feeds', {
        user_id: currentUserId,
        content: newPost,
        title: newPost.substring(0, 50),
      });
      setNewPost('');
      await fetchPosts();
    } catch (err) {
      console.error('Create post error:', err);
      setError('Failed to create post');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      await axios.post(`http://localhost:5000/api/feeds/${postId}/like`, {
        user_id: currentUserId,
      });
      
      // Update UI optimistically
      const newLiked = new Set(likedPosts);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      setLikedPosts(newLiked);
      await fetchPosts();
    } catch (err) {
      console.error('Like post error:', err);
    }
  };

  const handleAddComment = async (postId) => {
    const commentText = newComments[postId];
    if (!commentText?.trim()) return;

    try {
      await axios.post(`http://localhost:5000/api/feeds/${postId}/comment`, {
        user_id: currentUserId,
        content: commentText,
      });
      
      setNewComments({ ...newComments, [postId]: '' });
      await fetchPosts();
    } catch (err) {
      console.error('Add comment error:', err);
    }
  };

  const toggleComments = (postId) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return postDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {/* Create Post Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Your Thoughts</h2>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="What's on your mind? Share your teaching experience, tips, or ask questions..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 resize-none"
              rows="4"
            />
            <button
              type="submit"
              disabled={!newPost.trim()}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold"
            >
              Post
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Posts Feed */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4 mx-auto"></div>
              <p className="text-gray-600">Loading feed...</p>
            </div>
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Post Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {post.user_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{post.user_name || 'Anonymous User'}</h3>
                    <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-6 py-4">
                  <p className="text-gray-800 leading-relaxed">{post.content || post.title}</p>
                </div>

                {/* Post Stats */}
                <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
                  <span>❤️ {post.likes_count || 0} likes</span>
                  <span>💬 {post.comments_count || 0} comments</span>
                </div>

                {/* Post Actions */}
                <div className="px-6 py-3 border-t border-gray-200 flex gap-4">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className={`flex-1 py-2 rounded-lg transition font-semibold flex items-center justify-center gap-2 ${
                      likedPosts.has(post.id)
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ❤️ Like
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    className="flex-1 bg-gray-100 text-gray-600 hover:bg-gray-200 py-2 rounded-lg transition font-semibold flex items-center justify-center gap-2"
                  >
                    💬 Comment
                  </button>
                </div>

                {/* Comments Section */}
                {expandedComments.has(post.id) && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 space-y-4">
                    {/* Existing Comments */}
                    {post.comments && post.comments.length > 0 ? (
                      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                        {post.comments.map((comment, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                                {comment.user_name?.[0]?.toUpperCase() || '?'}
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-sm text-gray-900">{comment.user_name}</p>
                                <p className="text-xs text-gray-500">{formatDate(comment.created_at)}</p>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm text-center py-2">No comments yet</p>
                    )}

                    {/* Add Comment */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAddComment(post.id);
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={newComments[post.id] || ''}
                        onChange={(e) => setNewComments({ ...newComments, [post.id]: e.target.value })}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 text-sm"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                      >
                        Reply
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-3xl mb-4">📢</p>
            <p className="text-xl text-gray-600 mb-2">No posts yet</p>
            <p className="text-gray-500">Be the first to share your thoughts with the community!</p>
          </div>
        )}
      </div>
    </div>
  );
}
