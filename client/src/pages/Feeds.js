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

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f0f9ff, #e0e7ff)',
      paddingTop: '2rem',
      paddingBottom: 'calc(2rem + max(6rem, env(safe-area-inset-bottom)))',
    },
    wrapper: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '0 1rem',
    },
    spaceY: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    createPostCard: {
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      padding: '1.5rem',
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '1rem',
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      fontFamily: 'inherit',
      minHeight: '100px',
      resize: 'vertical',
      boxSizing: 'border-box',
      marginBottom: '1rem',
    },
    submitButton: {
      width: '100%',
      background: '#2563eb',
      color: 'white',
      padding: '0.5rem 1.5rem',
      borderRadius: '0.375rem',
      border: 'none',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background 0.2s',
    },
    errorBox: {
      background: '#fecaca',
      border: '1px solid #f87171',
      color: '#991b1b',
      padding: '1rem',
      borderRadius: '0.375rem',
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '3rem',
      paddingBottom: '3rem',
    },
    spinner: {
      width: '3rem',
      height: '3rem',
      border: '4px solid #dbeafe',
      borderTop: '4px solid #2563eb',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '1rem',
    },
    postCard: {
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      overflow: 'hidden',
    },
    postHeader: {
      padding: '1.5rem',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    avatar: {
      width: '3rem',
      height: '3rem',
      borderRadius: '50%',
      background: '#2563eb',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
    postInfo: {
      flex: 1,
    },
    userName: {
      fontWeight: 'bold',
      color: '#111827',
    },
    postTime: {
      fontSize: '0.75rem',
      color: '#9ca3af',
    },
    postContent: {
      padding: '1.5rem',
    },
    postText: {
      color: '#1f2937',
      lineHeight: '1.5',
    },
    postStats: {
      padding: '0.75rem 1.5rem',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.875rem',
      color: '#6b7280',
    },
    postActions: {
      padding: '0.75rem 1.5rem',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      gap: '1rem',
    },
    actionButton: {
      flex: 1,
      padding: '0.5rem',
      borderRadius: '0.375rem',
      border: 'none',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    commentsSection: {
      padding: '1.5rem',
      background: '#f9fafb',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    commentBox: {
      background: 'white',
      padding: '0.75rem',
      borderRadius: '0.375rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    commentHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginBottom: '0.5rem',
    },
    smallAvatar: {
      width: '2rem',
      height: '2rem',
      borderRadius: '50%',
      background: '#4f46e5',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
      fontWeight: 'bold',
    },
    commentUserName: {
      fontWeight: 'bold',
      fontSize: '0.875rem',
      color: '#111827',
    },
    commentTime: {
      fontSize: '0.75rem',
      color: '#9ca3af',
    },
    commentText: {
      fontSize: '0.875rem',
      color: '#1f2937',
    },
    addCommentForm: {
      display: 'flex',
      gap: '0.5rem',
    },
    commentInput: {
      flex: 1,
      padding: '0.5rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
    },
    emptyState: {
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      padding: '3rem',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={styles.wrapper}>
        <div style={styles.spaceY}>
          {/* Create Post Section */}
          <div style={styles.createPostCard}>
            <h2 style={styles.cardTitle}>Share Your Thoughts</h2>
            <form onSubmit={handleCreatePost}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind? Share your teaching experience, tips, or ask questions..."
                style={styles.textarea}
              />
              <button
                type="submit"
                disabled={!newPost.trim()}
                onMouseEnter={(e) => !newPost.trim() ? null : (e.target.style.background = '#1d4ed8')}
                onMouseLeave={(e) => !newPost.trim() ? null : (e.target.style.background = '#2563eb')}
                style={{
                  ...styles.submitButton,
                  opacity: !newPost.trim() ? 0.5 : 1,
                  cursor: !newPost.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                Post
              </button>
            </form>
          </div>

          {/* Error Message */}
          {error && <div style={styles.errorBox}>{error}</div>}

          {/* Posts Feed */}
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={{color: '#6b7280'}}>Loading feed...</p>
            </div>
          ) : posts.length > 0 ? (
            <div style={styles.spaceY}>
              {posts.map((post) => (
                <div key={post.id} style={styles.postCard}>
                  {/* Post Header */}
                  <div style={styles.postHeader}>
                    <div style={styles.avatar}>
                      {post.user_name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div style={styles.postInfo}>
                      <div style={styles.userName}>{post.user_name || 'Anonymous User'}</div>
                      <div style={styles.postTime}>{formatDate(post.created_at)}</div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div style={styles.postContent}>
                    <p style={styles.postText}>{post.content || post.title}</p>
                  </div>

                  {/* Post Stats */}
                  <div style={styles.postStats}>
                    <span>❤️ {post.likes_count || 0} likes</span>
                    <span>💬 {post.comments_count || 0} comments</span>
                  </div>

                  {/* Post Actions */}
                  <div style={styles.postActions}>
                    <button
                      onClick={() => handleLikePost(post.id)}
                      style={{
                        ...styles.actionButton,
                        background: likedPosts.has(post.id) ? '#fee2e2' : '#f3f4f6',
                        color: likedPosts.has(post.id) ? '#dc2626' : '#4b5563',
                      }}
                      onMouseEnter={(e) => e.target.style.background = likedPosts.has(post.id) ? '#fecaca' : '#e5e7eb'}
                      onMouseLeave={(e) => e.target.style.background = likedPosts.has(post.id) ? '#fee2e2' : '#f3f4f6'}
                    >
                      ❤️ Like
                    </button>
                    <button
                      onClick={() => toggleComments(post.id)}
                      style={{
                        ...styles.actionButton,
                        background: '#f3f4f6',
                        color: '#4b5563',
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                      onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
                    >
                      💬 Comment
                    </button>
                  </div>

                  {/* Comments Section */}
                  {expandedComments.has(post.id) && (
                    <div style={styles.commentsSection}>
                      {/* Existing Comments */}
                      {post.comments && post.comments.length > 0 ? (
                        <div style={{...styles.spaceY, maxHeight: '12rem', overflowY: 'auto'}}>
                          {post.comments.map((comment, idx) => (
                            <div key={idx} style={styles.commentBox}>
                              <div style={styles.commentHeader}>
                                <div style={styles.smallAvatar}>
                                  {comment.user_name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <div>
                                  <div style={styles.commentUserName}>{comment.user_name}</div>
                                  <div style={styles.commentTime}>{formatDate(comment.created_at)}</div>
                                </div>
                              </div>
                              <p style={styles.commentText}>{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{color: '#6b7280', textAlign: 'center', paddingTop: '1rem', paddingBottom: '1rem'}}>No comments yet</p>
                      )}

                      {/* Add Comment */}
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddComment(post.id);
                        }}
                        style={styles.addCommentForm}
                      >
                        <input
                          type="text"
                          value={newComments[post.id] || ''}
                          onChange={(e) => setNewComments({ ...newComments, [post.id]: e.target.value })}
                          placeholder="Add a comment..."
                          style={styles.commentInput}
                        />
                        <button
                          type="submit"
                          style={{
                            ...styles.actionButton,
                            background: '#2563eb',
                            color: 'white',
                            flex: '0 0 auto',
                            width: 'auto',
                            padding: '0.5rem 1rem',
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                          onMouseLeave={(e) => e.target.style.background = '#2563eb'}
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
            <div style={styles.emptyState}>
              <p style={{fontSize: '2rem', marginBottom: '1rem'}}>📢</p>
              <p style={{fontSize: '1.25rem', color: '#6b7280', marginBottom: '0.5rem'}}>No posts yet</p>
              <p style={{color: '#9ca3af'}}>Be the first to share your thoughts with the community!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
