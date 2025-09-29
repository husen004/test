"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, Send, ArrowUpCircle, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [wsMessages, setWsMessages] = useState<string[]>([]);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [wsStatus, setWsStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [wsMessage, setWsMessage] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5', {
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`HTTP ${response.status} ${response.statusText} ${text}`);
      }

      const data = await response.json();
      setPosts(data);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else if (err instanceof Error) {
        setError(`Error fetching posts. ${err.message || 'Please try again later.'}`);
      } else {
        setError('Error fetching posts. Please try again later.');
      }
      console.error('fetchPosts error:', err);
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append('title', formData.title);
      formDataToSubmit.append('body', formData.body);
      formDataToSubmit.append('userId', '1'); 

      if (selectedFile) {
        formDataToSubmit.append('file', selectedFile);
      }

      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.title,
          body: formData.body,
          userId: 1,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to submit post');
      }

      const result = await response.json();
      console.log('Submission result:', result);

      setPosts(prev => [result, ...prev]);
      
      setSubmitStatus('success');
      setFormData({ title: '', body: '' });
      setSelectedFile(null);

      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitStatus('idle');
      }, 2000);
    } catch (err: unknown) {
      console.error('Error submitting form:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const connectWebSocket = () => {
    setWsStatus('connecting');
    const ws = new WebSocket('wss://echo.websocket.org');

    ws.onopen = () => {
      setWsStatus('connected');
      setWsConnection(ws);
    };

    ws.onmessage = (event) => {
      setWsMessages(prev => [...prev, `Received: ${event.data}`]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setWsStatus('disconnected');
    };

    ws.onclose = () => {
      setWsStatus('disconnected');
      setWsConnection(null);
    };
  };

  const disconnectWebSocket = () => {
    if (wsConnection) {
      wsConnection.close();
      setWsConnection(null);
      setWsStatus('disconnected');
    }
  };

  const sendWebSocketMessage = () => {
    if (wsConnection && wsMessage.trim()) {
      wsConnection.send(wsMessage);
      setWsMessages(prev => [...prev, `Sent: ${wsMessage}`]);
      setWsMessage('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Open Modal Form
        </motion.button>
      </div>

      <section className="mb-10">
        
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading posts...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center bg-red-50 p-4 rounded-md text-red-800">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-3">{post.body}</p>
                <div className="mt-4 text-xs text-gray-500">Post ID: {post.id}</div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-10 bg-gray-50 p-5 rounded-lg">
        
        <div className="flex flex-col md:flex-row gap-4 md:items-center mb-4">
          {wsStatus === 'disconnected' ? (
            <button 
              onClick={connectWebSocket}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Connect to WebSocket
            </button>
          ) : wsStatus === 'connecting' ? (
            <button 
              disabled
              className="bg-yellow-500 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Connecting...
            </button>
          ) : (
            <button 
              onClick={disconnectWebSocket}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Disconnect
            </button>
          )}
          
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={wsMessage}
              onChange={(e) => setWsMessage(e.target.value)}
              disabled={wsStatus !== 'connected'}
              placeholder={wsStatus === 'connected' ? "Type a message to echo" : "Connect to send messages"}
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendWebSocketMessage}
              disabled={wsStatus !== 'connected' || !wsMessage.trim()}
              className={`px-4 py-2 rounded-md flex items-center ${
                wsStatus === 'connected' && wsMessage.trim() 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </button>
          </div>
        </div>
        
        <div className="bg-black text-green-400 p-4 rounded-md h-40 overflow-y-auto font-mono text-sm">
          {wsMessages.length > 0 ? (
            wsMessages.map((msg, idx) => (
              <div key={idx} className="mb-1">&gt; {msg}</div>
            ))
          ) : (
            <div className="text-gray-500 italic">
              {wsStatus === 'connected' 
                ? 'Connected. Send a message to see it echoed back.' 
                : 'Not connected to WebSocket server. Connect to start.'}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="flex justify-between items-center p-5 border-b">
                <h3 className="text-xl font-semibold">Create New Post</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5">
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
                    Body
                  </label>
                  <textarea
                    id="body"
                    name="body"
                    value={formData.body}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                    Attach File
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg tracking-wide border border-blue-200 cursor-pointer hover:bg-blue-50"
                    >
                      <ArrowUpCircle className="w-8 h-8" />
                      <span className="mt-2 text-base">
                        {selectedFile ? selectedFile.name : "Select a file"}
                      </span>
                      <input
                        id="file-upload"
                        name="file"
                        type="file"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {selectedFile && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">
                        File size: {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                      
                      {/* File preview section */}
                      <div className="border border-gray-200 rounded-md p-3 bg-gray-50">
                        <p className="text-sm font-medium mb-2">Preview:</p>
                        {selectedFile.type.startsWith('image/') ? (
                          <div className="flex justify-center">
                            <Image 
                              src={URL.createObjectURL(selectedFile)} 
                              alt={selectedFile.name}
                              className="max-h-48 max-w-full object-contain rounded"
                            />
                          </div>
                        ) : selectedFile.type === 'application/pdf' ? (
                          <div className="flex items-center text-sm">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded mr-2">PDF</span>
                            <span>{selectedFile.name}</span>
                          </div>
                        ) : selectedFile.type.includes('word') || selectedFile.type.includes('document') ? (
                          <div className="flex items-center text-sm">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">DOC</span>
                            <span>{selectedFile.name}</span>
                          </div>
                        ) : selectedFile.type.includes('spreadsheet') || selectedFile.type.includes('excel') ? (
                          <div className="flex items-center text-sm">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded mr-2">XLS</span>
                            <span>{selectedFile.name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-sm">
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded mr-2">FILE</span>
                            <span>{selectedFile.name}</span>
                          </div>
                        )}
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center"
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Remove file
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mr-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Submitting...
                      </>
                    ) : submitStatus === 'success' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Success!
                      </>
                    ) : submitStatus === 'error' ? (
                      <>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Error! Try again
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
