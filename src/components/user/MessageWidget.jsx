import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { apiConnector } from '../../service/apiconnector';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { IoSearch } from 'react-icons/io5';
import { MdSend } from 'react-icons/md';
import img12 from '../../assets/img12.jpg';

const MessageWidget = () => {
  const { token } = useSelector((state) => state.auth);
  const userinfo = useSelector((state) => state.profile);
  
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  
  const socket = useMemo(
    () =>
      io('http://localhost:8000', {
        withCredentials: true,
      }),
    []
  );

  // Initialize socket
  useEffect(() => {
    if (socket && userinfo?.user?._id) {
      socket.on('connect', () => {
        console.log('Connected to socket');
      });

      socket.emit('addUser', userinfo.user._id);

      socket.on('getMessage', (data) => {
        if (selectedUser && data?.sender?._id === selectedUser?._id) {
          setMessages((prev) => [...prev, data]);
        }
      });
    }

    return () => {
      socket?.off('getMessage');
    };
  }, [socket, selectedUser, userinfo]);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch users to chat with
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Students should see Admins (use /api/get_users which returns admins for students)
        if (userinfo?.user?.accountType === 'Student') {
          const response = await apiConnector(
            'GET',
            `${process.env.REACT_APP_BASE_URL}/api/get_users`,
            null,
            {
              Authorization: `Bearer ${token}`,
            }
          );

          if (response.data?.users) {
            setConversations(response.data.users);
          } else {
            setConversations([]);
          }
        } else if (userinfo?.user?.accountType === 'Admin') {
          // Admins should see Students — use admin search endpoint and filter for students
          const response = await apiConnector(
            'GET',
            `${process.env.REACT_APP_BASE_URL}/api/v2/get_user_bysearch?searchTerm=${searchTerm}`,
            null,
            {
              Authorization: `Bearer ${token}`,
            }
          );

          if (response.data?.users) {
            // Filter only students to show in admin's conversation list
            const students = response.data.users.filter((u) => u.accountType === 'Student');
            setConversations(students);
          } else {
            setConversations([]);
          }
        } else {
          // Fallback: use search endpoint (kept for other roles)
          const response = await apiConnector(
            'GET',
            `${process.env.REACT_APP_BASE_URL}/api/v2/get_user_bysearch?searchTerm=${searchTerm}`,
            null,
            {
              Authorization: `Bearer ${token}`,
            }
          );

          if (response.data.users) {
            setConversations(response.data.users);
          } else {
            setConversations([]);
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [searchTerm, token, userinfo?.user?.accountType]);

  // Load chat history with selected user
  const loadChatHistory = async (user) => {
    try {
      setLoading(true);
      setSelectedUser(user);

      const response = await apiConnector(
        'GET',
        `${process.env.REACT_APP_BASE_URL}/api/create_chat?sender_id=${userinfo.user._id}&reciever_id=${user._id}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response.data.chat?.messages) {
        setMessages(response.data.chat.messages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!content.trim() || !selectedUser) {
      toast.error('Please select a user and type a message');
      return;
    }

    try {
      const message = {
        sender: userinfo.user.profile,
        reciever: selectedUser._id,
        content: content,
      };

      const response = await apiConnector(
        'POST',
        `${process.env.REACT_APP_BASE_URL}/api/start_chat?sender_id=${userinfo.user._id}&reciever_id=${selectedUser._id}`,
        message,
        {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      );

      const sentMessage = response.data.updatedChat.messages;
      const newReceiverId = response.data.updatedChat.participants.find(
        (participant) => participant !== userinfo.user._id
      );

      setContent('');
      setMessages((prev) => [...prev, sentMessage[sentMessage.length - 1]]);

      socket?.emit('sendMessage', {
        message: sentMessage[sentMessage.length - 1],
        reciever_id: newReceiverId,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  // Get initials for avatar
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 bg-richblue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-richblue-700 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[95vw] sm:w-96 max-h-[calc(100vh-140px)] bg-white rounded-lg shadow-2xl flex flex-col z-40 border border-gray-200">
      {/* Header */}
      <div className="bg-richblue-600 text-white p-4 rounded-t-lg flex items-center justify-between flex-shrink-0">
        <h3 className="font-bold text-lg">Messages</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="hover:bg-richblue-700 p-1 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex h-full overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center bg-white rounded-full px-3 py-2">
              <IoSearch className="text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border-0 outline-none text-sm ml-2"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto scrollbar">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">No conversations</div>
            ) : (
              conversations.map((user) => {
                // Support both user objects (with profile) and expert objects (expertname, imageUrl)
                const avatar = user.profile?.image || user.imageUrl || user.image || user.imageUrl;
                const firstName = user.profile?.firstname || user.expertname || user.firstname || user.name;
                const lastName = user.profile?.lastname || '';
                const subtitle = user.profile?.rollnumber || user.role || 'User';
                return (
                  <div
                    key={user._id}
                    onClick={() => loadChatHistory(user)}
                    className={`p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition ${
                      selectedUser?._id === user._id ? 'bg-blue-50 border-l-4 border-richblue-600' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-richblue-100 flex items-center justify-center flex-shrink-0">
                        {avatar ? (
                          <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-richblue-600">{getInitials(firstName, lastName)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{firstName} {lastName}</p>
                        <p className="text-xs text-gray-500 truncate">{subtitle}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col overflow-hidden">
          {selectedUser ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-richblue-100 flex items-center justify-center">
                    {selectedUser.profile?.image ? (
                      <img
                        src={selectedUser.profile.image}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-richblue-600">
                        {getInitials(selectedUser.profile?.firstname, selectedUser.profile?.lastname)}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {selectedUser.profile?.firstname} {selectedUser.profile?.lastname}
                    </p>
                    <p className="text-xs text-gray-500">Online</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto scrollbar p-4 bg-white min-h-0">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-richblue-600"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex mb-3 ${
                          message.sender._id === userinfo.user.profile ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            message.sender._id === userinfo.user.profile
                              ? 'bg-richblue-600 text-white'
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          <p className="text-sm break-words">{message.content}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {new Date(message.timestamp).toLocaleString('en-US', options)}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <div className="bg-white border-t border-gray-200 p-4 flex gap-2 flex-shrink-0">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-richblue-600"
                />
                <button
                  onClick={sendMessage}
                  className="bg-richblue-600 text-white rounded-full p-2 hover:bg-richblue-700 transition"
                >
                  <MdSend size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageWidget;
