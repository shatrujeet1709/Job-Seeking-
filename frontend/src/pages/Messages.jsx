import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import api from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Send, MessageCircle, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function Messages() {
  const { user } = useSelector(s => s.auth);
  const { userId } = useParams();
  const [inbox, setInbox] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChat, setActiveChat] = useState(userId || null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { fetchInbox(); }, []);
  useEffect(() => { if (activeChat) fetchConvo(activeChat); }, [activeChat]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const fetchInbox = async () => { try { setInbox((await api.get('/messages/inbox')).data); } catch { toast.error('Failed to load inbox'); } finally { setLoading(false); } };
  const fetchConvo = async (id) => { try { setMessages((await api.get(`/messages/${id}`)).data); } catch { toast.error('Failed to load'); } };
  const send = async (e) => {
    e.preventDefault(); if (!newMessage.trim() || !activeChat) return;
    setSending(true);
    try { const { data } = await api.post(`/messages/${activeChat}`, { content: newMessage.trim() }); setMessages(p => [...p, data]); setNewMessage(''); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setSending(false); }
  };
  const activePerson = inbox.find(i => i.partner?._id === activeChat)?.partner;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-black text-slate-900 mb-6">Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]">
        {/* Inbox */}
        <div className="card-elevated overflow-y-auto">
          <div className="p-4 border-b border-slate-100"><h2 className="font-semibold text-slate-900">Inbox</h2></div>
          {loading ? <div className="p-4 text-center text-slate-400">Loading...</div>
          : inbox.length === 0 ? (
            <div className="p-8 text-center text-slate-400"><MessageCircle size={40} className="mx-auto mb-3 opacity-40" /><p>No conversations yet</p></div>
          ) : inbox.map(conv => (
            <button key={conv.partner?._id} onClick={() => setActiveChat(conv.partner?._id)}
              className={`w-full text-left p-4 border-b border-slate-100 transition-colors hover:bg-slate-50 ${activeChat === conv.partner?._id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">{conv.partner?.name?.charAt(0)?.toUpperCase()}</div>
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 text-sm truncate">{conv.partner?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{conv.latestMessage}</p>
                </div>
                {conv.unread && <span className="w-2 h-2 bg-primary rounded-full shrink-0" />}
              </div>
            </button>
          ))}
        </div>

        {/* Chat */}
        <div className="md:col-span-2 card-elevated flex flex-col">
          {activeChat ? (
            <>
              <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <button onClick={() => setActiveChat(null)} className="md:hidden text-slate-400"><ArrowLeft size={20} /></button>
                <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm">{activePerson?.name?.charAt(0)?.toUpperCase() || '?'}</div>
                <span className="font-semibold text-slate-900">{activePerson?.name || 'User'}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => {
                  const isMe = msg.sender === user?.id || msg.sender === user?._id;
                  return (
                    <motion.div key={msg._id || i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                        isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                      }`}>
                        <p>{msg.content}</p>
                        <p className="text-[10px] mt-1 opacity-60">{msg.timestamp ? format(new Date(msg.timestamp), 'HH:mm') : ''}</p>
                      </div>
                    </motion.div>
                  );
                })}
                <div ref={endRef} />
              </div>
              <form onSubmit={send} className="p-4 border-t border-slate-100 flex gap-2">
                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..."
                  className="input-field flex-1" maxLength={5000} />
                <button type="submit" disabled={sending || !newMessage.trim()}
                  className="btn-primary px-4 py-2.5 disabled:opacity-50"><Send size={18} /></button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center"><MessageCircle size={48} className="mx-auto mb-3 opacity-30" /><p>Select a conversation</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
