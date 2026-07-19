// magna_ai_assistant/AssistantPortal.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import BentoWelcome from './BentoWelcome';
import ChatArea from './ChatArea';

// Premium Lucide-React Microphone Icon Asset rendered as a pure React SVG
const MicIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="#0f172a" // Crisp execution black color
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ display: 'block' }}
    >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
        <line x1="12" x2="12" y1="19" y2="22" />
    </svg>
);

export default function AssistantPortal({ isOpen, onClose }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [chatHistory, setChatHistory] = useState([
        { 
            id: '1', 
            title: 'Database Cluster Optimization', 
            messages: [
                { sender: 'user', text: 'Analyze the query performance metrics.' }, 
                { sender: 'bot', text: 'Telemetry streams connected. Database index configuration optimized successfully.' }
            ] 
        }
    ]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);

    const activeChat = chatHistory.find(c => c.id === currentChatId);
    const activeMessages = activeChat ? activeChat.messages : messages;

    // Premium Web Audio/Speech API Integration for real-time voice streaming
    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Voice intelligence is not supported or active in your current browser configuration.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        if (!isListening) {
            setIsListening(true);
            recognition.start();

            recognition.onresult = (event) => {
                const speechToText = event.results[0][0].transcript;
                setInput((prev) => prev + (prev ? ' ' : '') + speechToText);
            };

            recognition.onerror = (err) => {
                console.error("Speech Recognition Core Error:", err);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };
        }
    };

    const handleSend = (textToSend) => {
        const text = textToSend || input;
        if (!text.trim()) return;

        let activeId = currentChatId;
        let updatedHistory = [...chatHistory];

        if (!activeId) {
            activeId = Date.now().toString();
            const newChatSession = {
                id: activeId,
                title: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
                messages: []
            };
            updatedHistory = [newChatSession, ...updatedHistory];
            setCurrentChatId(activeId);
        }

        const sessionIndex = updatedHistory.findIndex(c => c.id === activeId);
        const updatedMessages = [...updatedHistory[sessionIndex].messages, { sender: 'user', text }];
        updatedHistory[sessionIndex].messages = updatedMessages;

        setChatHistory(updatedHistory);
        setInput('');

        setTimeout(() => {
            const finalHistory = [...updatedHistory];
            finalHistory[sessionIndex].messages = [
                ...updatedMessages,
                { sender: 'bot', text: `Telemetry processed successfully. All clusters running optimal configurations under current live workspace constraints.` }
            ];
            setChatHistory(finalHistory);
        }, 600);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(15, 23, 42, 0.25)', 
                    backdropFilter: 'blur(12px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000000, overflow: 'hidden',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, sans-serif'
                }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 20 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 26, mass: 0.7 }}
                    style={{
                        width: '94vw', height: '90vh',
                        backgroundColor: 'rgba(255, 255, 255, 0.85)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.6)', 
                        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0,0,0,0.04)', 
                        display: 'flex', overflow: 'hidden'
                    }}
                >
                    <Sidebar 
                        chatHistory={chatHistory} 
                        currentChatId={currentChatId} 
                        onSelectChat={setCurrentChatId} 
                        onNewChat={() => { setCurrentChatId(null); setMessages([]); setInput(''); }} 
                        isCollapsed={isCollapsed}
                        setIsCollapsed={setIsCollapsed}
                    />

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: 'transparent' }}>
                        {/* Smooth Header */}
                        <div style={{
                            height: '60px', borderBottom: '1px solid rgba(0,0,0,0.06)',
                            padding: '0 24px', display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', backgroundColor: 'rgba(255,255,255,0.4)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', letterSpacing: '-0.2px' }}>
                                    Magna Production Engine
                                </span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: 'rgba(0,0,0,0.05)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onClose}
                                style={{
                                    border: 'none', background: 'transparent', width: '28px', height: '28px',
                                    borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', color: '#64748b', fontSize: '12px'
                                }}
                            >
                                ✕
                            </motion.button>
                        </div>

                        {/* Interactive Main Dynamic Zone */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#fdfdfe' }}>
                            <AnimatePresence mode="wait">
                                {activeMessages.length === 0 ? (
                                    <motion.div 
                                        key="welcome"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 24px' }}
                                    >
                                        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#0f172a', margin: '0 0 10px 0', letterSpacing: '-1px' }}>
                                                Design with absolute intelligence.
                                            </h1>
                                            <p style={{ fontSize: '14px', color: '#64748b', margin: 0, fontWeight: '450' }}>
                                                Execute runtime tasks, configure workflows or stream active database modules.
                                            </p>
                                        </div>

                                        {/* Luxury Monolithic Input Box with Black Lucide Microphone */}
                                        <div style={{
                                            width: '100%', maxWidth: '640px', backgroundColor: '#ffffff',
                                            border: '1px solid #e2e8f0', borderRadius: '14px', padding: '10px 14px',
                                            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0,0,0,0.01)',
                                            position: 'relative'
                                        }} className="magna-glow-input">
                                            <input
                                                type="text"
                                                placeholder="Ask Magna anything or type instructions..."
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '14px', color: '#0f172a' }}
                                            />
                                            
                                            {/* Micro-spring Audio trigger */}
                                            <motion.button
                                                whileHover={{ scale: 1.08, backgroundColor: '#f1f5f9' }}
                                                whileTap={{ scale: 0.92 }}
                                                onClick={handleVoiceInput}
                                                style={{
                                                    background: isListening ? '#fef2f2' : 'transparent',
                                                    border: isListening ? '1px solid #fca5a5' : 'none',
                                                    borderRadius: '8px', padding: '6px', cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    transition: 'background-color 0.15s'
                                                }}
                                                title="Speak via Audio Input"
                                            >
                                                <MicIcon />
                                            </motion.button>

                                            <motion.button
                                                whileHover={{ scale: 1.02, y: -0.5 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => handleSend()}
                                                style={{
                                                    background: '#0f172a', border: 'none', color: '#ffffff',
                                                    padding: '8px 16px', borderRadius: '10px', fontSize: '12.5px',
                                                    fontWeight: '600', cursor: 'pointer'
                                                }}
                                            >
                                                Execute
                                            </motion.button>
                                        </div>

                                        <BentoWelcome onCardClick={handleSend} />
                                    </motion.div>
                                ) : (
                                    <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <ChatArea messages={activeMessages} />
                                        
                                        {/* Sticky Bottom Bar with Black Lucide Microphone */}
                                        <div style={{ padding: '20px 24px', backgroundColor: '#ffffff', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                                            <div style={{
                                                maxWidth: '800px', margin: '0 auto', backgroundColor: '#ffffff',
                                                border: '1px solid #e2e8f0', borderRadius: '12px', padding: '8px 12px',
                                                display: 'flex', alignItems: 'center', gap: '12px',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                                            }} className="magna-glow-input">
                                                <input
                                                    type="text"
                                                    placeholder="Reply to Magna..."
                                                    value={input}
                                                    onChange={(e) => setInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                                    style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '13.5px', color: '#0f172a' }}
                                                />

                                                {/* Micro-spring Audio trigger */}
                                                <motion.button
                                                    whileHover={{ scale: 1.08, backgroundColor: '#f1f5f9' }}
                                                    whileTap={{ scale: 0.92 }}
                                                    onClick={handleVoiceInput}
                                                    style={{
                                                        background: isListening ? '#fef2f2' : 'transparent',
                                                        border: isListening ? '1px solid #fca5a5' : 'none',
                                                        borderRadius: '8px', padding: '6px', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        transition: 'background-color 0.15s'
                                                    }}
                                                    title="Speak via Audio Input"
                                                >
                                                    <MicIcon />
                                                </motion.button>

                                                <button onClick={() => handleSend()} style={{ background: '#0f172a', border: 'none', color: '#ffffff', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}