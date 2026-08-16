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
    <div className="animate-fade-in" style={{ 
      height: '100%', 
      padding: '0 2rem 2rem 2rem', 
      display: 'flex', 
      flexDirection: 'column', 
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      
      <div className="glass-panel" style={{ 
        flex: 1, 
        display: 'grid', 
        gridTemplateColumns: '320px 1fr', 
        height: '100%', 
        overflow: 'hidden', 
        borderRadius: 'var(--radius-lg)' 
      }}>
        
        {/* Sidebar */}
        <div style={{ borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'var(--bg-secondary)', height: '100%' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', flexShrink: 0 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <MessageSquare size={20} color="var(--accent-primary)" /> Messages
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
                    padding: '1rem 1.25rem', 
                    cursor: 'pointer',
                    background: activeConv?._id === conv._id ? 'rgba(99,102,241,0.08)' : 'transparent',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    borderLeft: activeConv?._id === conv._id ? '3px solid var(--accent-primary)' : '3px solid transparent',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {conv.otherUser?.role === 'company' ? <Building2 size={20} color="var(--text-muted)" /> : <User size={20} color="var(--text-muted)" />}
                  </div>
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {conv.otherUser?.name || 'Recruiter'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '0.5rem' }}>
                        {conv.lastMessage?.createdAt ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.85rem', color: conv.unread > 0 ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: conv.unread > 0 ? 600 : 400 }}>
                        {conv.lastMessage?.content || 'Say hello...'}
                      </div>
                      {conv.unread > 0 && (
                        <div style={{ background: 'var(--success)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, minWidth: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '9999px', padding: '0 4px', flexShrink: 0, marginLeft: '0.5rem' }}>
                          {conv.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{ display: 'flex', flexDirection: 'column', background: '#0b141a', position: 'relative', height: '100%', minWidth: 0 }}>
          
          {/* WhatsApp Doodle Background Pattern */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            opacity: 0.08, 
            backgroundImage: 'url("https://static.whatsapp.net/rsrc.php/v3/y8/r/2eJ_3p9-O2Z.png")', 
            backgroundRepeat: 'repeat',
            backgroundSize: '400px',
            zIndex: 0, 
            pointerEvents: 'none' 
          }} />

          {activeConv ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '10px 16px', height: '65px', borderBottom: '1px solid #222d34', display: 'flex', alignItems: 'center', gap: '15px', background: '#202c33', zIndex: 1, boxSizing: 'border-box', flexShrink: 0 }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dfe5e7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#54656f', fontWeight: 600, fontSize: '1.2rem', flexShrink: 0 }}>
                  {activeConv.otherUser?.name?.charAt(0) || 'U'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
                  <div style={{ fontWeight: 400, fontSize: '1rem', color: '#e9edef', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{activeConv.otherUser?.name || 'Recruiter'}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#8696a0', marginTop: '2px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{activeConv.otherUser?.role === 'company' ? activeConv.otherUser?.companyName : 'Student'}</div>
                </div>
              </div>

              {/* Messages History */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 5%', display: 'flex', flexDirection: 'column', gap: '2px', zIndex: 1 }}>
                {messages.map((msg, index) => {
                  const isMine = msg.senderId === userId;
                  const showTail = index === 0 || messages[index - 1]?.senderId !== msg.senderId;
                  const marginT = showTail && index !== 0 ? '12px' : '2px';

                  return (
                    <div key={msg._id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginTop: marginT, width: '100%' }}>
                      <div style={{ 
                        maxWidth: '75%', 
                        minWidth: '100px',
                        padding: '6px 7px 8px 9px', 
                        borderRadius: '7.5px',
                        background: isMine ? '#005c4b' : '#202c33',
                        color: '#e9edef',
                        borderTopRightRadius: isMine && showTail ? '0px' : '7.5px',
                        borderTopLeftRadius: !isMine && showTail ? '0px' : '7.5px',
                        boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
                        position: 'relative'
                      }}>
                        {/* The little tail SVG */}
                        {showTail && isMine && (
                          <svg viewBox="0 0 8 13" width="8" height="13" style={{ position: 'absolute', top: 0, right: '-8px', color: '#005c4b' }}>
                            <path opacity=".13" fill="#0000000" d="M1.533 3.118L8 12.118V1H2.8z"></path>
                            <path fill="currentColor" d="M1.533 2.118L8 11.118V0H2.8z"></path>
                          </svg>
                        )}
                        {showTail && !isMine && (
                          <svg viewBox="0 0 8 13" width="8" height="13" style={{ position: 'absolute', top: 0, left: '-8px', color: '#202c33' }}>
                            <path opacity=".13" fill="#0000000" d="M1.533 3.118L8 12.118V1H2.8z" transform="scale(-1, 1) translate(-8, 0)"></path>
                            <path fill="currentColor" d="M1.533 2.118L8 11.118V0H2.8z" transform="scale(-1, 1) translate(-8, 0)"></path>
                          </svg>
                        )}

                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.9rem', lineHeight: '19px', wordWrap: 'break-word', whiteSpace: 'pre-wrap', paddingRight: '15px' }}>
                            {msg.content}
                          </span>
                          <div style={{ 
                            fontSize: '0.6875rem', 
                            color: 'rgba(255,255,255,0.6)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '3px',
                            marginLeft: 'auto',
                            marginTop: '-10px',
                            float: 'right',
                            position: 'relative',
                            bottom: '-4px'
                          }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMine && (
                              <svg viewBox="0 0 16 15" width="16" height="15" style={{ color: '#53bdeb' }}>
                                <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/>
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div style={{ minHeight: '62px', padding: '10px 16px', background: '#202c33', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <form onSubmit={sendMessage} style={{ display: 'flex', gap: '12px', alignItems: 'center', width: '100%', maxWidth: '900px' }}>
                  <div style={{ flex: 1, background: '#2a3942', borderRadius: '8px', padding: '9px 12px', display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      placeholder="Type a message" 
                      style={{ 
                        width: '100%', 
                        background: 'transparent', 
                        border: 'none', 
                        color: '#d1d7db', 
                        outline: 'none', 
                        fontSize: '0.9375rem',
                        fontFamily: 'inherit'
                      }}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                  </div>
                  <button 
                    type="submit" 
                    style={{ 
                      background: 'transparent', 
                      border: 'none', 
                      color: newMessage.trim() ? '#00a884' : '#8696a0', 
                      cursor: newMessage.trim() ? 'pointer' : 'default',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      padding: '8px',
                      transition: 'color 0.2s',
                      flexShrink: 0
                    }} 
                    disabled={!newMessage.trim()}
                  >
                    <Send size={24} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#8696a0', zIndex: 1 }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <svg viewBox="0 0 100 100" width="100" height="100" opacity="0.3">
                  <path fill="currentColor" d="M50 0C22.4 0 0 22.4 0 50c0 11.2 3.7 21.6 10 29.8L5 95l16.1-4.7C29.6 97 39.5 100 50 100c27.6 0 50-22.4 50-50S77.6 0 50 0zm0 91.7c-9.5 0-18.4-2.8-25.7-7.7l-1.8-1.1-10 2.9 3-9.5-1.2-1.9C9 66.8 6.2 58.7 6.2 50c0-23 18.7-41.7 41.7-41.7S89.6 27 89.6 50 70.9 91.7 50 91.7z"/>
                </svg>
              </div>
              <h1 style={{ marginBottom: '1rem', color: '#e9edef', fontSize: '2rem', fontWeight: 300 }}>WhatsApp Web (Clone)</h1>
              <p style={{ fontSize: '0.875rem' }}>Select a conversation from the sidebar to start messaging.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Messages;
