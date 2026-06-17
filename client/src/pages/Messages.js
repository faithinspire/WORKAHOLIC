import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Messages() {
  const { userId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState('');
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    fetchConversations();
    if (userId) {
      setSelectedConversation(userId);
      fetchMessages(userId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/messages/conversations/${currentUserId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setConversations(response.data || []);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    }
  };

  const fetchMessages = async (conversationUserId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/messages/${currentUserId}/${conversationUserId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages(response.data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConversation = (userId) => {
    setSelectedConversation(userId);
    fetchMessages(userId);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await axios.post('http://localhost:5000/api/messages/send', {
        sender_id: currentUserId,
        receiver_id: selectedConversation,
        content: newMessage,
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setNewMessage('');
      await fetchMessages(selectedConversation);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f0f9ff, #e0e7ff)',
      display: 'flex',
      padding: '1rem',
      paddingBottom: 'calc(1rem + max(6rem, env(safe-area-inset-bottom)))',
    },
    wrapper: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      gap: '1rem',
      background: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      minHeight: 'calc(100vh - 120px)',
    },
    sidebar: {
      width: '300px',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f9fafb',
    },
    sidebarHeader: {
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb',
    },
    sidebarTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1e3a8a',
    },
    conversationsList: {
      flex: 1,
      overflowY: 'auto',
    },
    conversationItem: {
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: 'transparent',
      border: 'none',
      width: '100%',
      textAlign: 'left',
    },
    conversationName: {
      fontWeight: '600',
      color: '#1e3a8a',
      marginBottom: '0.25rem',
    },
    conversationPreview: {
      fontSize: '0.875rem',
      color: '#6b7280',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    chatHeader: {
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb',
      background: '#f9fafb',
    },
    chatTitle: {
      fontSize: '1.125rem',
      fontWeight: 'bold',
      color: '#1e3a8a',
    },
    messagesContainer: {
      flex: 1,
      overflowY: 'auto',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    messageGroup: {
      display: 'flex',
      gap: '0.75rem',
    },
    messageGroupOwn: {
      justifyContent: 'flex-end',
    },
    messageBubble: {
      maxWidth: '60%',
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      wordWrap: 'break-word',
    },
    messageBubbleOther: {
      background: '#e5e7eb',
      color: '#1f2937',
    },
    messageBubbleOwn: {
      background: '#2563eb',
      color: 'white',
    },
    messageTime: {
      fontSize: '0.75rem',
      color: '#9ca3af',
      marginTop: '0.25rem',
      textAlign: 'center',
    },
    inputArea: {
      padding: '1rem',
      borderTop: '1px solid #e5e7eb',
      background: '#f9fafb',
      display: 'flex',
      gap: '0.75rem',
    },
    input: {
      flex: 1,
      padding: '0.75rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.375rem',
      fontSize: '1rem',
      fontFamily: 'inherit',
    },
    sendButton: {
      background: '#2563eb',
      color: 'white',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s',
    },
    emptyState: {
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      height: '100%',
      color: '#6b7280',
    },
    emptyStateIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    selectedConversationItem: {
      background: '#dbeafe',
      borderLeft: '4px solid #2563eb',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h2 style={styles.sidebarTitle}>Messages</h2>
          </div>
          <div style={styles.conversationsList}>
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <button
                  key={conv.user_id}
                  style={{
                    ...styles.conversationItem,
                    ...(selectedConversation === conv.user_id ? styles.selectedConversationItem : {}),
                  }}
                  onClick={() => handleSelectConversation(conv.user_id)}
                  onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.background = selectedConversation === conv.user_id ? '#dbeafe' : 'transparent'}
                >
                  <div style={styles.conversationName}>{conv.user_name}</div>
                  <div style={styles.conversationPreview}>{conv.last_message || 'No messages yet'}</div>
                </button>
              ))
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af' }}>
                No conversations yet
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div style={styles.chatHeader}>
                <h3 style={styles.chatTitle}>
                  {conversations.find(c => c.user_id === selectedConversation)?.user_name || 'Conversation'}
                </h3>
              </div>

              {/* Messages */}
              <div style={styles.messagesContainer}>
                {loading ? (
                  <div style={{ textAlign: 'center', color: '#6b7280' }}>Loading messages...</div>
                ) : messages.length > 0 ? (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        ...styles.messageGroup,
                        ...(msg.sender_id === currentUserId ? styles.messageGroupOwn : {}),
                      }}
                    >
                      <div
                        style={{
                          ...styles.messageBubble,
                          ...(msg.sender_id === currentUserId
                            ? styles.messageBubbleOwn
                            : styles.messageBubbleOther),
                        }}
                      >
                        {msg.content}
                        <div style={styles.messageTime}>
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={styles.emptyState}>
                    <div style={styles.emptyStateIcon}>💬</div>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} style={styles.inputArea}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  style={styles.input}
                />
                <button
                  type="submit"
                  style={styles.sendButton}
                  onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
                  onMouseLeave={(e) => e.target.style.background = '#2563eb'}
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateIcon}>📬</div>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
