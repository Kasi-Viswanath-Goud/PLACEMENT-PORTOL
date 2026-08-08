import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, User, Building2 } from 'lucide-react';

export const Messages = () => {
  const { user, token } = useAuth();
  const userId = user?._id || user?.id;
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, [token]);

  useEffect(() => {
    if (activeConv) fetchMessages(activeConv._id);
  }, [activeConv]);

  useEffect(() => {
    // Scroll to bottom when messages load
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/messages/conversations', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
        if (data.length > 0 && !activeConv) setActiveConv(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const res = await fetch(`/api/messages/${convId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) setMessages(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;

    // The other user's ID is needed for the API. We extract it from the conversation ID.
    const ids = activeConv._id.split('_');
    const receiverId = ids[0] === userId ? ids[1] : ids[0];

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ receiverId, content: newMessage })
      });
      if (res.ok) {
        const { data } = await res.json();
        setMessages([...messages, data]);
        setNewMessage('');
        // Ideally update the conversation lastMessage in state as well
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem', height: 'calc(100vh - 80px)' }}>
      
      <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', height: '100%', overflow: 'hidden' }}>
        
        {/* Sidebar */}
        <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} /> Messages
            </h2>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}><div className="spinner" style={{ margin: '0 auto' }}></div></div>
            ) : conversations.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No active conversations.
              </div>
            ) : (
              conversations.map(conv => (
                <div 
                  key={conv._id}
                  onClick={() => setActiveConv(conv)}
                  style={{ 
                    padding: '1.25rem 1rem', 
                    cursor: 'pointer',
                    background: activeConv?._id === conv._id ? 'rgba(99,102,241,0.1)' : 'transparent',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    borderLeft: activeConv?._id === conv._id ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {conv.otherUser?.role === 'company' ? <Building2 size={20} color="var(--text-muted)" /> : <User size={20} color="var(--text-muted)" />}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {conv.otherUser?.name || 'Recruiter'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: conv.unread > 0 ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: conv.unread > 0 ? 600 : 400 }}>
                      {conv.lastMessage?.content || 'Say hello...'}
                    </div>
                  </div>
                  {conv.unread > 0 && (
                    <div style={{ background: 'var(--accent-primary)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: '9999px' }}>
                      {conv.unread}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)' }}>
          {activeConv ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-card)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>
                  {activeConv.otherUser?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{activeConv.otherUser?.name || 'Recruiter'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activeConv.otherUser?.role === 'company' ? activeConv.otherUser?.companyName : 'Student'}</div>
                </div>
              </div>

              {/* Messages History */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map(msg => {
                  const isMine = msg.senderId === userId;
                  return (
                    <div key={msg._id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                      <div style={{ 
                        maxWidth: '70%', 
                        padding: '0.75rem 1rem', 
                        borderRadius: 'var(--radius-lg)',
                        background: isMine ? 'var(--accent-primary)' : 'var(--bg-primary)',
                        color: isMine ? '#fff' : 'var(--text-primary)',
                        border: isMine ? 'none' : '1px solid var(--border-color)',
                        borderBottomRightRadius: isMine ? '4px' : 'var(--radius-lg)',
                        borderBottomLeftRadius: isMine ? 'var(--radius-lg)' : '4px'
                      }}>
                        <div style={{ fontSize: '0.95rem', lineHeight: 1.5 }}>{msg.content}</div>
                        <div style={{ fontSize: '0.7rem', opacity: 0.7, marginTop: '0.25rem', textAlign: 'right' }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div style={{ padding: '1.25rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                <form onSubmit={sendMessage} style={{ display: 'flex', gap: '1rem' }}>
                  <input 
                    type="text" 
                    placeholder="Type a message..." 
                    style={{ flex: 1, background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '9999px', padding: '0.75rem 1.25rem', color: 'var(--text-primary)', outline: 'none' }}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="btn-primary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0 }} disabled={!newMessage.trim()}>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              <MessageSquare size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Messages;
